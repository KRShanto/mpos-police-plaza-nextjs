"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Product } from "@/generated/prisma";
import { ImagePlus, Loader2, X, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { createProduct } from "@/actions/create-product";
import { updateProduct } from "@/actions/update-product";
import { deleteProduct } from "@/actions/delete-product";
import { deleteTemporaryImage } from "@/actions/delete-temporary-image";

type Mode = "view" | "create" | "edit";

interface ProductModalProps {
  mode: Mode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product & { category: Category | null };
  onDelete?: () => void;
  onInitiateEdit?: () => void;
}

export function ProductModal({
  mode,
  open,
  onOpenChange,
  product,
  onDelete,
  onInitiateEdit,
}: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFileForUpload, setSelectedFileForUpload] =
    useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isReadOnly = mode === "view";

  useEffect(() => {
    setImagePreview(product?.imageUrl || null);
    setSelectedFileForUpload(null);
  }, [product, open]);

  const handleImageClick = () => {
    if (isReadOnly) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFileForUpload(null);
      setImagePreview(product?.imageUrl || null);
      return;
    }

    setSelectedFileForUpload(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) {
      console.error("Form reference is not available.");
      setLoading(false);
      return;
    }
    setLoading(true);

    let uploadedImageUrl: string | null | undefined = product?.imageUrl;
    if (mode === "create") uploadedImageUrl = null;

    if (selectedFileForUpload) {
      const formDataUpload = new FormData();
      formDataUpload.append("image", selectedFileForUpload);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });
        if (!response.ok) throw new Error("Image upload failed");
        const uploadData = await response.json();
        uploadedImageUrl = uploadData.path;

        if (
          mode === "edit" &&
          product?.imageUrl &&
          product.imageUrl !== uploadedImageUrl
        ) {
          await deleteTemporaryImage(product.imageUrl);
        }
      } catch (error) {
        console.error("Error during image upload process:", error);
        setLoading(false);
        return;
      }
    }

    const submittedFormData = new FormData(formRef.current);
    const productData = {
      name: submittedFormData.get("name") as string,
      category: submittedFormData.get("category") as string,
      brand: submittedFormData.get("brand") as string | undefined,
      size: submittedFormData.get("size") as string | undefined,
      cost: Number(submittedFormData.get("cost")),
      sell: Number(submittedFormData.get("sell")),
      barcode: submittedFormData.get("barcode") as string,
      quantity: Number(submittedFormData.get("stock")),
      imageUrl: uploadedImageUrl,
    };

    try {
      const result =
        mode === "edit" && product
          ? await updateProduct(product.id, productData)
          : await createProduct(productData);

      if (!result.success) throw new Error(result.error as string);

      setSelectedFileForUpload(null);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product || !onDelete) return;

    setLoading(true);
    try {
      const result = await deleteProduct(product.id);
      if (!result.success) {
        throw new Error(result.error);
      }
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedFileForUpload(null);
      setImagePreview(product?.imageUrl || null);
    }
    onOpenChange(isOpen);
  };

  const renderField = (
    label: string,
    value: string | number | null | undefined
  ) => {
    const capitalizedLabel = label.charAt(0).toUpperCase() + label.slice(1);

    if (isReadOnly) {
      return (
        <div>
          <label className="text-sm text-gray-500 block mb-1">
            {capitalizedLabel}
          </label>
          <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
            {value || "-"}
          </div>
        </div>
      );
    }

    return (
      <div>
        <Label htmlFor={label.toLowerCase()} className="text-sm text-gray-500">
          {capitalizedLabel}
        </Label>
        <Input
          id={label.toLowerCase()}
          name={label.toLowerCase()}
          defaultValue={value || ""}
          type={typeof value === "number" ? "number" : "text"}
          className="mt-1"
          required={[
            "name",
            "category",
            "barcode",
            "stock",
            "cost",
            "sell",
          ].includes(label.toLowerCase())}
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            {mode === "create"
              ? "Add Product"
              : mode === "edit"
              ? "Edit Product"
              : "Product Details"}
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image and Name Section */}
          <div className="flex gap-4">
            <div
              onClick={handleImageClick}
              className={`relative w-32 h-32 shrink-0 rounded-lg overflow-hidden ${
                isReadOnly
                  ? "bg-gray-50"
                  : "border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer bg-gray-50"
              }`}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
              ) : !isReadOnly ? (
                <div className="text-center">
                  <ImagePlus className="w-8 h-8 mx-auto text-gray-400" />
                  <p className="mt-1 text-xs text-gray-500">Upload Image</p>
                </div>
              ) : null}
              {!isReadOnly && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              )}
            </div>

            <div className="flex-1">{renderField("name", product?.name)}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderField("category", product?.category?.name)}
            {renderField("brand", product?.brand)}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderField("size", product?.size)}
            {renderField("stock", product?.quantity)}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {renderField("cost", product?.cost)}
            {renderField("sell", product?.sell)}
          </div>

          {renderField("barcode", product?.barcode)}

          <div className="grid grid-cols-3 gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            {mode === "view" ? (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    onInitiateEdit?.();
                  }}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Trash className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the product &quot;{product?.name}&quot; and
                        remove all associated data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {loading && (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        Delete Product
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Button
                type="submit"
                className="w-full col-span-2 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {mode === "edit" ? "Save Changes" : "Add Product"}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

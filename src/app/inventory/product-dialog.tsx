"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Product } from "@/generated/prisma";
import { ImagePlus, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { createProduct, updateProduct } from "@/actions/product";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product & { category: Category | null };
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
}: ProductDialogProps) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Prepare form data for upload
    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setImagePreview(data.path);
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      brand: formData.get("brand") as string,
      size: formData.get("size") as string,
      cost: Number(formData.get("cost")),
      sell: Number(formData.get("sell")),
      barcode: formData.get("barcode") as string,
      quantity: Number(formData.get("stock")),
      imageUrl: imagePreview,
    };

    try {
      const result = product
        ? await updateProduct(product.id, productData)
        : await createProduct(productData);

      if (!result.success) {
        throw new Error(result.error);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            {product ? "Edit" : "Add"} Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div
            onClick={handleImageClick}
            className="w-full h-48 bg-bg-secondary rounded-lg overflow-hidden mb-4 relative border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer flex items-center justify-center"
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Product preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center">
                <ImagePlus className="w-10 h-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">
                  Click to upload image
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div>
            <Label htmlFor="name" className="text-sm text-gray-500">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-sm text-gray-500">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              defaultValue={product?.category?.name || ""}
              className="mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="brand" className="text-sm text-gray-500">
                Brand
              </Label>
              <Input
                id="brand"
                name="brand"
                defaultValue={product?.brand || ""}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="size" className="text-sm text-gray-500">
                Size
              </Label>
              <Input
                id="size"
                name="size"
                defaultValue={product?.size || ""}
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost" className="text-sm text-gray-500">
                Cost Price
              </Label>
              <Input
                id="cost"
                name="cost"
                type="number"
                defaultValue={product?.cost}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="sell" className="text-sm text-gray-500">
                Selling Price
              </Label>
              <Input
                id="sell"
                name="sell"
                type="number"
                defaultValue={product?.sell}
                className="mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="barcode" className="text-sm text-gray-500">
                Barcode
              </Label>
              <Input
                id="barcode"
                name="barcode"
                defaultValue={product?.barcode}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="stock" className="text-sm text-gray-500">
                Stock
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                defaultValue={product?.quantity}
                className="mt-1"
                required
              />
            </div>
          </div>

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
            <Button
              type="submit"
              className="w-full col-span-2 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {product ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

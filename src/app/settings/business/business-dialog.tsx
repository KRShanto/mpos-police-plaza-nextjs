"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Organization } from "@/generated/prisma";
import { deleteTemporaryImage } from "@/actions/delete-temporary-image";
import { updateBusiness } from "@/actions/update-business";
import { toast } from "sonner";

export function BusinessDialogContent({
  organization,
}: {
  organization: Organization;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    organization.imageUrl
  );
  const [selectedFileForUpload, setSelectedFileForUpload] =
    useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setImagePreview(organization.imageUrl);
    setSelectedFileForUpload(null);
  }, [organization, open]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFileForUpload(null);
      setImagePreview(organization.imageUrl);
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
      return;
    }
    setLoading(true);

    try {
      let uploadedImageUrl: string | null = organization.imageUrl;

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

          // Delete previous image if exists and new image is uploaded
          if (
            organization.imageUrl &&
            organization.imageUrl !== uploadedImageUrl
          ) {
            await deleteTemporaryImage(organization.imageUrl);
          }
        } catch (error) {
          console.error("Error during image upload:", error);
          setLoading(false);
          toast.error("Failed to upload image");
          return;
        }
      }

      const formData = new FormData(formRef.current);
      if (uploadedImageUrl) {
        formData.append("imageUrl", uploadedImageUrl);
      }

      const result = await updateBusiness(formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      setSelectedFileForUpload(null);
      setOpen(false);
    } catch (error) {
      console.error("Error updating business:", error);
      toast.error("Failed to update business information");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedFileForUpload(null);
      setImagePreview(organization.imageUrl);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        <div className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">💼</div>
          <h2 className="text-sm font-semibold text-gray-800 text-center">
            Business Information
          </h2>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Business Information
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pb-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4 h-[44vh] overflow-y-auto p-3"
          >
            <div className="flex gap-4">
              <div
                onClick={handleImageClick}
                className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer bg-gray-50"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Company logo preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center h-full flex flex-col items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <p className="mt-1 text-xs text-gray-500">Upload Logo</p>
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
              <div className="flex-1">
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter company name"
                  required
                  defaultValue={organization.name}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter company email"
                required
                defaultValue={organization.email}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter company address"
                defaultValue={organization.address || ""}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter company phone number"
                defaultValue={organization.phone || ""}
              />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-4 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleModalOpenChange(false)}
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                formRef.current?.requestSubmit();
              }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

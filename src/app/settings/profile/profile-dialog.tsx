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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { updateProfile } from "@/actions/profile-update";
import { deleteTemporaryImage } from "@/actions/delete-temporary-image";
import { User } from "@/generated/prisma";

export function ProfileDialogContent({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.imageUrl
  );
  const [selectedFileForUpload, setSelectedFileForUpload] =
    useState<File | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(
    user.age || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setImagePreview(user.imageUrl);
    setSelectedFileForUpload(null);
  }, [user, open]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDateOfBirthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    if (dob) {
      const age = calculateAge(dob);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFileForUpload(null);
      setImagePreview(user.imageUrl);
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
      let uploadedImageUrl: string | null = user.imageUrl;

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
          if (user.imageUrl && user.imageUrl !== uploadedImageUrl) {
            await deleteTemporaryImage(user.imageUrl);
          }
        } catch (error) {
          console.error("Error during image upload:", error);
          setLoading(false);
          return;
        }
      }

      const formData = new FormData(formRef.current);
      if (uploadedImageUrl) {
        formData.append("imageUrl", uploadedImageUrl);
      }

      const result = await updateProfile(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      setSelectedFileForUpload(null);
      setOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedFileForUpload(null);
      setImagePreview(user.imageUrl);
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleModalOpenChange}>
      <DialogTrigger asChild>
        <div className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center">
          <div className="text-4xl mb-3">👤</div>
          <h2 className="text-sm font-semibold text-gray-800 text-center">
            Update Profile
          </h2>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Update Profile
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
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-center h-full flex flex-col items-center justify-center">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <p className="mt-1 text-xs text-gray-500">Upload Image</p>
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  defaultValue={user.name}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={
                    user.dateOfBirth
                      ? user.dateOfBirth.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleDateOfBirthChange}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select name="gender" defaultValue={user.gender || "other"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter your address"
                defaultValue={user.address || ""}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  defaultValue={user.phone || ""}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  placeholder="Enter your age"
                  value={calculatedAge || ""}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                defaultValue={user.email}
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

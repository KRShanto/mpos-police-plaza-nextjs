"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

type EmployeeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EmployeeModal({ open, onOpenChange }: EmployeeModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-full w-full sm:max-w-[500px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto"
        hideClose
      >
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-lg font-semibold text-center w-full">
            Add Employee
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <form className="p-4 space-y-4 h-[44vh] overflow-y-auto">
            <div className="flex flex-col items-center gap-2 mb-4">
              <div
                onClick={handleImageClick}
                className="relative w-36 h-36 rounded-lg overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center cursor-pointer"
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Employee preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <p className="mt-1 text-xs text-gray-500">Employee Image</p>
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                Employee Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter name"
                required
                className="bg-gray-100 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  className="bg-gray-100 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  placeholder="Gender"
                  className="bg-gray-100 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="Enter address"
                className="bg-gray-100 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter phone"
                  className="bg-gray-100 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="Enter age"
                  className="bg-gray-100 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email"
                className="bg-gray-100 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfHire">Date of Hire</Label>
                <Input
                  id="dateOfHire"
                  name="dateOfHire"
                  type="date"
                  className="bg-gray-100 text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Enter job title"
                  className="bg-gray-100 text-sm"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="workSchedule">Work Schedule</Label>
              <Input
                id="workSchedule"
                name="workSchedule"
                placeholder="e.g. 9AM - 12PM"
                className="bg-gray-100 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (TK)</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                placeholder="Enter salary"
                className="bg-gray-100 text-sm"
              />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full flex items-center justify-center gap-2 bg-transparent text-black hover:bg-gray-100"
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button
              type="submit"
              form="employee-form"
              className="w-full flex items-center justify-center gap-2 bg-fg-primary text-white font-semibold"
            >
              Add Employee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

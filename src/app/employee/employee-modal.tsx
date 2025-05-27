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
import { ImagePlus, X, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import type { EmployeeType } from "./employee-client";

type Mode = "view" | "create" | "edit";

interface EmployeeModalProps {
  mode: Mode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: EmployeeType;
  onDelete?: () => void;
  onInitiateEdit?: () => void;
}

export function EmployeeModal({
  mode,
  open,
  onOpenChange,
  employee,
  onDelete,
  onInitiateEdit,
}: EmployeeModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isReadOnly = mode === "view";

  useEffect(() => {
    setImagePreview(employee?.user?.imageUrl || null);
  }, [employee, open]);

  const handleImageClick = () => {
    if (isReadOnly) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview(employee?.user?.imageUrl || null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Placeholder for submit logic
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onOpenChange(false);
  };

  const renderField = (
    label: string,
    value: string | number | null | undefined,
    type: string = "text"
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
          type={type}
          className="mt-1"
        />
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            {mode === "create"
              ? "Add Employee"
              : mode === "edit"
              ? "Edit Employee"
              : "Employee Details"}
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
                className={`relative w-32 h-32 shrink-0 rounded-lg overflow-hidden ${
                  isReadOnly
                    ? "bg-gray-50"
                    : "border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors cursor-pointer bg-gray-50"
                }`}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Employee preview"
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
              <div className="flex-1">
                {renderField("name", employee?.user?.name)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {renderField(
                "dob",
                employee?.user?.dateOfBirth
                  ? new Date(employee.user.dateOfBirth).toLocaleDateString()
                  : "-",
                "date"
              )}
              {renderField("gender", employee?.user?.gender)}
            </div>
            {renderField("address", employee?.user?.address)}
            <div className="grid grid-cols-2 gap-4">
              {renderField("phone", employee?.user?.phone)}
              {renderField("age", employee?.user?.age, "number")}
            </div>
            {renderField("email", employee?.user?.email, "email")}
            <div className="grid grid-cols-2 gap-4">
              {renderField(
                "dateOfHire",
                employee?.dateOfHire
                  ? new Date(employee.dateOfHire).toLocaleDateString()
                  : "-",
                "date"
              )}
              {renderField("jobTitle", employee?.jobTitle)}
            </div>
            {renderField("workSchedule", employee?.workSchedule)}
            {renderField("salary", employee?.salary, "number")}
          </form>
          <div className="grid grid-cols-3 gap-3 pt-4 border-t mt-4 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
            {isReadOnly ? (
              <>
                <Button
                  type="button"
                  onClick={onInitiateEdit}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Pencil className="w-4 h-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Trash className="w-4 h-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the employee &quot;{employee?.user?.name}&quot;
                        and remove all associated data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={onDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Employee
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : (
              <Button
                type="submit"
                className="w-full col-span-2 flex items-center justify-center gap-2"
              >
                {mode === "edit"
                  ? "Save Changes"
                  : mode === "create"
                  ? "Add Employee"
                  : ""}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

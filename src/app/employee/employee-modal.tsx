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
import { ImagePlus, X, Pencil, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import type { EmployeeType } from "./employee-client";
import { createEmployee } from "@/actions/create-employee";
import { updateEmployee } from "@/actions/update-employee";
import { deleteEmployee } from "@/actions/delete-employee";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFileForUpload, setSelectedFileForUpload] =
    useState<File | null>(null);
  const [age, setAge] = useState<number | undefined>(
    employee?.age || undefined
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isReadOnly = mode === "view";

  useEffect(() => {
    setImagePreview(employee?.imageUrl || null);
    setAge(employee?.age || undefined);
  }, [employee]);

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDOBChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const calculatedAge = calculateAge(e.target.value);
      setAge(calculatedAge);
    }
  };

  const handleImageClick = () => {
    if (isReadOnly) return;
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFileForUpload(null);
      setImagePreview(employee?.imageUrl || null);
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
    if (!formRef.current) return;
    setLoading(true);

    let uploadedImageUrl: string | null | undefined = employee?.imageUrl;
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
      } catch (error) {
        console.error("Error during image upload process:", error);
        setLoading(false);
        return;
      }
    }

    const formData = new FormData(formRef.current);
    const employeeData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      dateOfBirth: formData.get("dateOfBirth")
        ? new Date(formData.get("dateOfBirth") as string)
        : undefined,
      gender: formData.get("gender")?.toString(),
      address: formData.get("address")?.toString(),
      phone: formData.get("phone")?.toString(),
      age: formData.get("age") ? Number(formData.get("age")) : undefined,
      dateOfHire: formData.get("dateOfHire")
        ? new Date(formData.get("dateOfHire") as string)
        : new Date(),
      jobTitle: formData.get("jobTitle")?.toString() || "",
      workSchedule: formData.get("workSchedule")?.toString() || "",
      salary: formData.get("salary") ? Number(formData.get("salary")) : 0,
      imageUrl: uploadedImageUrl || undefined,
      ...(mode === "create" && {
        password: formData.get("password")?.toString() || "",
      }),
    };

    console.log("Form Data:", {
      name: formData.get("name"),
      email: formData.get("email"),
      dateOfHire: formData.get("dateOfHire"),
      jobTitle: formData.get("jobTitle"),
      workSchedule: formData.get("workSchedule"),
      salary: formData.get("salary"),
    });

    console.log("Employee Data:", employeeData);

    // Validate required fields and their types
    const validationErrors = [];
    if (!employeeData.name) validationErrors.push("Name");
    if (!employeeData.email) validationErrors.push("Email");
    if (!employeeData.jobTitle) validationErrors.push("Job Title");
    if (!employeeData.workSchedule) validationErrors.push("Work Schedule");
    if (!employeeData.salary) validationErrors.push("Salary");
    if (!employeeData.dateOfHire) validationErrors.push("Date of Hire");

    // Validate passwords for create mode
    if (mode === "create") {
      const password = formData.get("password")?.toString();
      const confirmPassword = formData.get("confirmPassword")?.toString();

      if (!password) validationErrors.push("Password");
      if (!confirmPassword) validationErrors.push("Confirm Password");

      if (password && confirmPassword && password !== confirmPassword) {
        toast.error("Passwords do not match");
        setLoading(false);
        return;
      }

      if (password && password.length < 6) {
        toast.error("Password must be at least 6 characters long");
        setLoading(false);
        return;
      }
    }

    if (validationErrors.length > 0) {
      toast.error(
        `Please fill in the following required fields: ${validationErrors.join(
          ", "
        )}`
      );
      setLoading(false);
      return;
    }

    try {
      let result;
      if (mode === "edit" && employee) {
        // For editing, exclude password from data
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...updateData } =
          employeeData as typeof employeeData & { password?: string };
        result = await updateEmployee(employee.id, updateData);
      } else {
        // For creating, ensure password is included
        result = await createEmployee(
          employeeData as typeof employeeData & { password: string }
        );
      }

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving employee:", error);
      toast.error("Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!employee || !onDelete) return;

    setLoading(true);
    try {
      const result = await deleteEmployee(employee.id);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    } finally {
      setLoading(false);
    }
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
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={employee?.name || ""}
                  required
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {mode === "view" && (
                <div>
                  <Label>Employee ID</Label>
                  <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
                    {employee?.employeeId || "-"}
                  </div>
                </div>
              )}
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  defaultValue={
                    employee?.dateOfBirth
                      ? new Date(employee.dateOfBirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  readOnly={isReadOnly}
                  onChange={handleDOBChange}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  defaultValue={employee?.gender || ""}
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                defaultValue={employee?.address || ""}
                readOnly={isReadOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={employee?.phone || ""}
                  readOnly={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  type="number"
                  id="age"
                  name="age"
                  value={age || ""}
                  onChange={(e) =>
                    setAge(e.target.value ? Number(e.target.value) : undefined)
                  }
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                id="email"
                name="email"
                defaultValue={employee?.email || ""}
                required
                readOnly={isReadOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfHire">
                  Date of Hire <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  id="dateOfHire"
                  name="dateOfHire"
                  defaultValue={
                    employee?.dateOfHire
                      ? new Date(employee.dateOfHire)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  required
                  readOnly={isReadOnly}
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  defaultValue={employee?.jobTitle || ""}
                  required
                  readOnly={isReadOnly}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="workSchedule">
                Work Schedule <span className="text-red-500">*</span>
              </Label>
              <Input
                id="workSchedule"
                name="workSchedule"
                defaultValue={employee?.workSchedule || ""}
                required
                readOnly={isReadOnly}
              />
            </div>

            <div>
              <Label htmlFor="salary">
                Salary <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="salary"
                name="salary"
                defaultValue={employee?.salary || ""}
                required
                readOnly={isReadOnly}
              />
            </div>

            {mode === "create" && (
              <>
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="Enter password"
                  />
                </div>

                <div>
                  <Label htmlFor="confirmPassword">
                    Confirm Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Confirm password"
                  />
                </div>
              </>
            )}
          </form>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t mt-4 mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full flex items-center justify-center gap-2"
              disabled={loading}
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
                      disabled={loading}
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
                        delete the employee &quot;{employee?.name}&quot; and
                        remove all associated data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        disabled={loading}
                      >
                        {loading && (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
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
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {mode === "edit" ? "Save Changes" : "Add Employee"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

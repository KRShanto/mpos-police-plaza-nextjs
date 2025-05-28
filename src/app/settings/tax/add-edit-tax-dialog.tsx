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
import { Loader2, Trash2, X } from "lucide-react";
import { useState, useRef } from "react";
import { Tax } from "@/generated/prisma";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { createTax } from "@/actions/create-tax";
import { updateTax } from "@/actions/update-tax";
import { deleteTax } from "@/actions/delete-tax";

interface AddEditTaxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tax: Tax | null;
}

export function AddEditTaxDialog({
  open,
  onOpenChange,
  tax,
}: AddEditTaxDialogProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      const isDefault = formData.get("isDefault") === "on";
      const name = formData.get("name") as string;
      const value = parseFloat(formData.get("value") as string);

      const result = tax
        ? await updateTax({
            id: tax.id,
            name,
            value,
            default: isDefault,
          })
        : await createTax({
            name,
            value,
            default: isDefault,
          });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving tax:", error);
      toast.error("Failed to save tax");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tax) return;

    setLoading(true);
    try {
      const result = await deleteTax(tax.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting tax:", error);
      toast.error("Failed to delete tax");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            {tax ? "Edit Tax" : "Add Tax"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pb-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4 h-[44vh] overflow-y-auto p-3"
          >
            <div>
              <Label htmlFor="name">Tax Name (GST/VAT)</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter tax name"
                defaultValue={tax?.name || ""}
                required
              />
            </div>

            <div>
              <Label htmlFor="value">Tax Value in %</Label>
              <Input
                id="value"
                name="value"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Enter tax percentage"
                defaultValue={tax?.value || ""}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                name="isDefault"
                defaultChecked={tax?.default || false}
              />
              <Label
                htmlFor="isDefault"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Default Add to Bill
              </Label>
            </div>
          </form>

          <div
            className={`grid ${
              tax ? "grid-cols-3" : "grid-cols-2"
            } gap-3 pt-4 border-t mt-4 mb-4`}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel
            </Button>
            {tax ? (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}{" "}
                  Delete
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
                  Update
                </Button>
              </>
            ) : (
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
                Add
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

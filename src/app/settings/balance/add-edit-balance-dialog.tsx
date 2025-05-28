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
import { Due } from "@/generated/prisma";
import { toast } from "sonner";
import { createDue } from "@/actions/create-due";
import { updateDue } from "@/actions/update-due";
import { deleteDue } from "@/actions/delete-due";
import { Checkbox } from "@/components/ui/checkbox";

interface AddEditBalanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  due: Due | null;
}

export function AddEditBalanceDialog({
  open,
  onOpenChange,
  due,
}: AddEditBalanceDialogProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      const name = formData.get("name") as string;
      const minLoyalty = parseFloat(formData.get("minLoyalty") as string);
      const maxDue = parseFloat(formData.get("maxDue") as string);
      const isDefault = formData.get("default") === "on";

      const result = due
        ? await updateDue({
            id: due.id,
            name,
            minLoyalty,
            maxDue,
            default: isDefault,
          })
        : await createDue({
            name,
            minLoyalty,
            maxDue,
            default: isDefault,
          });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving due balance:", error);
      toast.error("Failed to save due balance");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!due) return;

    setLoading(true);
    try {
      const result = await deleteDue(due.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting due balance:", error);
      toast.error("Failed to delete due balance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            {due ? "Edit Due Balance" : "Add Due Balance"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pb-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4 h-[44vh] overflow-y-auto p-3"
          >
            <div>
              <Label htmlFor="name">Due Balance Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter due balance name"
                defaultValue={due?.name || ""}
                required
              />
            </div>

            <div>
              <Label htmlFor="minLoyalty">Minimum Loyalty Points</Label>
              <Input
                id="minLoyalty"
                name="minLoyalty"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter minimum loyalty points"
                defaultValue={due?.minLoyalty || ""}
                required
              />
            </div>

            <div>
              <Label htmlFor="maxDue">Maximum Due Amount</Label>
              <Input
                id="maxDue"
                name="maxDue"
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter maximum due amount"
                defaultValue={due?.maxDue || ""}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="default"
                name="default"
                defaultChecked={due?.default || false}
              />
              <Label
                htmlFor="default"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Default Add to Bill
              </Label>
            </div>
          </form>

          <div
            className={`grid ${
              due ? "grid-cols-3" : "grid-cols-2"
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
            {due ? (
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

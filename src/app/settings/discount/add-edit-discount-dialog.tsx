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
import { Discount, Product } from "@/generated/prisma";
import { toast } from "sonner";
import { createDiscount } from "@/actions/create-discount";
import { updateDiscount } from "@/actions/update-discount";
import { deleteDiscount } from "@/actions/delete-discount";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddEditDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: (Discount & { product: Product }) | null;
  products: Product[];
}

export function AddEditDiscountDialog({
  open,
  onOpenChange,
  discount,
  products,
}: AddEditDiscountDialogProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    discount?.productId || ""
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      const name = formData.get("name") as string;
      const value = parseFloat(formData.get("value") as string);
      const startDate = new Date(formData.get("startDate") as string);
      const endDate = new Date(formData.get("endDate") as string);

      if (endDate < startDate) {
        toast.error("End date cannot be before start date");
        return;
      }

      if (!selectedProductId) {
        toast.error("Please select a product");
        return;
      }

      const result = discount
        ? await updateDiscount({
            id: discount.id,
            name,
            value,
            startDate,
            endDate,
            productId: selectedProductId,
          })
        : await createDiscount({
            name,
            value,
            startDate,
            endDate,
            productId: selectedProductId,
          });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving discount:", error);
      toast.error("Failed to save discount");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!discount) return;

    setLoading(true);
    try {
      const result = await deleteDiscount(discount.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting discount:", error);
      toast.error("Failed to delete discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            {discount ? "Edit Discount" : "Add Discount"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pb-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-4 h-[44vh] overflow-y-auto p-3"
          >
            <div>
              <Label htmlFor="name">Discount Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter discount name"
                defaultValue={discount?.name || ""}
                required
              />
            </div>

            <div>
              <Label htmlFor="value">Discount Value in %</Label>
              <Input
                id="value"
                name="value"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="Enter discount percentage"
                defaultValue={discount?.value || ""}
                required
              />
            </div>

            <div>
              <Label htmlFor="product">Product</Label>
              <Select
                value={selectedProductId}
                onValueChange={setSelectedProductId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  defaultValue={
                    discount?.startDate
                      ? new Date(discount.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  defaultValue={
                    discount?.endDate
                      ? new Date(discount.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  required
                />
              </div>
            </div>
          </form>

          <div
            className={`grid ${
              discount ? "grid-cols-3" : "grid-cols-2"
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
            {discount ? (
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

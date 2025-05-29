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
import { Loader2, Trash2, X, Check, ChevronsUpDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Discount, Product } from "@/generated/prisma";
import { toast } from "sonner";
import { createDiscount } from "@/actions/create-discount";
import { updateDiscount } from "@/actions/update-discount";
import { deleteDiscount } from "@/actions/delete-discount";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface AddEditDiscountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  discount: (Discount & { discountProducts: { product: Product }[] }) | null;
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
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    discount?.discountProducts.map((dp) => dp.product.id) || []
  );
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    if (discount) {
      setSelectedProductIds(
        discount.discountProducts.map((dp) => dp.product.id)
      );
    } else {
      setSelectedProductIds([]);
    }
  }, [discount]);

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

      if (selectedProductIds.length === 0) {
        toast.error("Please select at least one product");
        return;
      }

      const result = discount
        ? await updateDiscount({
            id: discount.id,
            name,
            value,
            startDate,
            endDate,
            productIds: selectedProductIds,
          })
        : await createDiscount({
            name,
            value,
            startDate,
            endDate,
            productIds: selectedProductIds,
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
              <Label>Products</Label>
              <Popover open={commandOpen} onOpenChange={setCommandOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={commandOpen}
                    className="w-full justify-between"
                  >
                    {selectedProductIds.length > 0
                      ? `${selectedProductIds.length} product${
                          selectedProductIds.length === 1 ? "" : "s"
                        } selected`
                      : "Select products..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search products..."
                      className="border-0 focus:ring-0"
                    />
                    <CommandEmpty>No products found.</CommandEmpty>
                    <CommandGroup className="max-h-[200px] overflow-y-auto">
                      {products.map((product) => (
                        <CommandItem
                          key={product.id}
                          onSelect={() => {
                            setSelectedProductIds((prev) =>
                              prev.includes(product.id)
                                ? prev.filter((id) => id !== product.id)
                                : [...prev, product.id]
                            );
                          }}
                          className={cn(
                            "flex items-center gap-2",
                            selectedProductIds.includes(product.id) &&
                              "bg-accent"
                          )}
                        >
                          <div className="relative w-8 h-8 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.imageUrl ? (
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{product.name}</div>
                            <div className="text-xs text-gray-500">
                              {product.barcode}
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "ml-2 h-4 w-4 flex-shrink-0",
                              selectedProductIds.includes(product.id)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedProductIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedProductIds.map((id) => {
                    const product = products.find((p) => p.id === id);
                    if (!product) return null;
                    return (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="cursor-pointer pl-1"
                        onClick={() =>
                          setSelectedProductIds((prev) =>
                            prev.filter((pid) => pid !== id)
                          )
                        }
                      >
                        <div className="relative w-5 h-5 rounded overflow-hidden mr-1">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-[8px]">
                              No img
                            </div>
                          )}
                        </div>
                        {product.name}
                        <X className="ml-1 h-3 w-3" />
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>

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

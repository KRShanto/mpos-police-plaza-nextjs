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
import { Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Loyalty } from "@/generated/prisma";
import { toast } from "sonner";
import { createLoyalty } from "@/actions/create-loyalty";
import { updateLoyalty } from "@/actions/update-loyalty";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddEditLoyaltyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loyalty: Loyalty | null;
}

export function AddEditLoyaltyDialog({
  open,
  onOpenChange,
  loyalty,
}: AddEditLoyaltyDialogProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [pointsValue, setPointsValue] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [expiryPeriod, setExpiryPeriod] = useState(
    loyalty?.pointsExpiry?.toString() || "12"
  );

  // Reset form values when dialog opens/closes or loyalty changes
  useEffect(() => {
    if (loyalty) {
      setPointsValue(loyalty.conversionRatePoints.toString());
      setDiscountValue(loyalty.conversionRateDiscount.toString());
    } else {
      setPointsValue("");
      setDiscountValue("");
    }
  }, [loyalty, open]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      const name = formData.get("name") as string;
      const amountRate = parseFloat(formData.get("amountRate") as string);
      const conversionRatePoints = parseFloat(pointsValue || "0");
      const conversionRateDiscount = parseFloat(discountValue || "0");
      const pointsExpiry = parseInt(expiryPeriod);
      const isDefault = formData.get("default") === "on";

      const result = loyalty
        ? await updateLoyalty({
            id: loyalty.id,
            name,
            amountRate,
            conversionRatePoints,
            conversionRateDiscount,
            pointsExpiry,
            default: isDefault,
          })
        : await createLoyalty({
            name,
            amountRate,
            conversionRatePoints,
            conversionRateDiscount,
            pointsExpiry,
            default: isDefault,
          });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving loyalty program:", error);
      toast.error("Failed to save loyalty program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Loyalty Points Details
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Loyalty Point Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Loyalty Point Name"
                defaultValue={loyalty?.name || ""}
                className="bg-gray-50"
                required
              />
            </div>

            <div>
              <Label htmlFor="amountRate">Per Points Amount Rate</Label>
              <Input
                id="amountRate"
                name="amountRate"
                type="text"
                placeholder="0.00 TK"
                defaultValue={loyalty?.amountRate || ""}
                className="bg-gray-50"
                required
              />
            </div>

            <div>
              <Label>Points Conversion Rate</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={pointsValue}
                  onChange={(e) => setPointsValue(e.target.value)}
                  type="text"
                  placeholder="0.00 Points"
                  className="bg-gray-50"
                />
                <span>=</span>
                <Input
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  type="text"
                  placeholder="0.00 TK Discount"
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div>
              <Label>Points Expiry Period</Label>
              <Select value={expiryPeriod} onValueChange={setExpiryPeriod}>
                <SelectTrigger className="bg-gray-50">
                  <SelectValue placeholder="e.g. 12 months from the date of earning" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                  <SelectItem value="24">24 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="default"
                name="default"
                defaultChecked={loyalty?.default || false}
              />
              <Label htmlFor="default" className="text-gray-600">
                Default Add to Bill
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {loyalty ? "Update" : "Add"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

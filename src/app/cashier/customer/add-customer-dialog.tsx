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
import { Customer } from "@/generated/prisma";
import { Loader2, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { createCustomer } from "@/actions/create-customer";

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (customer: Customer) => void;
}

export function AddCustomerDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddCustomerDialogProps) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    try {
      const formData = new FormData(formRef.current);
      const name = formData.get("name") as string;
      const phone = formData.get("phone") as string;

      const result = await createCustomer({
        name,
        phone,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onSuccess(result.customer as Customer);
      onOpenChange(false);
      formRef.current.reset();
    } catch (error) {
      console.error("Error creating customer:", error);
      toast.error("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Add New Customer
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-fg-primary hover:bg-fg-secondary"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Customer
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

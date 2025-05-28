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
import { Textarea } from "@/components/ui/textarea";
import { Loader2, X } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { createFeedback } from "@/actions/create-feedback";

interface AddFeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFeedbackDialog({
  open,
  onOpenChange,
}: AddFeedbackDialogProps) {
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
      const rating = parseInt(formData.get("rating") as string);
      const feedback = formData.get("feedback") as string;

      if (rating < 1 || rating > 10) {
        toast.error("Rating must be between 1 and 10");
        return;
      }

      const result = await createFeedback({
        name,
        phone,
        rating,
        feedback,
      });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(result.success);
      onOpenChange(false);
      formRef.current.reset();
    } catch (error) {
      console.error("Error creating feedback:", error);
      toast.error("Failed to create feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Add Customer Feedback
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your contact number"
                required
              />
            </div>

            <div>
              <Label htmlFor="rating">Rating (1-10)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="1"
                max="10"
                placeholder="Enter your experience rating"
                required
              />
            </div>

            <div>
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                name="feedback"
                placeholder="How was your shopping experience?"
                className="h-32"
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
                Submit Feedback
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

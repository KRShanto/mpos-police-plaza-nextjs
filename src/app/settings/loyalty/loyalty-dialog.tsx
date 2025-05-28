"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { AddEditLoyaltyDialog } from "./add-edit-loyalty-dialog";
import { Loyalty } from "@/generated/prisma";

interface LoyaltyDialogContentProps {
  loyalties: Loyalty[];
}

export function LoyaltyDialogContent({ loyalties }: LoyaltyDialogContentProps) {
  const [open, setOpen] = useState(false);
  const [addLoyaltyOpen, setAddLoyaltyOpen] = useState(false);
  const [selectedLoyalty, setSelectedLoyalty] = useState<Loyalty | null>(null);

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedLoyalty(null);
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleModalOpenChange}>
        <DialogTrigger asChild>
          <div className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">🎁</div>
            <h2 className="text-sm font-semibold text-gray-800 text-center">
              Loyalty Points
            </h2>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
          <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold text-center w-full">
              Loyalty Points
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pb-0">
            <div className="h-[44vh] overflow-y-auto p-3">
              {loyalties.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No Loyalty Program Added
                </div>
              ) : (
                <div className="space-y-3">
                  {loyalties.map((loyalty) => (
                    <div
                      key={loyalty.id}
                      onClick={() => {
                        setSelectedLoyalty(loyalty);
                        setAddLoyaltyOpen(true);
                      }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{loyalty.name}</h3>
                          <p className="text-sm text-gray-500">
                            {loyalty.amountRate} TK ={" "}
                            {loyalty.conversionRatePoints} Points
                          </p>
                          <p className="text-sm text-gray-500">
                            {loyalty.conversionRatePoints} Points ={" "}
                            {loyalty.conversionRateDiscount} TK
                          </p>
                          <p className="text-sm text-gray-500">
                            Expires in {loyalty.pointsExpiry} months
                          </p>
                        </div>
                        {loyalty.default && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t mt-4 mb-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalOpenChange(false)}
                className="w-full flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </Button>
              <Button
                type="button"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => {
                  setSelectedLoyalty(null);
                  setAddLoyaltyOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Program
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddEditLoyaltyDialog
        open={addLoyaltyOpen}
        onOpenChange={setAddLoyaltyOpen}
        loyalty={selectedLoyalty}
      />
    </>
  );
}

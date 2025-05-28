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
import { AddEditTaxDialog } from "./add-edit-tax-dialog";
import { Tax } from "@/generated/prisma";

interface TaxDialogContentProps {
  taxes: Tax[];
}

export function TaxDialogContent({ taxes }: TaxDialogContentProps) {
  const [open, setOpen] = useState(false);
  const [addTaxOpen, setAddTaxOpen] = useState(false);
  const [selectedTax, setSelectedTax] = useState<Tax | null>(null);

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedTax(null);
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleModalOpenChange}>
        <DialogTrigger asChild>
          <div className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">💲</div>
            <h2 className="text-sm font-semibold text-gray-800 text-center">
              Tax Information
            </h2>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
          <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold text-center w-full">
              Tax Information
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pb-0">
            <div className="h-[44vh] overflow-y-auto p-3">
              {taxes.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No tax values added yet
                </div>
              ) : (
                <div className="space-y-3">
                  {taxes.map((tax) => (
                    <div
                      key={tax.id}
                      onClick={() => {
                        setSelectedTax(tax);
                        setAddTaxOpen(true);
                      }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{tax.name}</h3>
                          <p className="text-sm text-gray-500">{tax.value}%</p>
                        </div>
                        {tax.default && (
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
                  setSelectedTax(null);
                  setAddTaxOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Tax
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddEditTaxDialog
        open={addTaxOpen}
        onOpenChange={setAddTaxOpen}
        tax={selectedTax}
      />
    </>
  );
}

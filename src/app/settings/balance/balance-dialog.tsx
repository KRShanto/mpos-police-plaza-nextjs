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
import { AddEditBalanceDialog } from "./add-edit-balance-dialog";
import { Due } from "@/generated/prisma";

interface BalanceDialogContentProps {
  dues: Due[];
}

export function BalanceDialogContent({ dues }: BalanceDialogContentProps) {
  const [open, setOpen] = useState(false);
  const [addDueOpen, setAddDueOpen] = useState(false);
  const [selectedDue, setSelectedDue] = useState<Due | null>(null);

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedDue(null);
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleModalOpenChange}>
        <DialogTrigger asChild>
          <div className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">💰</div>
            <h2 className="text-sm font-semibold text-gray-800 text-center">
              Manage Due Balance
            </h2>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
          <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold text-center w-full">
              Due Balance Settings
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pb-0">
            <div className="h-[44vh] overflow-y-auto p-3">
              {dues.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No due balance settings added
                </div>
              ) : (
                <div className="space-y-3">
                  {dues.map((due) => (
                    <div
                      key={due.id}
                      onClick={() => {
                        setSelectedDue(due);
                        setAddDueOpen(true);
                      }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{due.name}</h3>
                          <p className="text-sm text-gray-500">
                            Min. Loyalty: {due.minLoyalty} points
                          </p>
                          <p className="text-sm text-gray-500">
                            Max. Due: {due.maxDue} TK
                          </p>
                        </div>
                        {due.default && (
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
                  setSelectedDue(null);
                  setAddDueOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Due Balance
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddEditBalanceDialog
        open={addDueOpen}
        onOpenChange={setAddDueOpen}
        due={selectedDue}
      />
    </>
  );
}

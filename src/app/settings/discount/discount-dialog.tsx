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
import { AddEditDiscountDialog } from "./add-edit-discount-dialog";
import { Discount, Product } from "@/generated/prisma";
import { format } from "date-fns";
import Image from "next/image";

interface DiscountDialogContentProps {
  discounts: (Discount & {
    discountProducts: {
      product: Product;
    }[];
  })[];
  products: Product[];
}

export function DiscountDialogContent({
  discounts,
  products,
}: DiscountDialogContentProps) {
  const [open, setOpen] = useState(false);
  const [addDiscountOpen, setAddDiscountOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<
    | (Discount & {
        discountProducts: {
          product: Product;
        }[];
      })
    | null
  >(null);

  const handleModalOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedDiscount(null);
    }
    setOpen(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleModalOpenChange}>
        <DialogTrigger asChild>
          <div className="w-full bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">%</div>
            <h2 className="text-sm font-semibold text-gray-800 text-center">
              Discount Values
            </h2>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
          <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
            <DialogTitle className="text-xl font-semibold text-center w-full">
              Discount Values
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 pb-0">
            <div className="h-[44vh] overflow-y-auto p-3">
              {discounts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No Discount Added
                </div>
              ) : (
                <div className="space-y-3">
                  {discounts.map((discount) => (
                    <div
                      key={discount.id}
                      onClick={() => {
                        setSelectedDiscount(discount);
                        setAddDiscountOpen(true);
                      }}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{discount.name}</h3>
                          <p className="text-sm text-gray-500">
                            {discount.value}%
                          </p>
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-1">
                              Products:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {discount.discountProducts.map(({ product }) => (
                                <div
                                  key={product.id}
                                  className="flex items-center gap-1 bg-white rounded-md p-1 border text-sm"
                                >
                                  <div className="relative w-6 h-6 rounded overflow-hidden bg-gray-100 flex-shrink-0">
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
                                  <span className="text-gray-600 truncate max-w-[100px]">
                                    {product.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>
                            Start -{" "}
                            {format(new Date(discount.startDate), "dd/MM/yyyy")}
                          </div>
                          <div>
                            End -{" "}
                            {format(new Date(discount.endDate), "dd/MM/yyyy")}
                          </div>
                        </div>
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
                  setSelectedDiscount(null);
                  setAddDiscountOpen(true);
                }}
              >
                <Plus className="w-4 h-4" /> Add Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddEditDiscountDialog
        open={addDiscountOpen}
        onOpenChange={setAddDiscountOpen}
        discount={selectedDiscount}
        products={products}
      />
    </>
  );
}

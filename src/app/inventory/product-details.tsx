"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { Product } from "./product-card";

interface ProductDetailsProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetails({
  product,
  isOpen,
  onClose,
}: ProductDetailsProps) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden" hideClose>
        <DialogHeader className="bg-fg-secondary p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-semibold text-center w-full">
            Product Details
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="w-full h-48 bg-bg-secondary rounded-lg overflow-hidden mb-4">
            <Image
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              width={100}
              height={100}
            />
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Name</label>
            <div className="w-full px-3 py-2 rounded-md bg-gray-100 text-gray-900">
              {product.name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Category
              </label>
              <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900 capitalize">
                {product.categoryId}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Brand</label>
              <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
                {product.brand}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Dress Size
              </label>
              <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
                {product.size}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Cost Price
              </label>
              <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
                {product.cost} TK
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">
                Unit Price
              </label>
              <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
                {product.sell} TK
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block mb-1">Stock</label>
              <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
                {product.stock}
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">Barcode</label>
            <div className="px-3 py-2 rounded-md bg-gray-100 text-gray-900">
              {product.barcode}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button className="w-full flex items-center justify-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
            >
              <Trash className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { Category, Product } from "@/generated/prisma";
import { useState } from "react";
import { ProductModal } from "./product-modal";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface ProductListProps {
  products: (Product & { category: Category | null })[];
}

export function ProductList({ products }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<
    (Product & { category: Category | null }) | null
  >(null);
  const [mode, setMode] = useState<"view" | "create" | "edit">("view");

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
          >
            <div className="p-4">
              <div className="w-full h-40 bg-bg-secondary rounded-lg mb-4 overflow-hidden">
                <Image
                  src={product.imageUrl || ""}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-medium mb-2">{product.name}</h3>
              <div className="text-sm text-gray-600 mb-1">{product.brand}</div>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-fg-primary">
                  {product.sell} TK
                </div>
                <div className="text-sm bg-[#E8F2EF] text-[#1C494C] px-2 py-1 rounded">
                  {product.quantity} Left
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedProduct(product);
                setMode("view");
              }}
              className="w-full bg-fg-secondary text-black py-2 flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
            >
              See Details <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <ProductModal
        mode={mode}
        open={!!selectedProduct || mode === "create"}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProduct(null);
            setMode("view");
          }
        }}
        product={selectedProduct || undefined}
        onDelete={() => setSelectedProduct(null)}
      />
    </>
  );
}

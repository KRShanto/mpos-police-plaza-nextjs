"use client";

import { Category, Product } from "@/generated/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";

type ProductWithCategory = Product & { category: Category | null };

interface ProductGridProps {
  products: ProductWithCategory[];
  onAddToCart: (product: ProductWithCategory) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 pb-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-lg overflow-hidden shadow-[0_2px_8px_rgb(0,0,0,0.15)] bg-white"
        >
          <div className="p-3 lg:p-4">
            <div className="w-full h-28 lg:h-36 bg-bg-secondary rounded-lg mb-3 lg:mb-4 overflow-hidden">
              <Image
                src={product.imageUrl || "/placeholder-product.png"}
                alt={product.name}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium mb-2 text-gray-900 text-sm lg:text-base line-clamp-2">
              {product.name}
            </h3>
            <div className="text-sm text-gray-600 mb-2 line-clamp-1">
              {product.brand}
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold text-fg-primary text-sm lg:text-base">
                {product.sell.toLocaleString()} TK
              </div>
              <div className="text-sm bg-[#E8F2EF] text-[#1C494C] px-2 py-1 rounded">
                {product.quantity} Left
              </div>
            </div>
            <Button
              onClick={() => onAddToCart(product)}
              className="w-full bg-fg-secondary text-black hover:opacity-90 transition-opacity text-sm py-2 h-auto"
              disabled={product.quantity <= 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

"use client";

import { Product } from "@/generated/prisma";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  onSeeDetails: (product: Product) => void;
}

export function ProductCard({ product, onSeeDetails }: ProductCardProps) {
  return (
    <div className="rounded-lg overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <div className="p-4">
        <div className="w-full h-40 bg-bg-secondary rounded-lg mb-4 overflow-hidden">
          <Image
            src={product.imageUrl || ""}
            alt={product.name}
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        </div>
        <h3 className="font-medium mb-2">{product.name}</h3>
        <div className="text-sm text-gray-600 mb-1">{product.brand}</div>
        <div className="flex justify-between items-center">
          <div className="font-semibold text-fg-primary">{product.sell} TK</div>
          <div className="text-sm bg-[#E8F2EF] text-[#1C494C] px-2 py-1 rounded">
            {product.quantity} Left
          </div>
        </div>
      </div>
      <button
        onClick={() => onSeeDetails(product)}
        className="w-full bg-fg-secondary text-black py-2 flex items-center justify-center gap-1 hover:opacity-90 transition-opacity"
      >
        See Details <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

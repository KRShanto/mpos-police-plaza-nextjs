"use client";

import { Product } from "@/generated/prisma";
import { useState } from "react";
import { ProductDetails } from "./product-details";
import { ProductCard } from "./product-card";
import { Category } from "@/generated/prisma";

interface ProductListProps {
  products: (Product & {
    category: Category | null;
  })[];
}

export function ProductList({ products }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<
    (Product & { category: Category | null }) | null
  >(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSeeDetails={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      <ProductDetails
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}

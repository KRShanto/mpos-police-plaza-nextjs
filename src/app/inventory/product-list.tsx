"use client";

import { useState } from "react";
import { ProductDetails } from "./product-details";
import { Product, Category } from "@/generated/prisma";
import { ProductCard } from "./product-card";

interface ProductListProps {
  products: (Product & { category: Category })[];
}

export function ProductList({ products }: ProductListProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onSeeDetails={(product) => {
              setSelectedProduct(product);
              setIsDetailsOpen(true);
            }}
          />
        ))}
      </div>

      <ProductDetails
        product={selectedProduct}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
}

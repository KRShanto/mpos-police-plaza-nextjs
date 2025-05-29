"use client";

import { useState, useEffect } from "react";
import { Category, Product } from "@/generated/prisma"; // Updated import path
import { ProductList } from "./product-list";
import { InventoryHeader } from "./header";
import { Pagination } from "@/components/ui/pagination";

type ProductWithCategory = Product & { category: Category | null };

interface InventoryClientPageProps {
  initialProducts: ProductWithCategory[];
  categories: Category[];
  totalPages: number;
}

export function InventoryClientPage({
  initialProducts,
  categories,
  totalPages,
}: InventoryClientPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] =
    useState<ProductWithCategory[]>(initialProducts);

  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredProducts(initialProducts);
    } else {
      setFilteredProducts(
        initialProducts.filter(
          (product) => product.category?.id === selectedCategory
        )
      );
    }
  }, [selectedCategory, initialProducts]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="p-6 flex-1">
        <InventoryHeader
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
            <p className="text-xl font-medium">
              {selectedCategory
                ? "No Products in this Category"
                : "No Products in the Inventory"}
            </p>
            <p className="text-sm mt-2">
              {selectedCategory
                ? "Try selecting a different category or adding new products."
                : "Click the Add Product button to get started"}
            </p>
          </div>
        ) : (
          <ProductList products={filteredProducts} />
        )}
      </div>
      {filteredProducts.length > 0 && (
        <div className="sticky bottom-0 py-4">
          <Pagination totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

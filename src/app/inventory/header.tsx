"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ProductModal } from "./product-modal";
import { Category } from "@/generated/prisma";

interface InventoryHeaderProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (value: string | null) => void;
}

export function InventoryHeader({
  categories,
  selectedCategory,
  onSelectCategory,
}: InventoryHeaderProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCategoryChange = (value: string) => {
    if (value === "all") {
      onSelectCategory(null);
    } else {
      onSelectCategory(value);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Inventory</h1>
      <div className="flex items-center gap-4">
        <Select
          value={selectedCategory === null ? "all" : selectedCategory}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className="w-[180px] bg-fg-primary text-white text-base hover:opacity-80 cursor-pointer">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-fg-secondary text-white">
            <SelectItem
              value="all"
              className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
            >
              All Categories
            </SelectItem>
            {categories.map((category) => (
              <SelectItem
                key={category.id}
                value={category.id}
                className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      <ProductModal
        mode="create"
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </div>
  );
}

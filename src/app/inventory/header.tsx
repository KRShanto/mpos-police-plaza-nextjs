"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/generated/prisma";
import { Plus } from "lucide-react";

interface InventoryHeaderProps {
  categories: Category[];
}

export function InventoryHeader({ categories }: InventoryHeaderProps) {
  return (
    <div className="flex justify-end items-center gap-4 mb-6">
      <Select defaultValue="all">
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
      <Button className="gap-2">
        <Plus className="h-5 w-5" />
        Add Product
      </Button>
    </div>
  );
}

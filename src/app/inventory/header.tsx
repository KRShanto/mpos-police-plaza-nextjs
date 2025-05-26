"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function InventoryHeader() {
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
          <SelectItem
            value="tops"
            className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
          >
            Tops
          </SelectItem>
          <SelectItem
            value="bottoms"
            className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
          >
            Bottoms
          </SelectItem>
          <SelectItem
            value="dresses"
            className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
          >
            Dresses
          </SelectItem>
          <SelectItem
            value="outerwear"
            className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
          >
            Outerwear
          </SelectItem>
          <SelectItem
            value="accessories"
            className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
          >
            Accessories
          </SelectItem>
          <SelectItem
            value="footwear"
            className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
          >
            Footwear
          </SelectItem>
          <SelectItem
            value="activewear"
            className="text-base hover:opacity-80 focus:opacity-80 cursor-pointer"
          >
            Activewear
          </SelectItem>
        </SelectContent>
      </Select>
      <Button>Add Product</Button>
    </div>
  );
}

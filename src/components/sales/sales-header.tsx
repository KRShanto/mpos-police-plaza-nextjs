"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";

export interface CustomerInfo {
  name: string;
  phone: string;
}

interface SalesHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  customerInfo: CustomerInfo;
  onCustomerInfoChange: (info: CustomerInfo) => void;
}

export function SalesHeader({
  searchQuery,
  onSearchChange,
  customerInfo,
  onCustomerInfoChange,
}: SalesHeaderProps) {
  return (
    <div className="space-y-4 mb-4">
      {/* Customer Information Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Info */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-sm font-medium">
              Customer Name
            </Label>
            <Input
              id="customer-name"
              placeholder="Enter customer name"
              value={customerInfo.name}
              onChange={(e) =>
                onCustomerInfoChange({ ...customerInfo, name: e.target.value })
              }
              className="bg-white h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer-phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="customer-phone"
              placeholder="Enter phone number"
              value={customerInfo.phone}
              onChange={(e) =>
                onCustomerInfoChange({ ...customerInfo, phone: e.target.value })
              }
              className="bg-white h-9 text-sm"
            />
          </div>
        </div>

        {/* Reserved Box */}
        <div className="space-y-2">
          <Label className="text-sm font-medium opacity-60">
            Reserved Area
          </Label>
          <div className="h-20 w-full bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-sm text-gray-400">Available</span>
          </div>
        </div>
      </div>

      {/* Product Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-xl font-semibold">Product List</h1>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search Product"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white text-sm h-9"
          />
        </div>
      </div>
    </div>
  );
}

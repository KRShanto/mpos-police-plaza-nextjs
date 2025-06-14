"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}

interface CartSectionProps {
  cartItems: CartItem[];
  customerInfo: CustomerInfo;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export function CartSection({
  cartItems,
  customerInfo,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartSectionProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxRate = 0.05; // 5%
  const tax = subtotal * taxRate;
  const discountRate = 0.1; // 10%
  const discount = subtotal * discountRate;
  const loyaltyDiscount = 1.0;
  const total = subtotal + tax - discount - loyaltyDiscount;

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;

    // TODO: Implement order creation logic
    console.log({
      customerInfo,
      cartItems,
      date,
      paymentMethod,
      subtotal,
      tax,
      discount,
      total,
    });

    // Clear cart after successful order
    onClearCart();
    alert("Order confirmed successfully!");
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold">Detail Items</h2>
      </div>

      {/* Cart Items - BIGGER - takes most space and scrollable */}
      <div className="flex-1 min-h-0">
        <div className="h-full overflow-y-auto p-3">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">No items in cart</p>
              <p className="text-sm mt-1">Add products to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 border border-gray-200 rounded bg-gray-50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.price.toLocaleString()} TK each
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="h-7 w-7 p-0 hover:bg-gray-200"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="px-2 py-1 text-sm font-medium min-w-[1.5rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="h-7 w-7 p-0 hover:bg-gray-200"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                      className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom sections - SMALLER HEIGHT by reducing spacing */}
      <div className="flex-shrink-0">
        {/* Date Section - Reduced padding */}
        <div className="px-3 py-2 border-t border-gray-200">
          <div className="space-y-1">
            <Label htmlFor="date" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white text-sm h-8"
            />
          </div>
        </div>

        {/* Payment Method - Reduced padding */}
        <div className="px-3 py-2 border-t border-gray-200">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Payment Method</h3>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="w-full bg-white text-sm h-8">
                <SelectValue />
                <div className="flex items-center gap-1 ml-auto">
                  <span className="text-sm">See more</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="digital">Digital Payment</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment Calculations - Reduced padding and spacing */}
        <div className="px-3 py-2 border-t border-gray-200">
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">Detail Payment</h3>
            <div className="space-y-0.5 text-sm">
              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>{subtotal.toLocaleString()} TK</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>{tax.toFixed(2)} TK</span>
              </div>
              <div className="flex justify-between">
                <span>Discount (10%)</span>
                <span>-{discount.toFixed(2)} TK</span>
              </div>
              <div className="flex justify-between">
                <span>Loyalty Point (124)</span>
                <span>-{loyaltyDiscount.toFixed(2)} TK</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t pt-1 mt-1">
                <span>Total Payment</span>
                <span>{total.toFixed(2)} TK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Button - Reduced padding */}
        <div className="px-3 py-2 border-t border-gray-200">
          <Button
            onClick={handleConfirmOrder}
            disabled={cartItems.length === 0}
            className="w-full bg-fg-primary hover:opacity-90 text-white py-2 text-sm"
          >
            Confirm Order
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Category, Product } from "@/generated/prisma";
import { SalesHeader, CustomerInfo } from "./sales-header";
import { ProductGrid } from "./product-grid";
import { CartSection, CartItem } from "./cart-section";
import { Button } from "@/components/ui/button";

type ProductWithCategory = Product & { category: Category | null };

interface SalesClientPageProps {
  initialProducts: ProductWithCategory[];
  categories: Category[];
  totalPages: number;
}

export function SalesClientPage({ initialProducts }: SalesClientPageProps) {
  const [allProducts] = useState<ProductWithCategory[]>(initialProducts);
  const [displayedProducts, setDisplayedProducts] = useState<
    ProductWithCategory[]
  >([]);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductWithCategory[]
  >([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const ITEMS_PER_LOAD = 9;

  // Filter products based only on search (no category filtering)
  useEffect(() => {
    let filtered = allProducts;

    // Filter by search query only
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand?.toLowerCase().includes(query) ||
          product.category?.name.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(filtered);
    // Reset to show first 9 items when search changes
    setDisplayedProducts(filtered.slice(0, ITEMS_PER_LOAD));
    setCurrentPage(1);
  }, [allProducts, searchQuery]);

  const loadMoreProducts = () => {
    setLoading(true);

    // Simulate loading delay (remove in production)
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = currentPage * ITEMS_PER_LOAD;
      const endIndex = startIndex + ITEMS_PER_LOAD;
      const newProducts = filteredProducts.slice(0, endIndex);

      setDisplayedProducts(newProducts);
      setCurrentPage(nextPage);
      setLoading(false);
    }, 300);
  };

  const hasMoreProducts = displayedProducts.length < filteredProducts.length;

  const addToCart = (product: ProductWithCategory) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.sell,
          quantity: 1,
          image: product.imageUrl || undefined,
        },
      ]);
    }
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id));
    } else {
      setCartItems(
        cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    setCustomerInfo({ name: "", phone: "" });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-7rem)] overflow-hidden">
      {/* Left Side - Products (Yellow Area - BIGGER) */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header - Compact */}
        <div className="flex-shrink-0 p-3 lg:p-4">
          <SalesHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            customerInfo={customerInfo}
            onCustomerInfoChange={setCustomerInfo}
          />
        </div>

        {/* Products Area - INCREASED HEIGHT, only this scrolls */}
        <div className="flex-1 min-h-0 px-3 lg:px-4">
          {displayedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg font-medium">
                {searchQuery ? "No Products Found" : "No Products Available"}
              </p>
              <p className="text-base mt-2">
                {searchQuery
                  ? "Try adjusting your search term"
                  : "Products will appear here when available"}
              </p>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <ProductGrid
                products={displayedProducts}
                onAddToCart={addToCart}
              />

              {/* Load More Button */}
              {hasMoreProducts && (
                <div className="flex justify-center py-4">
                  <Button
                    onClick={loadMoreProducts}
                    disabled={loading}
                    variant="outline"
                    className="bg-white hover:bg-gray-50 border-fg-primary text-fg-primary hover:text-fg-primary text-sm px-6 py-2"
                  >
                    {loading
                      ? "Loading..."
                      : `Load More (${
                          filteredProducts.length - displayedProducts.length
                        } remaining)`}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart (Red Area - will be made SMALLER) */}
      <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 h-full">
        <CartSection
          cartItems={cartItems}
          customerInfo={customerInfo}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeFromCart}
          onClearCart={clearCart}
        />
      </div>
    </div>
  );
}

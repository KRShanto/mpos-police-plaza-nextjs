import { ProductList } from "./product-list";
import { InventoryHeader } from "./header";
import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";

export default async function Inventory() {
  const user = await getUser();
  const products = await prisma.product.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    include: {
      category: true,
    },
  });
  const categories = await prisma.category.findMany({
    where: {
      organizationId: user?.organization.id,
    },
  });

  return (
    <div className="p-6">
      <InventoryHeader categories={categories} />
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500">
          <p className="text-xl font-medium">No Products in the Inventory</p>
          <p className="text-sm mt-2">
            Click the Add Product button to get started
          </p>
        </div>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}

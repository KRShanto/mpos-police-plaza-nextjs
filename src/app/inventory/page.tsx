import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { InventoryClientPage } from "./inventory-client";

export default async function Inventory() {
  const user = await getUser();
  const products = await prisma.product.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const categories = await prisma.category.findMany({
    where: {
      organizationId: user?.organization.id,
    },
  });

  return (
    <InventoryClientPage initialProducts={products} categories={categories} />
  );
}

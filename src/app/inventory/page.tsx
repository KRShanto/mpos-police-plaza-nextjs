import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { InventoryClientPage } from "./inventory-client";

const ITEMS_PER_PAGE = 8;

export default async function Inventory({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const user = await getUser();
  const currentPage = Number(searchParams?.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const [products, totalProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        organizationId: user?.organization.id,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    prisma.product.count({
      where: {
        organizationId: user?.organization.id,
      },
    }),
    prisma.category.findMany({
      where: {
        organizationId: user?.organization.id,
      },
    }),
  ]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <InventoryClientPage
      initialProducts={products}
      categories={categories}
      totalPages={totalPages}
    />
  );
}

import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { SalesClientPage } from "./sales-client";

const INITIAL_ITEMS = 50; // Load more initially for Load More functionality

export async function SalesServer() {
  const user = await getUser();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        organizationId: user?.organization.id,
        quantity: {
          gt: 0, // Only show products with stock
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: INITIAL_ITEMS,
    }),
    prisma.category.findMany({
      where: {
        organizationId: user?.organization.id,
      },
    }),
  ]);

  return (
    <SalesClientPage
      initialProducts={products}
      categories={categories}
      totalPages={1} // Not used anymore with Load More
    />
  );
}

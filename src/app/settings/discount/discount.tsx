import { DiscountDialogContent } from "./discount-dialog";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DiscountSettings() {
  const user = await getUser();

  const [discounts, products] = await Promise.all([
    prisma.discount.findMany({
      where: {
        organizationId: user?.organization.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: true,
      },
    }),
    prisma.product.findMany({
      where: {
        organizationId: user?.organization.id,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return <DiscountDialogContent discounts={discounts} products={products} />;
}

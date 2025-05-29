import { DiscountDialogContent } from "./discount-dialog";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Discount, Product } from "@/generated/prisma";

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
        discountProducts: {
          include: {
            product: true,
          },
        },
      },
    }) as Promise<
      (Discount & {
        discountProducts: {
          product: Product;
        }[];
      })[]
    >,
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

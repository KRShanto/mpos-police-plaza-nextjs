"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateDiscountInput {
  name: string;
  value: number;
  startDate: Date;
  endDate: Date;
  productIds: string[];
}

export async function createDiscount(data: CreateDiscountInput) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  try {
    await prisma.discount.create({
      data: {
        name: data.name,
        value: data.value,
        startDate: data.startDate,
        endDate: data.endDate,
        organizationId: user.organization.id,
        discountProducts: {
          create: data.productIds.map((productId) => ({
            productId,
          })),
        },
      },
    });

    revalidatePath("/settings");
    return { success: "Discount added successfully" };
  } catch (error) {
    console.error("Error creating discount:", error);
    return { error: "Failed to create discount" };
  }
}

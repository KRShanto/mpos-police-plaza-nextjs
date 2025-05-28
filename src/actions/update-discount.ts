"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface UpdateDiscountInput {
  id: string;
  name: string;
  value: number;
  startDate: Date;
  endDate: Date;
  productId: string;
}

export async function updateDiscount(data: UpdateDiscountInput) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  try {
    await prisma.discount.update({
      where: { id: data.id },
      data: {
        name: data.name,
        value: data.value,
        startDate: data.startDate,
        endDate: data.endDate,
        productId: data.productId,
      },
    });

    revalidatePath("/settings");
    return { success: "Discount updated successfully" };
  } catch (error) {
    console.error("Error updating discount:", error);
    return { error: "Failed to update discount" };
  }
}

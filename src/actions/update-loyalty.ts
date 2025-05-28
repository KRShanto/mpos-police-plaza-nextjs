"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface UpdateLoyaltyInput {
  id: string;
  name: string;
  amountRate: number;
  conversionRatePoints: number;
  conversionRateDiscount: number;
  pointsExpiry: number;
  default: boolean;
}

export async function updateLoyalty(data: UpdateLoyaltyInput) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  try {
    // If this is set as default, unset any existing default
    if (data.default) {
      await prisma.loyalty.updateMany({
        where: {
          organizationId: user.organization.id,
          default: true,
          id: { not: data.id }, // Don't update the current one
        },
        data: {
          default: false,
        },
      });
    }

    await prisma.loyalty.update({
      where: { id: data.id },
      data: {
        name: data.name,
        amountRate: data.amountRate,
        conversionRatePoints: data.conversionRatePoints,
        conversionRateDiscount: data.conversionRateDiscount,
        pointsExpiry: data.pointsExpiry,
        default: data.default,
      },
    });

    revalidatePath("/settings");
    return { success: "Loyalty program updated successfully" };
  } catch (error) {
    console.error("Error updating loyalty program:", error);
    return { error: "Failed to update loyalty program" };
  }
}

"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateLoyaltyInput {
  name: string;
  amountRate: number;
  conversionRatePoints: number;
  conversionRateDiscount: number;
  pointsExpiry: number;
  default: boolean;
}

export async function createLoyalty(data: CreateLoyaltyInput) {
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
        },
        data: {
          default: false,
        },
      });
    }

    await prisma.loyalty.create({
      data: {
        name: data.name,
        amountRate: data.amountRate,
        conversionRatePoints: data.conversionRatePoints,
        conversionRateDiscount: data.conversionRateDiscount,
        pointsExpiry: data.pointsExpiry,
        default: data.default,
        organization: {
          connect: {
            id: user.organization.id,
          },
        },
      },
    });

    revalidatePath("/settings");
    return { success: "Loyalty program added successfully" };
  } catch (error) {
    console.error("Error creating loyalty program:", error);
    return { error: "Failed to create loyalty program" };
  }
}

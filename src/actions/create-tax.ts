"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateTaxInput {
  name: string;
  value: number;
  default: boolean;
}

export async function createTax(data: CreateTaxInput) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  try {
    if (data.default) {
      // If this tax is being set as default, remove default from other taxes
      await prisma.tax.updateMany({
        where: {
          organizationId: user.organization.id,
          default: true,
        },
        data: {
          default: false,
        },
      });
    }

    await prisma.tax.create({
      data: {
        name: data.name,
        value: data.value,
        default: data.default,
        organizationId: user.organization.id,
      },
    });

    revalidatePath("/settings");
    return { success: "Tax added successfully" };
  } catch (error) {
    console.error("Error creating tax:", error);
    return { error: "Failed to create tax" };
  }
}

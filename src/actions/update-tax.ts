"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface UpdateTaxInput {
  id: string;
  name: string;
  value: number;
  default: boolean;
}

export async function updateTax(data: UpdateTaxInput) {
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

    await prisma.tax.update({
      where: { id: data.id },
      data: {
        name: data.name,
        value: data.value,
        default: data.default,
      },
    });

    revalidatePath("/settings");
    return { success: "Tax updated successfully" };
  } catch (error) {
    console.error("Error updating tax:", error);
    return { error: "Failed to update tax" };
  }
}

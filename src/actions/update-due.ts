"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface UpdateDueInput {
  id: string;
  name: string;
  minLoyalty: number;
  maxDue: number;
  default: boolean;
}

export async function updateDue(input: UpdateDueInput) {
  try {
    const user = await getUser();

    if (!user?.organization.id) {
      return { error: "Unauthorized" };
    }

    const existingDue = await prisma.due.findUnique({
      where: { id: input.id },
    });

    if (!existingDue) {
      return { error: "Due balance setting not found" };
    }

    if (existingDue.organizationId !== user.organization.id) {
      return { error: "Unauthorized" };
    }

    if (input.default) {
      // If this is set as default, unset any existing default
      await prisma.due.updateMany({
        where: {
          organizationId: user.organization.id,
          default: true,
        },
        data: {
          default: false,
        },
      });
    }

    await prisma.due.update({
      where: { id: input.id },
      data: {
        name: input.name,
        minLoyalty: input.minLoyalty,
        maxDue: input.maxDue,
        default: input.default,
      },
    });

    return { success: "Due balance setting updated successfully" };
  } catch (error) {
    console.error("Error updating due balance:", error);
    return { error: "Failed to update due balance setting" };
  }
}

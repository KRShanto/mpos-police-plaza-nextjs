"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateDueInput {
  name: string;
  minLoyalty: number;
  maxDue: number;
  default: boolean;
}

export async function createDue(input: CreateDueInput) {
  try {
    const user = await getUser();

    if (!user?.organization.id) {
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

    await prisma.due.create({
      data: {
        name: input.name,
        minLoyalty: input.minLoyalty,
        maxDue: input.maxDue,
        default: input.default,
        organizationId: user.organization.id,
      },
    });

    revalidatePath("/settings");

    return { success: "Due balance setting created successfully" };
  } catch (error) {
    console.error("Error creating due balance:", error);
    return { error: "Failed to create due balance setting" };
  }
}

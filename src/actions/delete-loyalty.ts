"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteLoyalty(id: string) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  try {
    await prisma.loyalty.delete({
      where: { id },
    });

    revalidatePath("/settings");
    return { success: "Loyalty program deleted successfully" };
  } catch (error) {
    console.error("Error deleting loyalty program:", error);
    return { error: "Failed to delete loyalty program" };
  }
}

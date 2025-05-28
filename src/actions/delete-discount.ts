"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteDiscount(id: string) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  try {
    await prisma.discount.delete({
      where: { id },
    });

    revalidatePath("/settings");
    return { success: "Discount deleted successfully" };
  } catch (error) {
    console.error("Error deleting discount:", error);
    return { error: "Failed to delete discount" };
  }
}

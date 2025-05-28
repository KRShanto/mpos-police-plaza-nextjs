"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteTax(id: string) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  try {
    await prisma.tax.delete({
      where: { id },
    });

    revalidatePath("/settings");
    return { success: "Tax deleted successfully" };
  } catch (error) {
    console.error("Error deleting tax:", error);
    return { error: "Failed to delete tax" };
  }
}

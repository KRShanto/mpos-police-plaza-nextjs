"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function deleteDue(id: string) {
  try {
    const user = await getUser();

    if (!user?.organization.id) {
      return { error: "Unauthorized" };
    }

    const existingDue = await prisma.due.findUnique({
      where: { id },
    });

    if (!existingDue) {
      return { error: "Due balance setting not found" };
    }

    if (existingDue.organizationId !== user.organization.id) {
      return { error: "Unauthorized" };
    }

    await prisma.due.delete({
      where: { id },
    });

    return { success: "Due balance setting deleted successfully" };
  } catch (error) {
    console.error("Error deleting due balance:", error);
    return { error: "Failed to delete due balance setting" };
  }
}

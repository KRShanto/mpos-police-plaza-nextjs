"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteEmployee(userId: string) {
  try {
    const user = await getUser();
    if (!user?.organization) {
      return { error: "Unauthorized" };
    }

    // Check if the employee belongs to the current organization
    const orgUser = await prisma.organizationUser.findFirst({
      where: {
        userId,
        organizationId: user.organization.id,
      },
    });

    if (!orgUser) {
      return { error: "Employee not found or unauthorized" };
    }

    // Delete the organization user relationship first
    await prisma.organizationUser.delete({
      where: { id: orgUser.id },
    });

    // Check if the user has other organization relationships
    const otherOrgRelations = await prisma.organizationUser.findMany({
      where: { userId },
    });

    // If no other relationships exist, delete the user
    if (otherOrgRelations.length === 0) {
      await prisma.user.delete({
        where: { id: userId },
      });
    }

    revalidatePath("/employee");

    return { success: "Employee deleted successfully" };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { error: "Failed to delete employee" };
  }
}

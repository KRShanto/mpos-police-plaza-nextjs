"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteEmployee(id: string) {
  try {
    const user = await getUser();
    if (!user?.organization) {
      return { error: "Unauthorized" };
    }

    const employee = await prisma.employee.findFirst({
      where: {
        id,
        organizationId: user.organization.id,
      },
    });

    if (!employee) {
      return { error: "Employee not found" };
    }

    await prisma.employee.delete({
      where: { id },
    });

    revalidatePath("/employee");

    return { success: "Employee deleted successfully" };
  } catch (error) {
    console.error("Error deleting employee:", error);
    return { error: "Failed to delete employee" };
  }
}

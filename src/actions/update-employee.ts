"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface UpdateEmployeeData {
  name: string;
  email: string;
  imageUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  age?: number;
  dateOfHire: Date;
  jobTitle: string;
  workSchedule: string;
  salary: number;
}

export async function updateEmployee(id: string, data: UpdateEmployeeData) {
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

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        ...data,
        organization: {
          connect: {
            id: user.organization.id,
          },
        },
      },
    });

    revalidatePath("/employee");

    return { success: "Employee updated successfully", data: updatedEmployee };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { error: "Failed to update employee" };
  }
}

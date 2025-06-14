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

export async function updateEmployee(userId: string, data: UpdateEmployeeData) {
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

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        imageUrl: data.imageUrl,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        age: data.age,
      },
    });

    // Update organization user relationship with employee details
    await prisma.organizationUser.update({
      where: { id: orgUser.id },
      data: {
        dateOfHire: data.dateOfHire,
        jobTitle: data.jobTitle,
        workSchedule: data.workSchedule,
        salary: data.salary,
      },
    });

    revalidatePath("/employee");

    return { success: "Employee updated successfully", data: updatedUser };
  } catch (error) {
    console.error("Error updating employee:", error);
    return { error: "Failed to update employee" };
  }
}

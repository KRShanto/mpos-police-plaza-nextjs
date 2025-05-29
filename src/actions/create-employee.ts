"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateEmployeeId } from "@/lib/utils";

interface CreateEmployeeData {
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

export async function createEmployee(data: CreateEmployeeData) {
  try {
    const user = await getUser();
    if (!user?.organization) {
      return { error: "Unauthorized" };
    }

    // Generate a unique employee ID
    let employeeId = generateEmployeeId();
    let isUnique = false;

    // Keep generating until we find a unique ID
    while (!isUnique) {
      const existingEmployee = await prisma.employee.findFirst({
        where: {
          employeeId,
          organizationId: user.organization.id,
        },
      });

      if (!existingEmployee) {
        isUnique = true;
      } else {
        employeeId = generateEmployeeId();
      }
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        employeeId,
        organization: {
          connect: {
            id: user.organization.id,
          },
        },
      },
    });

    revalidatePath("/employee");

    return { success: "Employee created successfully", data: employee };
  } catch (error) {
    console.error("Error creating employee:", error);
    return { error: "Failed to create employee" };
  }
}

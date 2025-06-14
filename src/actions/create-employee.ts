"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { generateEmployeeId } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma";

interface CreateEmployeeData {
  name: string;
  email: string;
  password: string;
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { error: "User with this email already exists" };
    }

    // Generate a unique employee ID
    let employeeId = generateEmployeeId();
    let isUnique = false;

    // Keep generating until we find a unique ID within this organization
    while (!isUnique) {
      const existingOrgUser = await prisma.organizationUser.findFirst({
        where: {
          employeeId,
          organizationId: user.organization.id,
        },
      });

      if (!existingOrgUser) {
        isUnique = true;
      } else {
        employeeId = generateEmployeeId();
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        imageUrl: data.imageUrl,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        address: data.address,
        phone: data.phone,
        age: data.age,
      },
    });

    // Create organization user relationship with employee details
    await prisma.organizationUser.create({
      data: {
        userId: newUser.id,
        organizationId: user.organization.id,
        userRole: UserRole.CASHIER, // Default role for employees
        employeeId,
        dateOfHire: data.dateOfHire,
        jobTitle: data.jobTitle,
        workSchedule: data.workSchedule,
        salary: data.salary,
      },
    });

    revalidatePath("/employee");

    return { success: "Employee created successfully", data: newUser };
  } catch (error) {
    console.error("Error creating employee:", error);
    return { error: "Failed to create employee" };
  }
}

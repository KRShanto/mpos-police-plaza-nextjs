import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { UserRole } from "@/generated/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password, role, organizationId } =
      await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Create organization user relationship
    await prisma.organizationUser.create({
      data: {
        userId: user.id,
        organizationId,
        userRole: role as UserRole,
        dateOfHire: new Date(),
        jobTitle: role === "ADMIN" ? "Administrator" : "Cashier",
        workSchedule: "9AM-5PM",
        salary: 0, // Set default salary
      },
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

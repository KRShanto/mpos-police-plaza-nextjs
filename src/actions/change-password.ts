"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(input: ChangePasswordInput) {
  try {
    const user = await getUser();

    if (!user?.id) {
      return { error: "Unauthorized" };
    }

    // Get user with password
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        password: true,
      },
    });

    if (!userWithPassword || !userWithPassword.password) {
      return { error: "User not found" };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      input.currentPassword,
      userWithPassword.password
    );

    if (!isPasswordValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(input.newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return { success: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password" };
  }
}

"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  const name = formData.get("name") as string;
  const dateOfBirth = formData.get("dateOfBirth") as string;
  const gender = formData.get("gender") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const age = formData.get("age") as string;
  const email = formData.get("email") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const updateData = {
    name,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    gender,
    address,
    phone,
    age: parseInt(age),
    email,
    imageUrl,
  };

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    revalidatePath("/settings");
    return { success: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

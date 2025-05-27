"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateBusiness(formData: FormData) {
  const user = await getUser();
  if (!user) {
    return { error: "User not found" };
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const phone = formData.get("phone") as string;
  const imageUrl = formData.get("imageUrl") as string;

  const updateData = {
    name,
    email,
    address,
    phone,
    imageUrl,
  };

  try {
    await prisma.organization.update({
      where: { id: user.organization.id },
      data: updateData,
    });

    revalidatePath("/settings");
    return { success: "Business information updated successfully" };
  } catch (error) {
    console.error("Error updating business information:", error);
    return { error: "Failed to update business information" };
  }
}

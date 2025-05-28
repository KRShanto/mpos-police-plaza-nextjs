"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateFeedbackInput {
  name: string;
  phone: string;
  rating: number;
  feedback: string;
}

export async function createFeedback(input: CreateFeedbackInput) {
  try {
    const user = await getUser();

    if (!user?.organization.id) {
      return { error: "Unauthorized" };
    }

    await prisma.customerFeedback.create({
      data: {
        name: input.name,
        phone: input.phone,
        rating: input.rating,
        feedback: input.feedback,
        organizationId: user.organization.id,
      },
    });

    revalidatePath("/cashier/customer");

    return { success: "Feedback submitted successfully" };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { error: "Failed to submit feedback" };
  }
}

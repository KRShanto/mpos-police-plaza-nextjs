"use server";

import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Customer } from "@/generated/prisma";
import { revalidatePath } from "next/cache";

interface CreateCustomerInput {
  name: string;
  phone: string;
}

interface CreateCustomerResponse {
  error?: string;
  success?: string;
  customer?: Customer;
}

export async function createCustomer(
  input: CreateCustomerInput
): Promise<CreateCustomerResponse> {
  try {
    const user = await getUser();

    if (!user?.organization.id) {
      return { error: "Unauthorized" };
    }

    // Check if phone number already exists
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        phone: input.phone,
        organizationId: user.organization.id,
      },
    });

    if (existingCustomer) {
      return { error: "A customer with this phone number already exists" };
    }

    const customer = await prisma.customer.create({
      data: {
        name: input.name,
        phone: input.phone,
        totalSpent: 0,
        due: 0,
        loyaltyPoints: 0,
        organizationId: user.organization.id,
      },
    });

    revalidatePath("/cashier/customer");

    return {
      success: "Customer created successfully",
      customer,
    };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { error: "Failed to create customer" };
  }
}

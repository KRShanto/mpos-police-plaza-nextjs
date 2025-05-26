"use server";

import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface CreateProductData {
  name: string;
  category: string;
  brand?: string;
  size?: string;
  cost: number;
  sell: number;
  barcode: string;
  quantity: number;
  imageUrl?: string | null;
}

export async function createProduct(data: CreateProductData) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if category exists, create if it doesn't
    let category = await prisma.category.findFirst({
      where: {
        name: data.category,
        organizationId: user.organization.id,
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: data.category,
          organizationId: user.organization.id,
        },
      });
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        categoryId: category.id,
        brand: data.brand,
        size: data.size,
        cost: data.cost,
        sell: data.sell,
        barcode: data.barcode,
        quantity: data.quantity,
        imageUrl: data.imageUrl,
        organizationId: user.organization.id,
      },
    });

    revalidatePath("/inventory");
    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

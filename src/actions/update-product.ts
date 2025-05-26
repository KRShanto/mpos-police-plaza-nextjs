"use server";

import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface UpdateProductData {
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

export async function updateProduct(
  productId: string,
  data: UpdateProductData
) {
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

    const updatedProduct = await prisma.product.update({
      where: {
        id: productId,
        organizationId: user.organization.id,
      },
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
      },
    });

    revalidatePath("/inventory");
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

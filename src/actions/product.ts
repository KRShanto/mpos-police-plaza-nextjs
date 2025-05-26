"use server";

import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface ProductData {
  name: string;
  category: string;
  brand: string | null;
  size: string | null;
  cost: number;
  sell: number;
  barcode: string;
  quantity: number;
  imageUrl: string | null;
}

export async function createProduct(data: ProductData) {
  try {
    const user = await getUser();
    if (!user?.organization.id) {
      throw new Error("Unauthorized");
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: {
        name: {
          equals: data.category,
          mode: "insensitive",
        },
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
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, data: ProductData) {
  try {
    const user = await getUser();
    if (!user?.organization.id) {
      throw new Error("Unauthorized");
    }

    // Find or create category
    let category = await prisma.category.findFirst({
      where: {
        name: {
          equals: data.category,
          mode: "insensitive",
        },
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

    const product = await prisma.product.update({
      where: {
        id,
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
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

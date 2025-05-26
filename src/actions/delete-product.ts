"use server";

import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";

export async function deleteProduct(productId: string) {
  try {
    const user = await getUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the product first to access the image URL
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        organizationId: user.organization.id,
      },
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Delete the product from database
    await prisma.product.delete({
      where: {
        id: productId,
        organizationId: user.organization.id,
      },
    });

    // Delete the image file if it exists
    if (product.imageUrl) {
      try {
        // Extract the file path from the URL
        // Assuming the imageUrl is like "/uploads/filename.jpg"
        const imagePath = path.join(process.cwd(), "public", product.imageUrl);
        await fs.unlink(imagePath);
        console.log("Image deleted successfully:", product.imageUrl);
      } catch (imageError) {
        console.warn("Failed to delete image file:", imageError);
        // Don't fail the entire operation if image deletion fails
      }
    }

    revalidatePath("/inventory");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

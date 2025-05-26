"use server";

import fs from "fs/promises";
import path from "path";

export async function deleteTemporaryImage(imagePath: string) {
  if (!imagePath || !imagePath.startsWith("/uploads/")) {
    // Basic validation to ensure we are only deleting expected files
    return { success: false, error: "Invalid image path" };
  }

  try {
    const fullPath = path.join(process.cwd(), "public", imagePath);
    await fs.unlink(fullPath);
    console.log("Temporary image deleted successfully:", imagePath);
    return { success: true };
  } catch (error) {
    console.warn("Failed to delete temporary image file:", imagePath, error);
    // It's okay if this fails silently in some cases,
    // as it's a cleanup rather than a critical operation.
    return { success: false, error: "Failed to delete temporary image" };
  }
}

import { cookies } from "next/headers";
import { verifyJWT } from "./jwt";
import { prisma } from "./db";

export async function getUser() {
  try {
    // Get token from cookies
    const token = cookies().get("token")?.value;

    if (!token) {
      return null;
    }

    // Verify token and get payload
    const payload = await verifyJWT(token);
    if (!payload) {
      return null;
    }

    // Get user from database with organizations
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        organizations: {
          select: {
            userRole: true,
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return null;
    }

    // Transform the data to a more convenient structure
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.organizations[0]?.userRole || "CASHIER",
      organization: user.organizations[0]?.organization || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Type for the returned user object
export type AuthUser = NonNullable<Awaited<ReturnType<typeof getUser>>>;

// Helper to use in Server Components to require authentication
export async function requireAuth() {
  const user = await getUser();

  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
}

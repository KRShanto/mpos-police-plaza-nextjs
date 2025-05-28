import { LoyaltyDialogContent } from "./loyalty-dialog";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function LoyaltySettings() {
  const user = await getUser();

  const loyalties = await prisma.loyalty.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <LoyaltyDialogContent loyalties={loyalties} />;
}

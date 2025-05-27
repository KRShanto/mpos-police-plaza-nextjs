import { BusinessDialogContent } from "./business-dialog";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function BusinessSettings() {
  const user = await getUser();

  const organization = await prisma.organization.findUnique({
    where: {
      id: user?.organization.id,
    },
  });

  if (!organization) {
    return <div>Organization not found</div>;
  }

  // TODO: Fetch business data here
  return <BusinessDialogContent organization={organization} />;
}

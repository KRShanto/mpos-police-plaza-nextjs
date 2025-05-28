import { TaxDialogContent } from "./tax-dialog";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function TaxSettings() {
  const user = await getUser();

  const taxes = await prisma.tax.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <TaxDialogContent taxes={taxes} />;
}

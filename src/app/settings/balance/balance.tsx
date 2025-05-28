import { BalanceDialogContent } from "./balance-dialog";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function BalanceSettings() {
  const user = await getUser();

  const dues = await prisma.due.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <BalanceDialogContent dues={dues} />;
}

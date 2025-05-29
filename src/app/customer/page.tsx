import { CustomerTable } from "./customer-table";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function CustomerPage() {
  const user = await getUser();

  const customers = await prisma.customer.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const feedbacks = await prisma.customerFeedback.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <CustomerTable customers={customers} feedbacks={feedbacks} />;
}

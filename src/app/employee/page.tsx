import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import EmployeeClientPage from "./employee-client";

export default async function Employee() {
  const user = await getUser();
  const employees = await prisma.organizationUser.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return <EmployeeClientPage employees={employees} />;
}

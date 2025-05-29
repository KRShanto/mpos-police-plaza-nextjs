import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import EmployeeClientPage from "./employee-client";

export default async function Employee() {
  const user = await getUser();
  const employees = await prisma.employee.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      employeeId: true,
      name: true,
      email: true,
      imageUrl: true,
      dateOfBirth: true,
      gender: true,
      address: true,
      phone: true,
      age: true,
      dateOfHire: true,
      jobTitle: true,
      workSchedule: true,
      salary: true,
    },
  });

  return <EmployeeClientPage employees={employees} />;
}

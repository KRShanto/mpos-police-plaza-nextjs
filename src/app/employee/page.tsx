import { prisma } from "@/lib/db";
import { getUser } from "@/lib/auth";
import EmployeeClientPage from "./employee-client";

export default async function Employee() {
  const user = await getUser();

  const organizationUsers = await prisma.organizationUser.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          imageUrl: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          phone: true,
          age: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform the data to match the expected EmployeeType
  const employees = organizationUsers.map((orgUser) => ({
    id: orgUser.user.id, // Use user ID
    employeeId: orgUser.employeeId || "", // Get from OrganizationUser
    name: orgUser.user.name,
    email: orgUser.user.email,
    imageUrl: orgUser.user.imageUrl,
    dateOfBirth: orgUser.user.dateOfBirth,
    gender: orgUser.user.gender,
    address: orgUser.user.address,
    phone: orgUser.user.phone,
    age: orgUser.user.age,
    dateOfHire: orgUser.dateOfHire,
    jobTitle: orgUser.jobTitle,
    workSchedule: orgUser.workSchedule,
    salary: orgUser.salary,
  }));

  return <EmployeeClientPage employees={employees} />;
}

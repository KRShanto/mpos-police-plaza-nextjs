import { prisma } from "@/lib/db";
import { ProfileDialogContent } from "./profile-dialog";
import { getUser } from "@/lib/auth";

export async function ProfileSettings() {
  const user = await getUser();
  const userData = await prisma.user.findUnique({
    where: { id: user?.id },
  });

  if (!userData) {
    return <div>User not found</div>;
  }

  return <ProfileDialogContent user={userData} />;
}

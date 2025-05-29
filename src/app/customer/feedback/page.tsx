import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { FeedbackTable } from "./feedback-table";

export default async function FeedbackPage() {
  const user = await getUser();

  const feedbacks = await prisma.customerFeedback.findMany({
    where: {
      organizationId: user?.organization.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <FeedbackTable feedbacks={feedbacks} />;
}

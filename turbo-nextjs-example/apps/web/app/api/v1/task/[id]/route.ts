import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { completed } = await req.json();
  const { id } = await params;
  await prisma.tasks.update({
    where: {
      task_id: id,
    },
    data: {
      completed,
    },
  });

  return Response.json({ message: "success" });
}

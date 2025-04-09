import { prisma } from "@/lib/db";
import { v4 as uuid } from "uuid";

export async function GET() {
  const tasks = await prisma.tasks.findMany();
  return Response.json({ message: "Hello, Next.js!", data: tasks });
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const taskId = uuid();
  const task = await prisma.tasks.create({
    data: {
      task_id: taskId,
      title: name,
      completed: false,
    },
  });

  return Response.json({ message: "success", data: task });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.tasks.delete({
    where: {
      task_id: id,
    },
  });
  return Response.json({ message: "success" });
}

export async function PUT(req: Request) {
  const { id, completed } = await req.json();

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

import { TaskModel } from "@/types/task";
import { v4 as uuid } from "uuid";

const tasks: TaskModel[] = [
  {
    id: uuid(),
    name: "Learn React",
    isDone: false,
  },
  {
    id: uuid(),
    name: "Learn TypeScript",
    isDone: false,
  },
  {
    id: uuid(),
    name: "Learn Next.js",
    isDone: true,
  },
  {
    id: uuid(),
    name: "Learn Tailwind CSS",
    isDone: false,
  },
  {
    id: uuid(),
    name: "Learn React Router",
    isDone: false,
  },
];
export async function GET() {
  return Response.json({ message: "Hello, Next.js!", data: tasks });
}

export async function POST(req: Request) {
  const { name } = await req.json();
  tasks.unshift({
    id: uuid(),
    name: name,
    isDone: false,
  });
  return Response.json({ message: "success" });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const index = tasks.findIndex((task) => task.id === id);
  tasks.splice(index, 1);
  return Response.json({ message: "success" });
}

export async function PUT(req: Request) {
  const { id, isDone } = await req.json();
  const index = tasks.findIndex((task) => task.id === id);
  tasks[index].isDone = isDone;
  return Response.json({ message: "success" });
}

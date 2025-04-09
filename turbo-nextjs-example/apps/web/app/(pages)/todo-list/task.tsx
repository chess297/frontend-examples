"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrashIcon } from "@heroicons/react/24/solid";
import { updateTask, deleteTask } from "@/lib/actions";
import { Prisma } from "@/generated/prisma";
export default function Task({
  task: item,
}: {
  task: Prisma.TasksGroupByOutputType;
}) {
  const handleDelete = (id: string) => {
    deleteTask(id);
  };
  const handleCheckedChange = (id: string, checked: boolean) => {
    updateTask(id, checked);
  };
  return (
    <li key={item.id} className={"flex justify-between items-center p-2 mb-2"}>
      <div className="flex flex-1 justify-center items-center overflow-hidden">
        <Checkbox
          checked={item.completed}
          onCheckedChange={(status: boolean) => {
            handleCheckedChange(item.task_id, status);
          }}
        />
        <span
          className={`mx-2 flex-1 overflow-hidden text-nowrap overflow-ellipsis  whitespace-nowrap  ${
            item.completed && "line-through text-gray-400"
          } `}
        >
          {item.title}
        </span>
      </div>
      <Button
        variant={"destructive"}
        type="button"
        onClick={() => handleDelete(item.task_id)}
        size={"sm"}
      >
        <TrashIcon />
      </Button>
    </li>
  );
}

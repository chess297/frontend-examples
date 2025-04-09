"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrashIcon } from "@heroicons/react/24/solid";
import { updateTask, deleteTask } from "@/lib/actions";
import { TaskModel } from "@/types/task";
export default function Task({ task: item }: { task: TaskModel }) {
  const handleDelete = (id: string) => {
    deleteTask(id);
  };
  const handleDone = (id: string) => {
    updateTask(id, true);
  };
  return (
    <li key={item.id} className={"flex justify-between items-center p-2 mb-2"}>
      <div className="flex flex-1 justify-center items-center overflow-hidden">
        <Checkbox
          checked={item.isDone}
          onCheckedChange={() => {
            if (item.isDone) return;
            handleDone(item.id);
          }}
        />
        <span
          className={`mx-2 flex-1 overflow-hidden text-nowrap overflow-ellipsis  whitespace-nowrap  ${
            item.isDone && "line-through text-gray-400"
          } `}
        >
          {item.name}
        </span>
      </div>
      <Button
        variant={"destructive"}
        type="button"
        onClick={() => handleDelete(item.id)}
        size={"sm"}
      >
        <TrashIcon />
      </Button>
    </li>
  );
}

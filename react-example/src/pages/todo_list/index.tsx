import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { v4 as uuid } from "uuid";
interface Task {
  id: string;
  name: string;
  isDone: boolean;
}

const defaultTasks: Task[] = [
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
const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [taskName, setTaskName] = useState("");
  const addTask = () => {
    const newTask: Task = {
      id: uuid(),
      name: taskName,
      isDone: false,
    };
    setTasks([newTask, ...tasks]);
    setTaskName("");
  };
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((item) => item.id !== id));
  };
  const handleDone = (id: string) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, isDone: !task.isDone };
        }
        return task;
      })
    );
  };
  return (
    <div className={"flex flex-col items-center justify-center min-h-screen"}>
      <h1 className=" text-3xl">TODO LIST</h1>
      <main>
        <div className="flex justify-between my-10">
          <Input
            type="text"
            className="flex-1 "
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="What needs to be done?"
          />
          <Button type="button" className="mx-4" onClick={addTask}>
            Add
          </Button>
        </div>
        <div>
          <ul className="flex flex-col max-h-80 overflow-scroll">
            {tasks.map((item) => {
              return (
                <li
                  key={item.id}
                  className={
                    "flex justify-between items-center border-b border-gray-200 p-2 mb-2"
                  }
                >
                  <div className="flex flex-1 w-xl justify-center items-center">
                    <Checkbox
                      checked={item.isDone}
                      onCheckedChange={() => {
                        if (item.isDone) return;
                        handleDone(item.id);
                      }}
                    />
                    <div
                      className={`mx-1 flex-1 overflow-hidden text-nowrap overflow-ellipsis  whitespace-nowrap  ${
                        item.isDone && "line-through text-gray-400"
                      } `}
                    >
                      {item.name}
                    </div>
                  </div>
                  <Button
                    variant={"destructive"}
                    type="button"
                    onClick={() => deleteTask(item.id)}
                  >
                    Delete
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
};
export default TodoList;

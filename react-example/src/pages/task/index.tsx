import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { api } from "@/services";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { useLoaderData } from "react-router";
interface TaskModel {
  id: string;
  title: string;
  completed: boolean;
}
const queryClient = new QueryClient();

const TaskInput = () => {
  const mutation = useMutation({
    mutationFn: api.api.taskControllerCreateV1,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setTaskName("");
    },
  });
  const [taskName, setTaskName] = useState("");
  const addTask = () => {
    mutation.mutate({
      title: taskName,
      description: "description",
      userId: "3c6523ba-006b-4937-9061-ac8ce0458a6d",
    });
  };
  console.log("TaskInput");

  return (
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
  );
};

const TaskList = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["tasks"],
    queryFn: api.api.taskControllerFindAllV1,
  });
  const deleteTask = (id: string) => {
    // setTasks(tasks.filter((item) => item.id !== id));
  };
  const handleDone = (id: string) => {
    // setTasks(
    //   tasks.map((task) => {
    //     if (task.id === id) {
    //       return { ...task, isDone: !task.isDone };
    //     }
    //     return task;
    //   })
    // );
  };
  return (
    <ul className="flex flex-col max-h-80 overflow-scroll">
      {query.data?.data.records.map((item) => {
        return (
          <li
            key={item.id}
            className={
              "flex justify-between items-center border-b border-gray-200 p-2 mb-2"
            }
          >
            <div className="flex flex-1 w-xl justify-center items-center">
              <Checkbox
                checked={item.completed}
                onCheckedChange={(e) => {
                  // if (item.completed) return;
                  // handleDone(item.id);
                }}
              />
              <div
                className={`mx-1 flex-1 overflow-hidden text-nowrap overflow-ellipsis  whitespace-nowrap  ${
                  item.completed && "line-through text-gray-400"
                } `}
              >
                {item.title}
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
  );
};

// const defaultTasks: TaskModel[] = [
//   {
//     id: uuid(),
//     name: "Learn React",
//     isDone: false,
//   },
//   {
//     id: uuid(),
//     name: "Learn TypeScript",
//     isDone: false,
//   },
//   {
//     id: uuid(),
//     name: "Learn Next.js",
//     isDone: true,
//   },
//   {
//     id: uuid(),
//     name: "Learn Tailwind CSS",
//     isDone: false,
//   },
//   {
//     id: uuid(),
//     name: "Learn React Router",
//     isDone: false,
//   },
// ];
const Task = () => {
  /// 进入页面拿到默认的数据,怎么更新数据？
  const tasks = useLoaderData<TaskModel[]>();
  return (
    <div className={"flex flex-col items-center justify-center min-h-screen"}>
      <main>
        <QueryClientProvider client={queryClient}>
          <TaskInput />
          <TaskList tasks={tasks} />
        </QueryClientProvider>
      </main>
    </div>
  );
};
export default Task;

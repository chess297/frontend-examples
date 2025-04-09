import { fetchTodoList } from "@/lib/actions";
import type { TaskModel } from "@/types/task";
import Task from "./task";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingTaskList() {
  return (
    <div className="flex flex-col gap-3 justify-center items-center h-screen flex-1 md:w-80">
      <div className=" flex w-full justify-center items-center">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-10 mx-2 flex-1" />
        <Skeleton className="h-8 w-8" />
      </div>
      <div className=" flex w-full justify-center items-center">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-10 mx-2 flex-1" />
        <Skeleton className="h-8 w-8" />
      </div>
      <div className=" flex w-full justify-center items-center">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-10 mx-2 flex-1" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  );
}
const TaskList = async () => {
  const tasks: TaskModel[] = await fetchTodoList();

  return (
    <ul className="flex flex-col max-h-80 overflow-scroll md:w-80">
      {tasks.map((item) => {
        return <Task key={item.id} task={item} />;
      })}
    </ul>
  );
};
export default TaskList;

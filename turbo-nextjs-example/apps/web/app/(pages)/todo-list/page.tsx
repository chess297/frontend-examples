import TaskList, { LoadingTaskList } from "./task-list";
import TaskInput from "./task-input";
import { Suspense } from "react";

export default async function TodoList() {
  return (
    <div className="flex flex-col">
      <TaskInput />
      <Suspense fallback={<LoadingTaskList />}>
        <TaskList />
      </Suspense>
    </div>
  );
}

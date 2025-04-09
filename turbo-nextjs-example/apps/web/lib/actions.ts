"use server";
import { revalidatePath } from "next/cache";
const BASE_URL = "http://localhost:3000/api/v1";
export async function fetchTodoList() {
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const list = await fetch(`${BASE_URL}/task`)
    .then((res) => res.json())
    .then((data) => {
      return data.data;
    })
    .catch(() => {
      return [];
    });
  return list;
}

export async function createTask(name: string) {
  await fetch(`${BASE_URL}/task`, {
    method: "POST",
    body: JSON.stringify({
      name,
    }),
  });
  revalidatePath("/todo-list");
}

export async function deleteTask(id: string) {
  await fetch(`${BASE_URL}/task`, {
    method: "DELETE",
    body: JSON.stringify({
      id,
    }),
  });
  revalidatePath("/todo-list");
}

export async function updateTask(id: string, completed: boolean) {
  await fetch(`${BASE_URL}/task/${id}`, {
    method: "PATCH",
    body: JSON.stringify({
      completed,
    }),
  })
    .then(() => {
      console.log("success");
    })
    .catch((err) => {
      console.log(err);
    });
  revalidatePath("/todo-list");
}

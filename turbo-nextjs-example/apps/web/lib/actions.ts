"use server";
import { revalidatePath } from "next/cache";
const BASE_URL = "http://localhost:3000/api/v1";
export async function fetchTodoList() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await fetch(`${BASE_URL}/todo-list`)
    .then((res) => res.json())
    .then((data) => {
      return data.data;
    })
    .catch(() => {
      return [];
    });
}

export async function createTask(name: string) {
  await fetch(`${BASE_URL}/todo-list`, {
    method: "POST",
    body: JSON.stringify({
      name,
      isDone: false,
    }),
  });
  revalidatePath("/todo-list");
}

export async function deleteTask(id: string) {
  await fetch(`${BASE_URL}/todo-list`, {
    method: "DELETE",
    body: JSON.stringify({
      id,
    }),
  });
  revalidatePath("/todo-list");
}

export async function updateTask(id: string, isDone: boolean) {
  await fetch(`${BASE_URL}/todo-list`, {
    method: "PUT",
    body: JSON.stringify({
      id,
      isDone,
    }),
  });
  revalidatePath("/todo-list");
}

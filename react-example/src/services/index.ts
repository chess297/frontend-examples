import { Api } from "./api/Api";

export const api = new Api();

export type Page = {
  id: number;
  title: string;
  path: string;
  component: string;
};

export async function getPages() {
  await new Promise((resolve) => {
    setTimeout(resolve, 2000);
  });
  return [
    // { id: 1, title: "Home", path: "/", component: "@/pages/home" },
    // { id: 2, title: "About", path: "/about", component: "About" },
    {
      id: 3,
      title: "Profile",
      path: "/profile",
      component: "./profile/index.tsx",
    },
  ] as Page[];
}

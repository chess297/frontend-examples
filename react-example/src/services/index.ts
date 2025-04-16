import { Api, HttpClient } from "./api/api";
const http = new HttpClient();
export const api = new Api(http);

export type Page = {
  id: number;
  title: string;
  path: string;
  component: string;
  shouldAuth?: boolean;
};

export async function getPages() {
  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });
  return [
    // { id: 1, title: "Home", path: "/", component: "@/pages/home" },
    // { id: 2, title: "About", path: "/about", component: "About" },
    // {
    //   id: 1,
    //   title: "Welcome",
    //   path: "/welcome",
    //   component: "./welcome/index.tsx",
    // },
    {
      id: 3,
      title: "Profile",
      path: "/profile",
      component: "./profile/index.tsx",
      shouldAuth: true,
    },
    {
      id: 4,
      title: "Setting",
      path: "/settings",
      component: "./settings/index.tsx",
      shouldAuth: true,
    },
    {
      id: 5,
      title: "Admin",
      path: "/admin",
      component: "./admin/index.tsx",
      shouldAuth: true,
    },
  ] as Page[];
}

import { ROUTES } from "@/router";
import { Api, HttpClient } from "./api/api";
import { toast } from "sonner";
const http = new HttpClient();
http.instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      toSignin();
    } else if (error.response.status === 400) {
      toast.error(error.response.data.message);
    }
    throw error;
  }
);

const toSignin = () => {
  window.location.href = ROUTES.SIGNIN;
};

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

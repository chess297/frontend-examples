import App from "@/App";
import AuthLayout from "@/pages/auth";
import Signin from "@/pages/auth/signin";
import Home from "@/pages/home";
import Task from "@/pages/task";
import { lazy } from "react";
import { createBrowserRouter } from "react-router";

const Signup = lazy(() => import("@/pages/auth/signup"));

export const routes = createBrowserRouter([
  {
    path: "/",
    Component: App,
    HydrateFallback: () => null,
    children: [
      {
        path: "",
        index: true,
        Component: Home,
      },
      {
        path: "auth",
        Component: AuthLayout,
        children: [
          {
            index: true,
            Component: Signup,
          },
          {
            path: "signup",
            Component: Signup,
          },
          {
            path: "signin",
            Component: Signin,
          },
        ],
      },
      {
        path: "task",
        // 需要提前准备当前页面数据的，可以使用loader
        // loader: async () => {
        //   const res = await api.api.taskControllerFindAllV1();
        //   return res.data.records;
        // },
        Component: Task,
      },
    ],
  },
]);

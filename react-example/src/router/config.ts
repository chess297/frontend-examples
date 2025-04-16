import RootLayout from "@/pages/root";
import AuthLayout from "@/pages/auth";
import Home from "@/pages/home";
import Welcome from "@/pages/welcome";
import { lazy } from "react";
import type { PermissionRoute } from "./type";

const Signin = lazy(() => import("@/pages/auth/signin"));
const Signup = lazy(() => import("@/pages/auth/signup"));
const NotFound = lazy(() => import("@/pages/not-found"));

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  TASK: "/task",
  PROFILE: "/profile",
  ALL: "*",
};

// 公开可访问的路由
export const publicRoutes: PermissionRoute[] = [
  {
    path: ROUTES.HOME,
    Component: RootLayout,
    HydrateFallback: () => null,
    children: [
      // 首页
      {
        path: "",
        Component: Home,
        children: [
          {
            index: true,
            Component: Welcome,
          },
        ],
      },
      // 登录注册页面

      {
        path: ROUTES.ALL,
        Component: NotFound,
      },
    ],
  },
  {
    path: ROUTES.AUTH,
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Signin,
      },
      {
        path: ROUTES.SIGNIN,
        Component: Signin,
      },
      {
        path: ROUTES.SIGNUP,
        Component: Signup,
      },
    ],
  },
];

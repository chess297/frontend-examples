import Layout from "@/layout";
import AuthLayout from "@/pages/auth";
import Home from "@/pages/home";
import Task from "@/pages/task";
import { lazy } from "react";
import type { PermissionRoute } from "./type";

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  TASK: "/task",
  ALL: "*",
};

// 公开可访问的路由
export const publicRoutes: PermissionRoute[] = [
  {
    path: ROUTES.HOME,
    Component: Layout,
    HydrateFallback: () => null,
    shouldAuth: true,
    children: [
      {
        index: true,
        shouldAuth: true,
        Component: Home,
      },
      // 登录注册页面
      {
        path: ROUTES.AUTH,
        Component: AuthLayout,
        children: [
          {
            index: true,
            Component: lazy(() => import("@/pages/auth/signup")),
          },
          {
            path: ROUTES.SIGNUP,
            Component: lazy(() => import("@/pages/auth/signup")),
          },
          {
            path: ROUTES.SIGNIN,
            Component: lazy(() => import("@/pages/auth/signin")),
          },
        ],
      },
      {
        path: ROUTES.ALL,
        Component: lazy(() => import("@/pages/not-found")),
      },
    ],
  },
];

// 未登录可访问，但是会跳转到登录页的路由
export const privateRoutes: PermissionRoute[] = [
  {
    path: ROUTES.TASK,
    Component: Task,
  },
];

// 即使登录了也需要对应权限才能访问的路由
export const permissionRoutes: PermissionRoute[] = [
  // {
  //   path: ROUTES.,
  //   Component: Task,
  // },
];

export const allRoutes: PermissionRoute[] = [...publicRoutes];

import RootLayout from "@/pages/root";
import AuthLayout from "@/pages/auth";
import Welcome from "@/pages/welcome";
import { lazy } from "react";
import type { PermissionRoute } from "./type";
import HomeLayout from "@/layouts/home-layout";

const Signin = lazy(() => import("@/pages/auth/signin"));
const Signup = lazy(() => import("@/pages/auth/signup"));
const SystemInit = lazy(() => import("@/pages/system-init"));
const NotFound = lazy(() => import("@/pages/not-found"));

export const ROUTES = {
  HOME: "/",
  AUTH: "/auth",
  SIGNUP: "/auth/signup",
  SIGNIN: "/auth/signin",
  SYSTEM_INIT: "/system-init",
  TASK: "/task",
  PROFILE: "/profile",
  ALL: "*",
};

export const WelcomeRoute = {
  path: "",
  name: "welcome",
  icon: "banana",
  Component: Welcome,
};

export const HomeRoute = {
  path: "",
  Component: HomeLayout,
  children: [WelcomeRoute] as PermissionRoute[],
};

// 公开可访问的路由
export const publicRoutes: PermissionRoute[] = [
  {
    path: ROUTES.HOME,
    Component: RootLayout,
    HydrateFallback: () => null,
    children: [
      // 首页
      HomeRoute,
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
  {
    path: ROUTES.SYSTEM_INIT,
    Component: SystemInit,
  },
];

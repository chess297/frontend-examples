import { Suspense, useEffect, useState } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { allRoutes, publicRoutes } from "./config";
import { getPages } from "@/services";
import { components } from "./loader";
import RequireAuth from "../layouts/require-auth-layout";
const defaultRoutes = publicRoutes;
export function usePermissionRoutes() {
  const [router, setRouter] = useState(createBrowserRouter(defaultRoutes));
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const updateRole = (role: string) => {
    setRole(role);
  };
  useEffect(() => {
    if (role === "admin") {
      setRouter(createBrowserRouter([...allRoutes, ...publicRoutes]));
    } else {
      const routes = [...publicRoutes];
      setRouter(createBrowserRouter(routes));
    }
  }, [role]);

  function loadRoutes() {
    setIsLoading(true);
    // TODO: 从后端获取路由信息
    getPages().then((pages) => {
      setIsLoading(false);
      const routes: RouteObject[] = pages.map((item) => {
        const Component = components[item.component];

        return {
          path: item.path,
          element: item.auth ? (
            <RequireAuth>
              <Suspense>
                <Component />
              </Suspense>
            </RequireAuth>
          ) : (
            <Suspense>
              <Component />
            </Suspense>
          ),
        };
      });
      setRouter(createBrowserRouter([...publicRoutes, ...routes]));
    });
  }

  return {
    isLoading,
    router,
    updateRole,
    loadRoutes,
  };
}

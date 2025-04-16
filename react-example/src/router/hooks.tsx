import { Suspense, useEffect, useState } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import { publicRoutes, ROUTES } from "./config";
import { components } from "./loader";
import RequireAuth from "../layouts/require-auth-layout";
import { useAuthStore } from "@/hooks";
export function usePermissionRoutes() {
  const [router, setRouter] = useState(createBrowserRouter(publicRoutes));
  const { menus } = useAuthStore();

  useEffect(() => {
    const menuRoutes: RouteObject[] = [
      ...menus.map((item) => {
        const Component = components[item.component];
        return {
          path: item.path,
          // biome-ignore lint/correctness/noConstantCondition: <explanation>
          element: true ? (
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
      }),
    ];
    const newRoutes = publicRoutes.map((item) => {
      if (item.path === ROUTES.HOME) {
        const firesChild = item.children?.[0];
        if (firesChild) {
          for (const route of menuRoutes) {
            firesChild.children?.push(route);
          }
        }
      }
      return item;
    });
    setRouter(createBrowserRouter(newRoutes));
  }, [menus]);

  return {
    router,
  };
}

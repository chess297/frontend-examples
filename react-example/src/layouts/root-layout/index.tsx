import {
  createBrowserRouter,
  type RouteObject,
  RouterProvider,
} from "react-router";
import { useToggle } from "ahooks";
import { components, publicRoutes, ROUTES } from "@/router";
import { Suspense, useEffect, useState } from "react";
import RequireAuth from "../require-auth-layout";
import { useAuthStore } from "@/hooks";
import Loading from "@/components/loading";
import { api } from "@/services";

export function LazyComponent({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

async function getInitState() {
  console.log("getInitState");

  const res = await api.findManyMenu();

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    menus: res.data.data.records,
  };
}

export function Root() {
  const [router, setRouter] = useState(createBrowserRouter(publicRoutes));

  const [isLoading, { setRight }] = useToggle(true);
  const { menus, setMenus, getUserInfo, getUserPermission } = useAuthStore();

  useEffect(() => {
    getInitState().then(async (res) => {
      setMenus(res.menus);
      await getUserInfo();
      // await getUserPermission();
      setRight();
    });
  }, [setMenus, setRight, getUserInfo]);

  useEffect(() => {
    const menuRoutes: RouteObject[] = [
      ...menus.map((item) => {
        const Component = components[item.component];
        return {
          path: item.path,
          // biome-ignore lint/correctness/noConstantCondition: <explanation>
          element: true ? (
            <RequireAuth>
              <LazyComponent>
                <Component />
              </LazyComponent>
            </RequireAuth>
          ) : (
            <LazyComponent>
              <Component />
            </LazyComponent>
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
  return isLoading ? <Loading /> : <RouterProvider router={router} />;
}

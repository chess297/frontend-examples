import {
  createBrowserRouter,
  type RouteObject,
  RouterProvider,
} from "react-router";
import { useToggle } from "ahooks";
import { components, publicRoutes, ROUTES } from "@/router";
import { Suspense, useEffect, useState, useRef } from "react";
import RequireAuth from "../require-auth-layout";
import { useAuthStore } from "@/hooks";
import Loading from "@/components/loading";
import { api } from "@/services";
import { useSidebarStore } from "@/hooks/use-sidebar-store";
import type { MenuResponse } from "@/services/api/api";

export function LazyComponent({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

async function getInitState(is_login: boolean) {
  const menus: MenuResponse[] = is_login
    ? await api.findManyMenu().then((res) => {
        return res.data.data.records ?? [];
      })
    : [];

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return {
    menus,
  };
}

export function Root() {
  const [router, setRouter] = useState(createBrowserRouter(publicRoutes));
  const initCalledRef = useRef(false);
  const [isLoading, { setRight }] = useToggle(true);
  const { is_login, menus, setMenus, getUserInfo, getUserPermission } =
    useAuthStore();
  const { fetchAdminMenuGround } = useSidebarStore();

  useEffect(() => {
    if (initCalledRef.current) return;

    initCalledRef.current = true;
    getInitState(is_login)
      .then(async (res) => {
        setMenus(res.menus);

        if (is_login) {
          getUserInfo();
          fetchAdminMenuGround();
          getUserPermission();
        }
      })
      .finally(() => {
        setRight();
      });
  }, [
    is_login,
    setMenus,
    setRight,
    getUserInfo,
    fetchAdminMenuGround,
    getUserPermission,
  ]);

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
    console.log("🚀 ~ newRoutes ~ newRoutes:", newRoutes);

    setRouter(createBrowserRouter(newRoutes));
  }, [menus]);
  return isLoading ? <Loading /> : <RouterProvider router={router} />;
}

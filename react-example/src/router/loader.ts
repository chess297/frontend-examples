import { type FunctionComponent, lazy } from "react";
import { HomeRoute, WelcomeRoute } from "./config";
import type { MenuEntity } from "@/services/api/api";
import type { PermissionRoute } from "./type";

const componentContext = import.meta.webpackContext("@/pages", {
  recursive: true,
  regExp: /index\.(js|jsx|ts|tsx)$/,
  mode: "lazy",
});

export function importAllRoutes(r: Rspack.Context) {
  const components: Record<
    string,
    React.LazyExoticComponent<FunctionComponent>
  > = {};
  for (const key of r.keys()) {
    // console.log("🚀 ~ importAllRoutes ~ key:", key);
    const module = r(key) as Promise<{ default: FunctionComponent }>;
    const component = lazy(() => module);
    components[key] = component;
  }

  return components;
}

export function mergeHomeRoutes(menus: MenuEntity[]) {
  HomeRoute.children = [
    WelcomeRoute,
    ...menus
      .filter((item) => !!item.path)
      .map((item) => {
        return {
          path: item.path,
          name: item.name,
          Component: components[item.component],
        } as PermissionRoute;
      }),
  ];
}

export const components = importAllRoutes(componentContext);

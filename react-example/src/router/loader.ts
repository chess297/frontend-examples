import { type FunctionComponent, lazy } from "react";

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
export const components = importAllRoutes(componentContext);

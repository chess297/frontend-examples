import { type FunctionComponent, lazy } from "react";

const componentContext = require.context(
  "@/pages",
  true,
  /index\.(js|jsx|ts|tsx)$/,
  "lazy"
);

export function importAllRoutes(r: Rspack.Context) {
  const components: Record<
    string,
    React.LazyExoticComponent<FunctionComponent>
  > = {};
  for (const key of r.keys()) {
    const module = r(key);
    const component = lazy(
      () => module as Promise<{ default: FunctionComponent }>
    );
    components[key] = component;
  }

  return components;
}
export const components = importAllRoutes(componentContext);

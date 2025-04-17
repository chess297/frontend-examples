import type { RouteObject } from "react-router";

export type PermissionRoute = RouteObject & {
  role?: string;
  shouldAuth?: boolean;
  name?: string;
  icon?: string;
  children?: PermissionRoute[];
  permissions?: string[];
};

import type { RouteObject } from "react-router";

export type PermissionRoute = RouteObject & {
  role?: string;
  shouldAuth?: boolean;
  children?: PermissionRoute[];
  permissions?: string[];
};

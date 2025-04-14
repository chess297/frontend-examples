import { create } from "zustand";
import { devtools } from "zustand/middleware";

// 用户权限
interface UserPermission {
  action: string;
}
// 用户可访问的路由配置
interface RemoteRouteObject {
  path: string;
  component: string;
}
type GlobalStoreState = {
  // access_token: string;
  // 该用户可以访问的路由列表
  routes: RemoteRouteObject[];
  // 该用户的权限列表
  permissions: UserPermission[];
};

type GlobalStoreActions = {
  login_success(access_token: string): void;
};

export const useGlobalStore = create<GlobalStoreState & GlobalStoreActions>()(
  devtools((set) => ({
    visibleRoutes: [],
    permissions: [],
    login_success() {},
  }))
);

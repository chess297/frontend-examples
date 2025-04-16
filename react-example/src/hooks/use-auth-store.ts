import { api } from "@/services";
import type { SigninRequest, SignupRequest } from "@/services/api/api";
import { getUserIdCookie } from "@/utils";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
// import Cookies from "@/utils/cookies";
// 用户权限
interface UserPermission {
  action: string;
}
// 用户可访问的路由配置
interface RemoteRouteObject {
  path: string;
  component: string;
}
type AuthStoreState = {
  is_login: boolean;
  // access_token: string;
  // 该用户可以访问的路由列表
  menus: RemoteRouteObject[];
  // 该用户的权限列表
  permissions: UserPermission[];
};

type AuthStoreActions = {
  register(params: SignupRequest): Promise<void>;
  login(params: SigninRequest): Promise<void>;
  logout(): void;
  initMenus(): Promise<void>;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>()(
  devtools((set) => ({
    is_login: getUserIdCookie(),
    menus: [],
    permissions: [],
    register(params) {
      return api.signup(params);
    },
    async login(params) {
      return await api.signin(params).then((res) => {
        set({ is_login: true });
        return res;
      });
    },
    logout() {
      return api.signout();
    },
    async initMenus() {
      // const res = await api.api.authControllerGetRoutesV1();
      // this.routes = res.data;
    },
  }))
);

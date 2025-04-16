import type { PermissionRoute } from "@/router";
import { api } from "@/services";
import type {
  FindManyMenuResponse,
  SigninRequest,
  SignupRequest,
} from "@/services/api/api";
import { getUserIdCookie } from "@/utils";
import { create } from "zustand";
// import Cookies from "@/utils/cookies";
// 用户权限
interface UserPermission {
  action: string;
}

type AuthStoreState = {
  is_login: boolean;
  // 该用户可以访问的路由列表
  menus: FindManyMenuResponse["records"];
  routes: PermissionRoute[];
  // 该用户的权限列表
  permissions: UserPermission[];
};

type AuthStoreActions = {
  register(params: SignupRequest): Promise<void>;
  login(params: SigninRequest): Promise<void>;
  logout(): void;
  initMenus(): Promise<void>;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>(
  (set, get) => ({
    is_login: !!getUserIdCookie(),
    menus: [],
    routes: [],
    permissions: [],
    async register(params) {
      await api.signup(params);
      return;
    },
    login: async (params) => {
      await api.signin(params);
      // 登录成功后设置用户信息、权限、获取菜单等
      set({ is_login: true });
      // await initMenus();
      await get().initMenus();
      return;
    },
    logout() {
      return api.signout();
    },
    initMenus: async () => {
      // const res = await api.api.authControllerGetRoutesV1();
      // this.routes = res.data;
      await api.findManyMenu().then((res) => {
        set({
          menus: res.data.records,
          routes: res.data.records.map((item) => ({
            name: item.name,
            path: item.path,
            component: item.component,
          })),
        });
      });
    },
  })
);

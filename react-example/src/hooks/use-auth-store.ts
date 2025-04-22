import { api } from "@/services";
import type {
  MenuResponse,
  SigninRequest,
  SignupRequest,
  SigninResponse,
  UserResponse,
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
  menus: MenuResponse[];
  // 该用户的权限列表
  permissions: UserPermission[];
  user_info: UserResponse | null;
};

type AuthStoreActions = {
  register(params: SignupRequest): Promise<void>;
  login(params: SigninRequest): Promise<void>;
  logout(): void;
  getUserInfo(): Promise<void>;
  getUserPermission(): Promise<void>;
  setMenus(menus: MenuResponse[]): Promise<void>;
  updateLoginStatus(): void;
};

export const useAuthStore = create<AuthStoreState & AuthStoreActions>(
  (set, get) => {
    return {
      is_login: !!getUserIdCookie(),
      menus: [],
      user_info: null,
      permissions: [],
      updateLoginStatus() {
        set({
          is_login: !!getUserIdCookie(),
        });
      },
      async register(params) {
        await api.signup(params);
        return;
      },
      login: async (params) => {
        const res = await api.signin(params);
        if (res.status === 200) {
          await get().getUserInfo();
        }
        return;
      },
      logout() {
        set({
          is_login: false,
          menus: [],
          user_info: null,
        });
        return api.signout();
      },
      async getUserInfo() {
        if (get().is_login === false) {
          return;
        }
        await api
          .getUserInfo()
          .then((res) => {
            set({
              user_info: res.data.data,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        await get()
          .getUserPermission()
          .catch((err) => {
            console.log("🚀 ~ getUserInfo ~ err:", err);
          });
      },
      async getUserPermission() {
        await api.getUserPermission().then((res) => {
          console.log("🚀 ~ awaitapi.getPermission ~ res:", res);
          // set({
          //   permissions: res.data.data,
          // });
        });
      },
      setMenus: async (menus) => {
        set({
          menus: menus,
        });
      },
    };
  }
);

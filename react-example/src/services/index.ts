import { ROUTES } from "@/router";
import { Api, HttpClient } from "./api/api";
import { toast } from "sonner";
export const http = new HttpClient();
export * from "./upload";

http.instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    switch (error.response.status) {
      case 400:
      case 403:
        toast.error("没有权限访问该资源");
        break;
      case 503:
        toast.error("系统还没初始化，请先注册管理员账号");
        // 重定向到初始化页面
        window.location.href = ROUTES.SYSTEM_INIT;
        break;
      case 401:
        toSignin();
        break;
      default:
        // toSignin();
        break;
    }

    throw error;
  }
);

const toSignin = () => {
  window.location.href = ROUTES.SIGNIN;
};

export const api = new Api(http);

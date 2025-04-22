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
    if (error.response.status === 401) {
      toSignin();
    } else if (error.response.status === 400) {
      toast.error(error.response.data.message);
    } else if (error.response.status === 503) {
      toast.error("系统还没初始化，请先注册管理员账号");
      // 重定向到初始化页面
      window.location.href = ROUTES.SYSTEM_INIT;
    }
    throw error;
  }
);

const toSignin = () => {
  window.location.href = ROUTES.SIGNIN;
};

export const api = new Api(http);

import cookies from "js-cookie";
const IS_LOGIN_KEY = "is_login";
export const getIsLoginCookie = () => {
  return cookies.get(IS_LOGIN_KEY);
};

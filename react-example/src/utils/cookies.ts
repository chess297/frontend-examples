import cookies from "js-cookie";
const USER_ID_KEY = "user_id";
export const getUserIdCookie = () => {
  return cookies.get(USER_ID_KEY);
};

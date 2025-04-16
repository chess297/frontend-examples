import type { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";
import { ROUTES } from "../../router";
import { getUserIdCookie } from "@/utils";

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  // const { is_login } = useAuthStore();
  const is_login = getUserIdCookie();
  const location = useLocation();
  if (!is_login) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;

import { useAuthStore } from "@/hooks/use-auth-store";
import type { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router";
import { ROUTES } from "../../router";

const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const { is_login } = useAuthStore();
  const location = useLocation();
  if (!is_login) {
    return <Navigate to={ROUTES.SIGNIN} state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;

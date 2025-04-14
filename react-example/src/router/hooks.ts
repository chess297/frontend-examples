import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router";
import { allRoutes, publicRoutes } from "./routes";
import { getPages } from "@/services";
import { components } from "./loader";
const defaultRoutes = publicRoutes;
export function usePermissionRoutes() {
  const [router, setRouter] = useState(createBrowserRouter(defaultRoutes));
  const [role, setRole] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const updateRole = (role: string) => {
    setRole(role);
  };
  useEffect(() => {
    if (role === "admin") {
      setRouter(createBrowserRouter([...allRoutes, ...publicRoutes]));
    } else {
      const routes = [...publicRoutes];
      setRouter(createBrowserRouter(routes));
    }
  }, [role]);

  function loadRoutes() {
    setIsLoading(true);
    // TODO: 从后端获取路由信息
    getPages().then((pages) => {
      setIsLoading(false);
      setRouter(
        createBrowserRouter([
          ...publicRoutes,
          ...pages.map((item) => {
            return {
              path: item.path,
              Component: components[item.component],
            };
          }),
        ])
      );
    });
  }

  return {
    isLoading,
    router,
    updateRole,
    loadRoutes,
  };
}

export function useMatchRoute() {
  const location = useLocation();
  console.log("🚀 ~ useMatchRoute ~ location:", location.pathname);
  return { path: location.pathname };
}

export function useRouter() {
  const navigate = useNavigate();
  function to(path: string) {
    navigate(path);
  }

  return {
    to,
  };
}

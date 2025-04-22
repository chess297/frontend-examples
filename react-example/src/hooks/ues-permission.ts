import { mergeHomeRoutes, publicRoutes } from "@/router";
import { useEffect, useState } from "react";
import { createBrowserRouter } from "react-router";
import { useAuthStore } from "./use-auth-store";

export function usePermission() {
  const { menus } = useAuthStore();
  const [router, setRouter] = useState(createBrowserRouter(publicRoutes));

  useEffect(() => {
    mergeHomeRoutes(menus);
    console.log("🚀 ~ useEffect ~ publicRoutes:", publicRoutes);

    setRouter(createBrowserRouter(publicRoutes));
  }, [menus]);

  return { menus, router };
}

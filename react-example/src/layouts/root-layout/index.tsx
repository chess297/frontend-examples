import { RouterProvider } from "react-router";
import { usePermissionRoutes } from "../../router/hooks";
import { RingLoader } from "react-spinners";
import { useEffect } from "react";

export function Root() {
  const { router, isLoading, loadRoutes } = usePermissionRoutes();
  useEffect(loadRoutes, []);
  return isLoading ? (
    <div className="  flex items-center justify-center h-screen">
      <RingLoader />
    </div>
  ) : (
    <RouterProvider router={router} />
  );
}

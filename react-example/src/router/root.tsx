import { RouterProvider } from "react-router";
import { usePermissionRoutes } from "./hooks";
import { RingLoader } from "react-spinners";

export function Root() {
  const { router, isLoading } = usePermissionRoutes();

  return isLoading ? (
    <div className="  flex items-center justify-center h-screen">
      <RingLoader />
    </div>
  ) : (
    <RouterProvider router={router} />
  );
}

import { RouterProvider } from "react-router";
import { RingLoader } from "react-spinners";
import { useMount, useToggle } from "ahooks";
import { useAuthStore } from "@/hooks";
import { usePermissionRoutes } from "@/router";

export function Root() {
  const [isLoading, { setRight }] = useToggle(true);
  const { is_login, initMenus } = useAuthStore();
  const { router } = usePermissionRoutes();
  useMount(() => {
    if (is_login) {
      initMenus().then(() => {
        setRight();
      });
    } else {
      setRight();
    }
  });

  return isLoading ? (
    <div className="  flex items-center justify-center h-screen">
      <RingLoader />
    </div>
  ) : (
    <RouterProvider router={router} />
  );
}

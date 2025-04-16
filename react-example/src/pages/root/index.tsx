import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { RingLoader } from "react-spinners";

const Root = () => {
  return (
    <div className="content">
      <Suspense fallback={<RingLoader />}>
        <Outlet />
      </Suspense>
      <Toaster position={"top-center"} />
    </div>
  );
};

export default Root;

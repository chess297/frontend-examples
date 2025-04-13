import { Outlet } from "react-router";
import { Toaster } from "@/components/ui/sonner";
const App = () => {
  return (
    <div className="content">
      <Outlet />
      <Toaster position={"top-center"} />
    </div>
  );
};

export default App;

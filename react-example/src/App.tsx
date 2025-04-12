import { Meta, Outlet } from "react-router";

const App = () => {
  return (
    <div className="content">
      <Outlet />
    </div>
  );
};

export default App;

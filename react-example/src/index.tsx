import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/globals.css";
import { Root } from "./layouts/root-layout";
// import { usePermissionRoutes } from "./router";

async function bootstrap() {
  console.log("🚀 ~ bootstrap ~ bootstrap:");
  // const { loadRoutes } = usePermissionRoutes();
  // loadRoutes();
  const rootEl = document.getElementById("root");
  if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <Root />
      </React.StrictMode>
    );
  }
}

bootstrap();

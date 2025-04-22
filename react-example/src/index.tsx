import ReactDOM from "react-dom/client";
// import "./index.css";
import "./styles/globals.css";
import { Root } from "./layouts/root-layout";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
const queryClient = new QueryClient();
async function bootstrap() {
  console.log("🚀 ~ bootstrap ~ bootstrap:");

  const rootEl = document.getElementById("root");
  if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(
      <React.StrictMode>
        <>
          <QueryClientProvider client={queryClient}>
            <Root />
          </QueryClientProvider>

          <Toaster position="top-center" />
        </>
      </React.StrictMode>
    );
  }
}

bootstrap();

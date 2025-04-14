import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import fs from "node:fs";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
export default defineConfig({
  html: {
    title: "React Example",
  },
  plugins: [pluginReact(), pluginSvgr()],
  resolve: {
    alias: {
      "@": "./src",
    },
  },
  performance: {
    chunkSplit: {
      override: {},
    },
  },
  tools: {
    rspack: {
      module: {},
    },
  },
  server: {
    host: "spiritchess.cn",
    port: 3001,
    open: true,
    https: {
      key: fs.readFileSync("certificates/spiritchess.cn.key"),
      cert: fs.readFileSync("certificates/spiritchess.cn.pem"),
    },
    proxy: {
      "/api": {
        target: "http://spiritchess.cn:3000",
        changeOrigin: true,
        cookieDomainRewrite: {
          "*": "localhost",
        },
      },
    },
  },
});

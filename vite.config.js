import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Sitemap from "vite-plugin-sitemap";
import routes from "./src/generated-routes.mjs";

export default defineConfig({
  plugins: [
    react(),
    Sitemap({
      hostname: "https://stories.jenkins.io",
      dynamicRoutes: routes,
      generateRobotsTxt: true,
      readable: true,

      priority: {
        "/": 1.0,
        "/user-story": 0.9,
        "*": 0.8,
      },

      changefreq: {
        "/": "daily",
        "/user-story": "weekly",
        "*": "weekly",
      },
    }),
  ],
});

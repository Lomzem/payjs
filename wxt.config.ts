import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  modules: ["@wxt-dev/module-svelte"],
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        $components: resolvePath("./src/components"),
        $lib: resolvePath("./src/lib"),
      },
    },
  }),
  manifest: {
    name: "Paychex Timecard Filler",
    description: "Fill Paychex timecards from a date range and project code.",
    permissions: ["activeTab", "storage"],
    host_permissions: ["https://myapps.paychex.com/*"],
  },
});

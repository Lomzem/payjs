import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  modules: ["@wxt-dev/module-svelte"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  manifest: {
    name: "Paychex Timecard Filler",
    description: "Fill Paychex timecards from a date range and project code.",
    permissions: ["activeTab", "storage"],
    host_permissions: ["https://myapps.paychex.com/*"],
  },
});

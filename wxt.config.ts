import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  outDir: "output",
  manifest: {
    name: "Charger - Productivity Shortcuts",
    description: "Multi-website browser extension with custom keyboard shortcuts and productivity enhancements for Gmail, Platzi, Notion, and more.",
    version: "1.0.0",
    author: "acbc",
    homepage_url: "https://github.com/acbcdev/changer",
    permissions: ["clipboardWrite"],
    icons: {
      16: "/icon/16.png",
      32: "/icon/32.png",
      48: "/icon/48.png",
      96: "/icon/96.png",
      128: "/icon/128.png",
    },
  },
});

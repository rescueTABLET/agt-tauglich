import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// for s in 48 72 96 144 192 512 1024; do inkscape -w $s -h $s public/favicon.svg -o public/logo-$s.png; done
const iconSizes = [48, 72, 96, 144, 192, 512, 1024];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,jpeg,svg,webp,woff2}"],
        globIgnores: ["**/node_modules/**/*", "sw.js"],
        maximumFileSizeToCacheInBytes: 1024 * 1024 * 10,
      },
      manifest: {
        id: "/",
        name: "Bin ich tauglich?",
        short_name: "AGT",
        lang: "de",
        start_url: ".",
        display: "standalone",
        theme_color: "#673ab7",
        background_color: "#f5f5f5",
        icons: [
          ...iconSizes.flatMap((size) => [
            {
              src: `logo-${size}.png`,
              type: "image/png",
              sizes: `${size}x${size}`,
              purpose: "any",
            },
          ]),
          {
            src: "favicon.svg",
            type: "image/svg+xml",
            sizes: "150x150",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});

import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"
import extractHandler from "./api/extract.js"

function localApiPlugin(mode) {
  const env = loadEnv(mode, process.cwd(), "")
  Object.assign(process.env, env)

  return {
    name: "local-api-extract",
    configureServer(server) {
      server.middlewares.use("/api/extract", async (req, res, next) => {
        if (req.method !== "POST") {
          extractHandler(req, res)
          return
        }

        try {
          const chunks = []
          for await (const chunk of req) {
            chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk)
          }
          const raw = Buffer.concat(chunks).toString("utf8")
          req.body = raw ? JSON.parse(raw) : {}
        } catch {
          req.body = undefined
        }

        extractHandler(req, res)
      })
    }
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    localApiPlugin(mode),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.svg", "pwa-192x192.svg", "pwa-512x512.svg"],
      manifest: {
        name: "AU CGPA Calculator",
        short_name: "AU CGPA",
        description: "Minimal GPA and CGPA calculator for Anna University students.",
        theme_color: "#09111f",
        background_color: "#09111f",
        display: "standalone",
        display_override: ["window-controls-overlay", "standalone", "browser"],
        start_url: "/",
        scope: "/",
        icons: [
          { src: "pwa-192x192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any maskable" },
          { src: "pwa-512x512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any maskable" }
        ],
        categories: ["education", "productivity", "utilities"],
        orientation: "portrait-primary"
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "app-pages",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 }
            }
          },
          {
            urlPattern: ({ request }) => ["style", "script", "worker"].includes(request.destination),
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 7 }
            }
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-assets",
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-font-styles"
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-font-files",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
}))

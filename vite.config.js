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
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "AU CGPA Calculator",
        short_name: "CGPA Calc",
        description: "GPA and CGPA calculator for Anna University students",
        theme_color: "#1e3a5f",
        background_color: "#0f172a",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"]
      }
    })
  ]
}))

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from "fs"

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: {
      key: fs.readFileSync("./keys/agent2-key.pem"),
      cert: fs.readFileSync("./keys/agent2-cert.pem"),
    },
  },
  plugins: [vue()],
})

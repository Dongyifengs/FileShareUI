import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {readFileSync} from "fs"
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
    https: {
      key: readFileSync("./keys/agent2-key.pem"),
      cert: readFileSync("./keys/agent2-cert.pem"),
    },
  },
  plugins: [vue(), Components({resolvers: [VantResolver()]})],
})

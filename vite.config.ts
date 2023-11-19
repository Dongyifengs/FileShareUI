import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {VantResolver} from '@vant/auto-import-resolver';
import {readFileSync} from "node:fs";
import AutoImport from 'unplugin-auto-import/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: 5173,
        https: {
            key: readFileSync("keys/agent2-key.pem"),
            cert: readFileSync("keys/agent2-cert.pem"),
        }
    },
    plugins: [AutoImport({resolvers: [ElementPlusResolver()],}), Components({resolvers: [ElementPlusResolver(), VantResolver()],}), vue()],
})

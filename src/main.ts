import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import Mobile from './views/AppMobile.vue'
import PC from './views/AppPC.vue'
import 'element-plus/dist/index.css';
import {createRouter, createWebHashHistory} from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {path: "/", component: PC},
        {path: "/mobile", component: Mobile}
    ]
})
const app = createApp(App);
app.use(router);
app.mount('#app');

import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import OverView from './components/OverView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/overview', component: OverView}
    ]
});

const app = createApp(App);

app.use(router);

app.mount('#app');
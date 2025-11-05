import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import DashBoard from './components/DashBoard.vue'
import AddItem from './components/AddItem.vue'
import AllRecipes from './components/AllRecipes.vue'
import MyFridge from './components/MyFridge.vue'
import ShoppingList from './components/ShoppingList.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', component: DashBoard},
        {path: '/opskrifter', component: AllRecipes},
        {path: '/indtast',component: AddItem},
        {path: '/mitkøleskab', component: MyFridge},
        {path: '/indkøbsliste', component: ShoppingList}
    ]
});

const app = createApp(App);

app.use(router);

app.mount('#app');
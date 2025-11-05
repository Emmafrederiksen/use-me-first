import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import DashBoard from './components/DashBoard.vue'
import AddItem from './components/AddItem.vue'
import AllRecipes from './components/AllRecipes.vue'
import MyFridge from './components/MyFridge.vue'
import ShoppingList from './components/ShoppingList.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', 
            component: DashBoard,
            meta: {
                title: 'Godmorgen, Laura! 👋',
                subtitle: 'Her er et overblik over dit køleskab i dag.',
            }
        },

        {
            path: '/opskrifter',
            component: AllRecipes,
            meta: {
                title: 'Opskrifter',
                subtitle: 'Find opskrifter baseret på dine varer.',
            }
        },

        {
            path: '/indtast',
            component: AddItem,
            meta: {
                title: 'Tilføj varer',
                subtitle: 'Udfyld oplysningerne nedenfor for at tilføje en ny madvare.',
            }
        },

        {
            path: '/mitkoeleskab', 
            component: MyFridge,
            meta: {
                title: 'Mit køleskab',
                subtitle: 'Her er en oversigt over alle dine nuværende madvarer.',
            }
        },

        {
            path: '/indkoebsliste',
            component: ShoppingList,
            meta: {
                title: 'Indkøbsliste',
                subtitle: 'Her er en liste over de varer, du skal købe.',
            },
        },
    ]
});


const app = createApp(App);

app.use(router);

app.mount('#app');
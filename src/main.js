import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import DashBoard from './components/DashBoard.vue'
import AddItem from './components/AddItem.vue'
import AllRecipes from './components/AllRecipes.vue'
import MyFridge from './components/MyFridge.vue'
import ShoppingList from './components/ShoppingList.vue'
import RecipeDetail from './components/RecipeDetail.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import ItemOverview from './components/ItemOverview.vue'

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
            path: '/mitkoeleskab/:name',
            name: 'ItemOverview',
            component: ItemOverview,
            props: true,
            meta: {
                title: '{{ itemName }}',
                subtitle: 'Her er en oversigt over dine varer af denne type.',
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

        {
            path: '/rugbroedschips',
            name: 'RugbroedschipsOpskrift',
            component: RecipeDetail
        },

        {
            path: '/opskrifter/rugbroedschips',
            name: 'Rugbroedschips',
            component: RecipeDetail
          }
          
    ]
});


// SEED-DATA: Vi gemmer nogle startvarer, hvis der ikke allerede findes nogen. Dem der findes mountes først i MyFridge.vue, derfor skal vi bruge data allerede her i vores eksempel.
if (!localStorage.getItem('fridgeItems')) {
  const seed = [
    { id: 1, name: 'Mælk', expiresAt: '2025-11-08', amount: 1, unit: 'Liter', location: 'Køleskab' },
    { id: 2, name: 'Mælk', expiresAt: '2025-11-17', amount: 2, unit: 'Liter', location: 'Køleskab' },
    { id: 3, name: 'Mælk', expiresAt: '2025-11-19', amount: 2, unit: 'Liter', location: 'Køleskab' },
    { id: 4, name: 'Rugbrød', expiresAt: '2025-11-11', amount: 1, unit: 'Stk.', location: 'Køleskab' },
    { id: 5, name: 'Kyllingebryst', expiresAt: '2025-11-13', amount: 1, unit: 'Bakke(r)', location: 'Køleskab' },
  ];
  localStorage.setItem('fridgeItems', JSON.stringify(seed));
}


const app = createApp(App);

app.use(router);

app.mount('#app');
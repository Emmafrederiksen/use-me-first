import { createApp } from 'vue'
import { createRouter, createWebHistory} from 'vue-router'
import App from './App.vue'
import DashBoard from './components/DashBoard.vue'
import AddItem from './components/AddItem.vue'
import AllRecipes from './components/AllRecipes.vue'
import MyFridge from './components/MyFridge.vue'
import ShoppingList from './components/ShoppingList.vue'
import RecipeDetail from './components/RecipeDetail.vue'

import ItemOverview from './components/ItemOverview.vue'
import RecipeForm from './components/RecipeForm.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

import Toast from "vue3-toastify";
import "vue3-toastify/dist/index.css";


const router = createRouter({ 
    history: createWebHistory(),
    routes: [
        {
            path: '/', 
            component: DashBoard,
            meta: {
                title: 'Godmorgen, Laura! 👋',
                subtitle: 'Her er dit daglige overblik. <br>Du gør en forskel hver dag ved at bruge dine varer i tide.',
            }
        },

        {
            path: '/opskrifter',
            component: AllRecipes,
            meta: {
                title: 'Opskrifter',
                subtitle: 'Find inspiration til nemme og lækre opskrifter.',
            }
        },

        {
            path: '/indtast',
            component: AddItem,
            meta: {
                title: 'Tilføj varer',
                subtitle: 'Udfyld oplysningerne for din vare. <br>Så hjælper vi dig med at holde styr på dit køleskab.',
            }
        },

        {
            path: '/mitkoeleskab', 
            component: MyFridge,
            meta: {
                title: 'Mit køleskab',
                subtitle: 'Her kan du se alle dine madvarer samlet ét sted.<br> Få hurtigt overblik over, hvad du har og hvad der snart skal bruges.',
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
            path: '/opskrift/:id',
            name: 'RecipeDetail',
            component: RecipeDetail,            
        },

        {
            path: '/opskrifter/tilføj',
            name: 'CreateRecipe',
            component: RecipeForm,
        }, 

        {
            path: '/opskrifter/rediger/:id',
            name: 'EditRecipe',
            component: RecipeForm,
            props: true,
        },
        
    ]
});


// SEED-DATA: Vi gemmer nogle startvarer, hvis der ikke allerede findes nogen. Dem der findes mountes først i MyFridge.vue, derfor skal vi bruge data allerede her i vores eksempel.
if (!localStorage.getItem('fridgeItems')) {
  const seed = [
    { id: 1, name: 'Mælk', expiresAt: '2025-11-20', amount: 1, unit: 'Liter', location: 'Køleskab' },
    { id: 2, name: 'Mælk', expiresAt: '2025-11-21', amount: 2, unit: 'Liter', location: 'Køleskab' },
    { id: 3, name: 'Mælk', expiresAt: '2025-11-23', amount: 2, unit: 'Liter', location: 'Køleskab' },
    { id: 4, name: 'Rugbrød', expiresAt: '2025-11-24', amount: 1, unit: 'Stk.', location: 'Køleskab' },
    { id: 5, name: 'Kyllingebryst', expiresAt: '2025-11-28', amount: 1, unit: 'Bakke(r)', location: 'Køleskab' },
  ];
  localStorage.setItem('fridgeItems', JSON.stringify(seed));
}


const app = createApp(App);

app.use(router);

app.use(Toast, {
  autoClose: 3000,
  position: "top-center",
  closeOnClick: true,
  draggable: false,
  newestOnTop: true,
  pauseOnHover: true,
  theme: "light"
});

app.mount('#app');


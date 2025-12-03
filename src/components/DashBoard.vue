<template> 

    <HeaderCard 
    
    :title-override="`${greeting}, ${userName}! 👋`"
    @open-menu="openMenu"
    />

    <!-- Bootstrap alert -->
    <div v-if="showAlert" class="alert shadow rounded-4 fade show mt-5 mx-4 py-4 d-flex justify-content-between align-items-center" role="alert">
      <span>Du har <strong>{{ alertCount }}</strong> varer, som snart udløber <br> og du har <strong>{{ expiredItemsCount }}</strong> varer, som <strong> er udløbet</strong></span>
      <button type="button" class="btn-close ms-2" aria-label="Luk" @click="dismissAlert"></button>
  </div>


    <UseMeFirstCarouselVue 
      :daysUntilExpiry="4" 
      :maxVisibleItems="10" 
      :items="entries"
      @open-product="openFromCarousel"      
      />

    <AddNewCard />

    <div class="mx-4 mt-5">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2>Opskriftsforlag</h2>
        <router-link to="/opskrifter" class="see-all-text">Se alle</router-link>
      </div>

      <router-link
        :to="{ name: 'RecipeDetail', params: { id: 1 } }"
        class="text-decoration-none"
      > 
        <div class="card recipe-card mb-3">
          <img :src="Rugbroedschips" class="card-img" alt="Rugbrødschips">
          <div class="card-img-overlay d-flex flex-column justify-content-end">
            <h3 class="card-title text-white">Rugbrødschips</h3>
          </div>
        </div>
      </router-link>


      <div class="row g-3">
        <div class="col-6">
          <router-link :to="{ name: 'RecipeDetail', params: { id: 2 } }" class="text-decoration-none">
            <div class="card recipe-card">
              <img :src="Pandekager" class="card-img" alt="Pandekager">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <h3 class="card-title text-white">Pandekager</h3>
              </div>
            </div>
          </router-link>
        </div>

        <div class="col-6">
          <router-link :to="{ name: 'RecipeDetail', params: { id: 3 } }" class="text-decoration-none">
            <div class="card recipe-card">
              <img :src="Kylling" class="card-img" alt="Kylling i kokosmælk">
              <div class="card-img-overlay d-flex flex-column justify-content-end">
                <h3 class="card-title text-white">Kylling i kokosmælk</h3>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>



<ProductModal 
  v-if="showModal && selectedProduct" 
  :visible="showModal"
  :product="selectedProduct"
  @close="showModal = false"
  v-on:delete-product="deleteProduct"
  v-on:update-product="updateProduct"
>

</ProductModal>


</template>

<script>

import HeaderCard from './HeaderCard.vue';
import AddNewCard from './AddNewCard.vue';
import Rugbroedschips from '@/assets/rugbroedschips.jpg';
import Pandekager from '@/assets/pandekager.jpg';
import Kylling from '@/assets/kylling-ret.jpg';
import UseMeFirstCarouselVue from './UseMeFirstCarousel.vue';
import ProductModal from './ProductModal.vue';

export default {

  name: 'DashBoard',

  components: {
    HeaderCard,
    AddNewCard,
    UseMeFirstCarouselVue,
    ProductModal,
  },

  props: {
    openMenu: {
      type: Function,
      required: true,
    },
  },


  data() {

    // Her tjekker vi om brugeren allerede har lukket den
    const dismissed = localStorage.getItem('dashAlertDismissed') === '1'
    const storedItems = JSON.parse(
      sessionStorage.getItem('allItems') ||
      localStorage.getItem('myFridgeItems') ||
      localStorage.getItem('fridgeItems') ||
      '[]'
    );
    

    
    return {
      showAlert: !dismissed, // hvis dismissed er true → skjul
      Rugbroedschips, Pandekager, Kylling,
      userName: 'Laura',
      now: new Date(),
      timerId: null,
      selectedProduct: null,
      showModal: true,
      entries: storedItems,
    }

  },


  computed: {

    greeting() {
      const hours = this.now.getHours();
      if (hours >= 5 && hours <= 10) return 'Godmorgen';
      if (hours >= 11 && hours <= 13) return 'God formiddag';
      if (hours >= 14 && hours <= 17) return 'God eftermiddag';
      return 'Godaften';
    },


    alertCount() {
    const items = this.entries || [];
    const today = new Date(); 
    today.setHours(0,0,0,0);

    return items.filter(i => {
      const d = new Date(i.expiresAt); 
      d.setHours(0,0,0,0);
      const days = Math.round((d - today) / 86400000);
      return days >= 0 && days <= 4;   // 0–4 dage
    }).length;

},

expiredItemsCount() {
  const items = this.entries || [];
  const today = new Date(); 
  today.setHours(0,0,0,0);

  return items.filter(i => {
    const d = new Date(i.expiresAt);
    d.setHours(0,0,0,0);
    return d < today;               // udløbet
  }).length;
},

  },


  mounted() {
    // Dette kaldes automatisk når komponenten vises
    this.timerId = setInterval(() => {
      this.now = new Date();
    }, 60 * 1000);
  },

  beforeUnmount() {
    // Dette kaldes automatisk når man forlader siden
    clearInterval(this.timerId);
  },


  methods: {
    dismissAlert() {
      this.showAlert = false
      localStorage.setItem('dashAlertDismissed', '1')
    },

    openFromCarousel(item) {
      this.selectedProduct = {...item};
      this.showModal = true;
    },
    deleteProduct(id) {
          // 1: Hent allItems fra sessionStorage
          const allItems = JSON.parse(sessionStorage.getItem('allItems') || '[]');
          const myFridgeItems = JSON.parse(localStorage.getItem('myFridgeItems') || '[]');
          

          // 2: Fjern produkt fra allItems og gem tilbage i sessionStorage
          const updatedAll = allItems.filter(item => item.id !== id);
          const updatedMyFridge = myFridgeItems.filter(item => item.id !== id);
          sessionStorage.setItem('allItems', JSON.stringify(updatedAll));
          localStorage.setItem('myFridgeItems', JSON.stringify(updatedMyFridge));

          // 3: Opdater lokal entries
          this.entries = this.entries.filter(item => item.id !== id);

          // 4: Gem ny groupEntries
          sessionStorage.setItem('groupEntries', JSON.stringify(this.entries));
          localStorage.setItem('myFridgeItems', JSON.stringify(this.entries));
        },
        formatProductForStorage(product) {
            return {
              ...product,
              unitName: product.unitId,
              locationName: product.locationId,
          };
      },  
      updateProduct(updatedProduct) {
    // 1: Opdater entries lokalt
    const index = this.entries.findIndex(item => item.id === updatedProduct.id);
    if (index !== -1) {
      this.entries.splice(index, 1, updatedProduct);
      this.selectedProduct = updatedProduct;
    }

    // 2: Formatér produkt til gemning
    const formattedProduct = this.formatProductForStorage(updatedProduct);

    // 3: Gem entries i sessionStorage og localStorage
    const updatedEntries = this.entries.map(item => this.formatProductForStorage(item));
    sessionStorage.setItem('groupEntries', JSON.stringify(updatedEntries));
    localStorage.setItem('myFridgeItems', JSON.stringify(updatedEntries));

    // 4: Opdater allItems
    const allItems = JSON.parse(sessionStorage.getItem('allItems') || '[]');
    const allIndex = allItems.findIndex(item => item.id === updatedProduct.id);
    if (allIndex !== -1) {
      allItems.splice(allIndex, 1, formattedProduct);
      sessionStorage.setItem('allItems', JSON.stringify(allItems));
    }
  },

   mapUnit(unitId) {
            const units = {
                '1': 'Gram',
                '2': 'Bakke(r)',
                '3': 'Stk.',
                '4': 'Kilo',
                '5': 'Liter',
                '6': 'Pakke(r)',
            };
            return units[unitId] || '(enhed ikke angivet)';
        },
        mapLocation(locationId) {
            const locations = {
                '1': 'Køleskab',
                '2': 'Fryser',
                '3': 'Depot',
            };
            return locations[locationId] || 'Køleskab';
        },
  },

  openMenu() {
    console.log("MENU ÅBNES!!");
    this.$root.showMenu = true;
  }

}


</script>

<style scoped>

.alert {
  background: #ffffff;
  color: #2c2c2c;
}

.recipe-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);
}

.recipe-card .card-img {
  height: 140px;
  object-fit: cover;
  filter: brightness(70%);
}

.recipe-card .card-img-overlay {
  background: rgba(0,0,0,0.1);
  color: white;
}

h2 {
  font-weight: 600;
  font-size: 22px;
  color: #2c2c2c;
}

h3 {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 0px;
}

.see-all-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #F27405;
  text-decoration: underline;
}


</style>
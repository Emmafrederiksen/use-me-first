<template> 

    <HeaderCard 
    
    :title-override="`${greeting}, ${userName}! 👋`"
    @open-menu="openMenu"
    />

    <!-- Bootstrap alert -->
    <div
      v-if="showAlert"
      class="alert-wrapper"
      role="alert"
      aria-live="polite"
      >
      <span class="alert-text">
        Du har <strong>{{ alertCount }}</strong> varer, som snart udløber 
        og du har <strong>{{ expiredItemsCount }}</strong> varer, som <strong>er udløbet</strong>
      </span>
  
      <button 
        type="button" class="btn-close alert-close" aria-label="Luk" @click="dismissAlert">
      </button>
    </div>


    <UseMeFirstCarouselVue 
      :daysUntilExpiry="4" 
      :maxVisibleItems="10" 
      :items="entries"
      @open-product="openFromCarousel"      
      />

    <AddNewCard />

      <div class="recipes-wrapper">

        <div class="recipes-header">
          <h2>Opskriftsforslag</h2>

          <router-link to="/opskrifter" class="see-all-btn" aria-label="Se alle opskrifter">
            <i class="bi bi-arrow-right-short" aria-hidden="true"></i> 
          </router-link>
        </div>


        <div class="recipes-grid">

          <!-- FEATURE CARD -->
          <router-link
            :to="{ name: 'RecipeDetail', params: { id: 1 } }"
            class="recipe-card recipe-feature text-decoration-none"
            aria-label="Se opskrift på Rugbrødschips"
          >
            <img :src="Rugbroedschips" alt="Rugbrødschips">
            <h3 class="recipe-title">Rugbrødschips</h3>
          </router-link>

          <!-- SMALL CARD 1 -->
          <router-link
            :to="{ name: 'RecipeDetail', params: { id: 2 } }"
            class="recipe-card recipe-small text-decoration-none"
            aria-label="Se opskrift på Pandekager"
          >
            <img :src="Pandekager" alt="Pandekager">
            <h3 class="recipe-title">Gammeldags pandekager</h3>
          </router-link>

          <!-- SMALL CARD 2 -->
          <router-link
            :to="{ name: 'RecipeDetail', params: { id: 3 } }"
            class="recipe-card recipe-small text-decoration-none"
            aria-label="Se opskrift på Kylling i kokosmælk"
          >
            <img :src="Kylling" alt="Kylling i kokosmælk">
            <h3 class="recipe-title">Kylling i kokosmælk</h3>
          </router-link>

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

/* ----------------------------- */
/*  BASE ALERT LAYOUT (MOBILE)   */
/* ----------------------------- */

.alert-wrapper {
  background: white;
  color: #2c2c2c;
  border-radius: 24px;
  padding: 1.5rem 1.2rem;
  margin: 3rem 1.5rem 0 1.5rem; /* mobil margin */
  box-shadow: 0 10px 14px rgba(0,0,0,0.12);

  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  animation: fadeInAlert 0.45s ease;
}

.alert-text {
  font-size: 1rem; /* = 16px */
  line-height: 1.45;
  padding-right: 2rem;
}

.alert-close {
  position: absolute;
  top: 20px;
  right: 20px;
}

@keyframes fadeInAlert {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}



/* ----------------------- */
/* TABLET (600px → 991px) */
/* ----------------------- */
@media (min-width: 600px) {
  .alert-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
    padding: 2rem 1.8rem;
  }

  .alert-text {
    font-size: 1.125rem; /* = 18px */
  }
  
}

/* ----------------------- */
/* LAPTOP (992px → 1399px) */
/* ----------------------- */
@media (min-width: 992px) and (max-width: 1399px) {
  .alert-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  .alert-text {
    font-size: 1.125rem; /* = 18px */
  }

  .alert-close {
  font-size: 1rem;
  }
}

/* --------------------------- */
/* LARGE DESKTOP (≥ 1400px)    */
/* --------------------------- */
@media (min-width: 1400px) {
  .alert-wrapper {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  .alert-text {
    font-size: 1.125rem; /* = 18px */
  }

  .alert-close {
  font-size: 1rem;
  }

}
  

/* --------------------------- */
/* ULTRA-WIDE (≥ 1800px)       */
/* --------------------------- */
@media (min-width: 1800px) {
  .alert-wrapper {
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5rem;
  }

  .alert-close {
  font-size: 1.1rem; 
  }
}


/* -------------------------------- */
/* ---------- Opskrifter ---------- */
/* -------------------------------- */

/* WRAPPER */
.recipes-wrapper {
  margin: 3rem 1.5rem;
}

.see-all-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #08300f;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem; 
  font-weight: 700;
  text-decoration: none;
  transition: 0.25s ease;
  cursor: pointer;
  margin-bottom: 12px;
}

.see-all-btn i {
  font-size: 1.9rem;
  color: #ffffff;
}

/* hover = orange med skygge */
.see-all-btn:hover {
  background: #f27405;
  color: white;
  border-color: #f27405;
  box-shadow: 0 8px 14px rgba(242, 116, 5, 0.35);
  transform: translateY(-2px);
}

.see-all-btn:active {
  transform: scale(0.95);
  box-shadow: none;
}

/* Juster container for alignment */
.recipes-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}


/* KORT GENEREL STYLING */
.recipe-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  display: block;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);

  transition: transform 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease;
  animation: fadeInRecipeCard 0.45s ease;
  
}

.recipe-card:hover {
  transform: translateY(-4px);
  filter: brightness(1.05);
  box-shadow: 0 12px 20px rgba(0,0,0,0.25);
}

.recipe-card img {
  width: 100%;
  height: 170px;
  object-fit: cover;
  filter: brightness(50%);
}

.recipe-title {
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  margin: 0;
  font-size: 1rem; /* = 16px */
  color: white;
  font-weight: 600;
}

/* ------------------------------- */
/* 📱 MOBILE (op til 599px)       */

.recipes-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr; /* altid én kolonne i starten */
}

/* det store kort fylder hele bredden */
.recipe-feature {
  grid-column: 1 / 3;
  height: 220px;
}

.recipe-feature img {
  height: 220px;
}

/* ----------------------- */
/* TABLET (600px → 991px) */
/* ----------------------- */

@media (min-width: 600px) and (max-width: 991px) {

  .recipes-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
    margin-top: 3rem;
  }

  .recipes-grid {
    grid-template-columns: 1fr 1fr; /* to små kort side om side */
    gap: 16px;
  }

  .recipe-feature {
    grid-column: 1 / 3; /* stort kort fylder hele rækken */
  }

  .recipe-feature img {
    height: 220px;
  }

  .recipe-small img {
    height: 170px;
  }

  .recipe-title {
  font-size: 1.125rem; /* = 18px */
  }
}

/* ----------------------- */
/* LAPTOP (992px → 1399px) */
/* ----------------------- */

@media (min-width: 992px) and (max-width: 1399px) {

  .recipes-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  .recipes-grid {
    grid-template-columns: 1fr; /* tre kolonner */
  }

  .recipe-feature {
    grid-column: 1 / 3; /* stort kort fylder to kolonner */
    height: 240px;
  }

  .recipe-feature img {
    height: 240px;
  }

  .recipe-small img {
    height: 170px;
  }

  .recipe-title {
  font-size: 1.25rem; /* = 20px */
  }

}



/* ------------------------------- */
/* DESKTOP (≥1400px) */
/* Layout: 3 store lige store kort */
/* ------------------------------- */

@media (min-width: 1400px) {

  .recipes-wrapper {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  .recipes-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }

  /* ALLE kort skal være ens store */
  .recipe-card,
  .recipe-card img {
    height: 240px !important;
  }

  .recipe-feature {
    grid-column: auto; /* mister sin store placering */
  }

  .recipe-title {
  font-size: 1.25rem; /* = 20px */
  }
}

/* ULTRA BREDE SKÆRME */
@media (min-width: 1800px) {
  .recipes-wrapper {
    max-width: 80%;
    margin-top: 5rem;
  }
}



@keyframes fadeInRecipeCard {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}


.dark-mode h2 {
  color: #ffffff;
}


</style>
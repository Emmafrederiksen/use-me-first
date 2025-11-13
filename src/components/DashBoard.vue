<template> 
    <HeaderCard 
    
    :title-override="`${greeting}, ${userName}! 👋`"
    
    />

    <!-- Bootstrap alert -->
    <div v-if="showAlert" class="alert shadow rounded-4 fade show mt-5 mx-4 py-4 d-flex justify-content-between align-items-center" role="alert">
      <span>Du har <strong>{{ alertCount }}</strong> varer, som snart udløber.</span>
      <button type="button" class="btn-close ms-2" aria-label="Luk" @click="dismissAlert"></button>
  </div>


    <UseMeFirstCarouselVue :daysUntilExpiry="4" :maxVisibleItems="10" @open-product="openFromCarousel"/>

    <AddNewCard />

    <div class="mx-4 mt-5">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2>Opskriftsforlag</h2>
        <router-link to="/opskrifter" class="see-all-text">Se alle</router-link>
      </div>

      <router-link to="/opskrifter/rugbroedschips" class="text-decoration-none"> 
      <div class="card recipe-card mb-3">
        <img v-bind:src="Rugbroedschips" class="card-img" alt="Rugbrødschips">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <h3 class="card-title text-white">Rugbrødschips</h3>
        </div>
      </div>
      </router-link>

      <div class="row g-3">
        <div class="col-6">
          <div class="card recipe-card">
            <img v-bind:src="Pandekager" class="card-img" alt="Pandekager">
            <div class="card-img-overlay d-flex flex-column justify-content-end">
            <h3 class="card-title text-white">Pandekager</h3>
        </div>
      </div>
    </div>
     <div class="col-6">
      <div class="card recipe-card">
        <img v-bind:src="Kylling" class="card-img" alt="Kylling i kokosmælk">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <h3 class="card-title text-white">Kylling i kokosmælk</h3>
        </div>
      </div>
    </div>
  </div>
  </div>


<ProductModal 
v-if="showModal && selectedProduct" 
:visible="showModal"
:product="selectedProduct"
@close="showModal = false"
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


  data() {

    // Her tjekker vi om brugeren allerede har lukket den
    const dismissed = localStorage.getItem('dashAlertDismissed') === '1'
    
    return {
      showAlert: !dismissed, // hvis dismissed er true → skjul
      Rugbroedschips, Pandekager, Kylling,
      userName: 'Laura',
      now: new Date(),
      timerId: null,
      selectedProduct: null,
      showModal: true,
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
    // Læs det I allerede har gemt (vælg den første liste der findes)
    const items = JSON.parse(
      sessionStorage.getItem('allItems') ||
      localStorage.getItem('fridgeItems') ||
      localStorage.getItem('myFridgeItems') ||
      '[]'
    );

    // Tæl kun varer der udløber snart = 0–3 dage (ikke udløbet)
    const today = new Date(); today.setHours(0,0,0,0);
    return items.filter(i => {
      const d = new Date(i.expiresAt); d.setHours(0,0,0,0);
      const days = Math.round((d - today) / 86400000); // 86.400.000 ms = 1 dag
      return days >= 0 && days < 4; // 0,1,2,3
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
    }

  },


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
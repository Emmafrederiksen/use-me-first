<template> 
    <HeaderCard />

    <!-- Bootstrap alert -->
    <div v-if="showAlert" class="alert shadow rounded-4 fade show mt-5 mx-4 py-4" role="alert">
      Du har <strong> {{ itemCount }} </strong> varer, som snart udløber.
      <button type="button" class="btn-close" aria-label="Luk" @click="dismissAlert"></button>
    </div>

    <AddNewCard />

    <div class="mx-4 mt-5">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2>Opskriftsforlag</h2>
        <router-link to="/opskrifter" class="see-all-text">Se alle</router-link>
      </div>

      <div class="card recipe-card mb-3">
        <img v-bind:src="Rugbroedschips" class="card-img" alt="Rugbrødschips">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3 class="card-title text-white">Rugbrødschips</h3>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-6">
          <div class="card recipe-card">
            <img v-bind:src="Pandekager" class="card-img" alt="Pandekager">
            <div class="card-img-overlay d-flex flex-column justify-content-end">
            <div class="icon-top d-flex justify-content-end">
              <i class="bi bi-arrow-right-circle fs-1"></i>
            </div>
            <h3 class="card-title text-white">Pandekager</h3>
        </div>
      </div>
    </div>
     <div class="col-6">
      <div class="card recipe-card">
        <img v-bind:src="Kylling" class="card-img" alt="Kylling i kokosmælk">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3 class="card-title text-white">Kylling i kokosmælk</h3>
        </div>
      </div>
    </div>
  </div>
  </div>



</template>

<script>

import HeaderCard from './HeaderCard.vue';
import AddNewCard from './AddNewCard.vue';
import Rugbroedschips from '@/assets/rugbroedschips.jpg';
import Pandekager from '@/assets/pandekager.jpg';
import Kylling from '@/assets/kylling-ret.jpg';

export default {

  name: 'DashBoard',

  components: {
    HeaderCard,
    AddNewCard,
  },

  data() {
    // Her tjekker vi om brugeren allerede har lukket den
    const dismissed = localStorage.getItem('dashAlertDismissed') === '1'
    
    return {
      showAlert: !dismissed, // hvis dismissed er true → skjul
      itemCount: 3,
      Rugbroedschips,
      Pandekager,
      Kylling,
    }
  },

  methods: {
    dismissAlert() {
      this.showAlert = false
      localStorage.setItem('dashAlertDismissed', '1')
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

.icon-top {
  position: absolute;
  top: 10px;
  right: 15px;
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
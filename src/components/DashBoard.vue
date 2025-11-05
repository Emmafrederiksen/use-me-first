<template> 
    <HeaderCard />

    <!-- Bootstrap alert -->
    <div v-if="showAlert" class="alert shadow rounded-4 fade show mt-5 mx-4 py-4" role="alert">
      Du har <strong> {{ itemCount }} </strong> varer, som snart udløber.
      <button type="button" class="btn-close" aria-label="Luk" @click="dismissAlert"></button>
    </div>

</template>

<script>

import HeaderCard from './HeaderCard.vue';

export default {

  name: 'DashBoard',

  components: {
    HeaderCard,
  },

  data() {
    // Her tjekker vi om brugeren allerede har lukket den
    const dismissed = localStorage.getItem('dashAlertDismissed') === '1'
    
    return {
      showAlert: !dismissed, // hvis dismissed er true → skjul
      itemCount: 3
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

</style>
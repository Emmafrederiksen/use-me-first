<template> 
    <HeaderCard />

    <!-- Bootstrap alert -->
    <div class="alert shadow rounded-4 alert-dismissible fade show mt-5 mx-4 py-4" role="alert">
      Du har <strong> {{ itemCount }} </strong> varer, som snart udløber.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
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
    return {
      itemCount: 3,
    };
  }

}

</script>

<style scoped>

.alert {
  background: #ffffff;
  color: #2c2c2c;
}

</style>
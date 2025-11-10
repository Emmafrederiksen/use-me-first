<template>
  <div class="card mb-3 mx-4 shadow rounded-4 mt-5">
  <div class="card-body">
    <h3 class="py-4">Tilføj nye varer til <br> dit køleskab</h3>
    
    <!-- Router-knap -->
       <router-link to="/indtast" class="add-btn d-inline-flex align-items-center">
        <i class="bi bi-plus-circle me-2"></i>
        Tilføj varer
        </router-link>


        <img v-bind:src="bagImg" alt="Indkøbspose" class="add-img" />


  </div>
</div>
</template>

<script>

import bagImg from '@/assets/groceriebag.png';

export default {

  name: 'AddNewCard',

  data() {
    return { 
      bagImg,
      };
  },
  
}

</script>

<style scoped>

.card {
  background: linear-gradient(140deg,#1f3121  0%,#446847 100%);
  border: none;
  color: white;
}

.add-btn {
  background: #F27405;
  color: #ffffff;
  font-weight: 500;
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  margin-bottom: 10px;
  text-decoration: none;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);
}

.add-img {
    width: 120px;
    height: 120px;
    position: absolute;
    bottom: 25px;
    right: 10px;
}

h3 {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
}

</style>
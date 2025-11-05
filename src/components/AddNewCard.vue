<template>
  <div class="card mb-3 mx-4 shadow rounded-4 mt-5">
  <div class="card-body">
    <h5 class="card-title py-4">Indtast nye varer <br> til dit køleskab</h5>
    
    <!-- Router-knap -->
       <router-link to="/indtast" class="add-btn d-inline-flex align-items-center">
            Tilføj ny vare
        <i class="bi bi-plus-circle ms-2"></i>
        </router-link>


        <img :src="bagImg" alt="Indkøbspose" class="add-img" />


  </div>
</div>
</template>

<script>

import bagImg from '@/assets/groceries.png';

export default {

  name: 'AddNewCard',

  data() {
    return { bagImg }
  },
  
}

</script>

<style scoped>

.card {
  background: linear-gradient(90deg,#A6C48A  0%,#7CA982 100%);
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

</style>
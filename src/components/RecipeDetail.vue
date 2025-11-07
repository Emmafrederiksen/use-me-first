<template>
    <section class="recipe-header-card">
      <div class="card recipe-card">
        <img v-bind:src="Rugbroedschips" class="card-img" alt="Rugbrødschips">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <router-link to="/opskrifter" class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-left-circle fs-1"></i>
          </router-link>
          <h1 class="card-title text-white">Rugbrødschips</h1>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import Rugbroedschips from '@/assets/rugbroedschips.jpg';
  
  export default {
    name: 'RecipeDetail',
    data() {
      return { 
        Rugbroedschips 
        }
    }
  }
  </script>
  
  <style scoped>
  .recipe-header-card {
    width: 100%;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    overflow: hidden;
    margin-bottom: 2rem;
  }
  
  .recipe-header-card .recipe-card {
    position: relative;
  }
  
  .recipe-header-card .card-img {
    width: 100%;
    height: 230px;
    object-fit: cover;
    filter: brightness(70%);
  }
  
  .recipe-header-card .card-img-overlay {
    background: rgba(0,0,0,0.2); 
    color: white;
  }
  
  .recipe-header-card .icon-top {
    position: absolute;
    top: 10px;
    left: 15px;
  }
  
  .recipe-header-card .card-title {
    font-size: 2rem;
    font-weight: 600;
  }
  .icon-top i {
    color: white;
  }
  </style>
  
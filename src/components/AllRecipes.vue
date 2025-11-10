<template>
    <HeaderCard />

<div class="mx-4 mt-5">
  <div class="row g-3">

    <div class="col-6">
        <router-link to="/opskrifter/rugbroedschips" class="card recipe-card mb-2 text-decoration-none">
            <img v-bind:src="Rugbroedschips" class="card-img" alt="Rugbrødschips">
            <div class="card-img-overlay d-flex flex-column justify-content-end">
                <div class="icon-top d-flex justify-content-end">
                    <i class="bi bi-arrow-right-circle fs-1"></i>
                </div>
                <h3>Rugbrødschips</h3>
            </div>
        </router-link>
    </div>


    <div class="col-6">
      <div class="card recipe-card mb-2">
        <img v-bind:src="Pandekager" class="card-img" alt="Pandekager">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3>Pandekager</h3>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="card recipe-card mb-2">
        <img v-bind:src="Kylling" class="card-img" alt="Kylling i kokosmælk">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3>Kylling i kokosmælk</h3>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="card recipe-card mb-2">
        <img v-bind:src="Oksegryde" class="card-img" alt="Kylling i kokosmælk">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3>Oksekødgryde</h3>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="card recipe-card mb-2">
        <img v-bind:src="Pasta" class="card-img" alt="Kylling i kokosmælk">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3>Pastasalat</h3>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="card recipe-card mb-2">
        <img v-bind:src="Wraps" class="card-img" alt="Kylling i kokosmælk">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3>Wraps</h3>
        </div>
      </div>
    </div>

    <div class="col-6">
      <div class="card recipe-card mb-2">
        <img v-bind:src="StegteRis" class="card-img" alt="Kylling i kokosmælk">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <div class="icon-top d-flex justify-content-end">
            <i class="bi bi-arrow-right-circle fs-1"></i>
          </div>
          <h3>Stegte ris</h3>
        </div>
      </div>
    </div>


  </div>
</div>

</template>

<script>

import HeaderCard from './HeaderCard.vue';
import Rugbroedschips from '@/assets/rugbroedschips.jpg';
import Pandekager from '@/assets/pandekager.jpg';
import Kylling from '@/assets/kylling-ret.jpg';
import Oksegryde from '@/assets/oksegryde.jpg';
import Wraps from '@/assets/wraps.jpg';
import Pasta from '@/assets/pasta-ret.jpg';
import StegteRis from '@/assets/stegte-ris.jpg';

export default {

    name: 'AllRecipes',

    data() {
        return {
            Rugbroedschips,
            Pandekager,
            Kylling,
            Oksegryde,
            Wraps,
            Pasta,
            StegteRis
        }
    },

    components: {
        HeaderCard
    },
   

}
</script>

<style scoped>
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
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7));
  color: white;
}


.icon-top {
  position: absolute;
  top: 10px;
  right: 15px;
}

.see-all-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #F27405;
  text-decoration: underline;
}


h3 {
    font-weight: 500;
    font-size: 18px;
    margin-bottom: 0px;
}
</style>
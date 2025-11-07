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

    <div class="time mt-4 mx-4 d-flex justify-content-end">
        <button>
            <i class="bi bi-clock"></i>
            40 minutter
        </button>
    </div>

    <div class="mx-4 mt-4">
        <h5 class="step-title">Beskrivelse</h5>
        <p>Nem opskrift på sprøde rugbrødschips. Brug rester af rugbrød til ristet rugbrød. De er gode til tapas, til dip og snack.</p>
    </div>

    <div class="mx-4 mt-5">
        <h5 class="step-title">Ingredienser</h5>
        <div class="ingredient-row">
            <p class="ingredient-amount mt-2">200 gram</p>
            <p class="ingredient-name mt-2">Rugbrød</p>
        </div>
        <div class="ingredient-row">
            <p class="ingredient-amount">3 spsk.</p>
            <p class="ingredient-name">Rasp- eller solsikkeolie</p>
        </div>
        <div class="ingredient-row">
            <p class="ingredient-amount">2 tsk.</p>
            <p class="ingredient-name">Salt</p>
        </div>
    </div>

    <div class="mx-4 mt-5">
        <h5 class="step-title mb-4">Fremgangsmåde</h5>
        <div>
            <div class="col-12">
                <div class="card step-card">
                    <div class="card-body d-flex align-items-start gap-4">
                        <p class="step-number">01</p>
                        <p class="step-text">Tænd ovnen på 155 grader varmluft.</p>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card step-card">
                    <div class="card-body d-flex align-items-start gap-3">
                        <p class="step-number">02</p>
                        <p class="step-text">Skær rugbrød ud i tynde skiver og del herefter i trekanter.</p>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card step-card">
                    <div class="card-body d-flex align-items-start gap-3">
                        <p class="step-number">03</p>
                        <p class="step-text">Vend de tynde trekanter i olie og salt. Fordel ud på en bageplade med bagepapir.</p>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card step-card">
                    <div class="card-body d-flex align-items-start gap-3">
                        <p class="step-number">04</p>
                        <p class="step-text">Bag dem først i 20 minutter. Tag dem herefter ud og vend godt rundt.
                            Giv dem yderligere 20 minutter.</p>
                    </div>
                </div>
            </div>

            <div class="col-12">
                <div class="card step-card">
                    <div class="card-body d-flex align-items-start gap-3">
                        <p class="step-number">05</p>
                        <p class="step-text">Lad dem køle helt af og opbevar så i en lufttæt beholder.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <br><br>
    <br><br>


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

  .time button {
    background: #f8f9fa;
    padding: 0.5rem 1rem;
    border-radius: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    color: #08300F;
  }

  .step-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .ingredient-row {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-bottom: 0rem;
  }

  .ingredient-amount {
    font-weight: 600;
    width: 110px;
  }

  .ingredient-name {
    flex: 1;
  }

  .step-card {
    background: linear-gradient(90deg,#A6C48A  0%,#7CA982 100%);
    border: none;
    border-radius: 15px;
    color: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    margin-bottom: 1rem;
}

.step-number {
    font-size: 2.8rem;
    font-weight: 600;
    margin-top: -1rem;
}

.step-text {
    font-size: 1rem;
    font-weight: 400;
    margin-top: 0.5rem;
}

  </style>
  
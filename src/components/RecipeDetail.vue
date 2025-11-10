<template>
    <section class="recipe-header-card">
      <div class="card recipe-card">
        <img v-bind:src="Rugbroedschips" class="card-img" alt="Rugbrødschips">
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <button class="icon-top d-flex justify-content-end border-0 bg-transparent p-0" @click="$router.back()">
            <i class="bi bi-arrow-left-circle fs-1 mx-2"></i>
          </button>
          <h1 class="mx-2">Rugbrødschips</h1>
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
        <h3>Beskrivelse</h3>
        <p>Nem opskrift på sprøde rugbrødschips. Brug rester af rugbrød til ristet rugbrød. De er gode til tapas, til dip og snack.</p>
    </div>

    <div class="mx-4 mt-5">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h3>Ingredienser</h3>
          
          <div class="portion-control d-flex align-items-center gap-2">
            <i class="bi bi-dash-square fs-1 mx-1" @click="decreasePortion"></i>
            <p class="mb-0 mx-1"> {{ portion }}</p>
            <i class="bi bi-plus-square fs-1 mx-1" @click="increasePortion"></i>
          </div>
        </div>  
    
        <div class="ingredient-row" v-for="(ingredients, index) in ingredients" :key="index">
            <p class="ingredient-amount mt-2"> {{ ingredients.baseAmount * portion }} {{ ingredients.unit }} </p>
            <p class="ingredient-name mt-2"> {{ ingredients.name }} </p>
        </div>
    </div>

    <div class="mx-4 mt-5">
        <h3>Fremgangsmåde</h3>
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


  </template>
  
  <script>

  import Rugbroedschips from '@/assets/rugbroedschips.jpg';
  
  export default {
    name: 'RecipeDetail',
    data() {
      return { 
        Rugbroedschips,
        portion: 1, // startværdi for antal portioner
        ingredients: [
            { name: 'Rugbrød', baseAmount: 200, unit: 'gram' },
            { name: 'Rasp- eller solsikkeolie', baseAmount: 3, unit: 'spsk.' },
            { name: 'Salt', baseAmount: 2, unit: 'tsk.' },
        ],
        }
    },
    methods: {
        increasePortion() {
            this.portion++;
        },
        decreasePortion() {
            if (this.portion > 1) this.portion --;
        },
    },
  }
  
  </script>
  
  <style scoped>

  h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 0.5rem;
 }

  h3 {
    font-weight: 700;
    font-size: 18px;
    margin-bottom: 1rem;
}

  .recipe-header-card {
    width: 100%;
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
    overflow: hidden;
    margin-bottom: 2rem;
  }

  .recipe-header-card .card {
    border: none;       /* fjerner Bootstrap-card border */
    border-radius: 0;   /* selve card’et behøver ikke radius, parent styrer det */
  }

  .recipe-header-card .recipe-card {
    position: relative;
  }
  
  .recipe-header-card .card-img {
    width: 100%;
    height: 230px;
    object-fit: cover;
    filter: brightness(70%);
    border-radius: inherit; /* arver parentens border-radius*/
  }
  
  .recipe-header-card .card-img-overlay {
    background: rgba(0,0,0,0.2); 
    color: white;
  }
  
  .recipe-header-card .icon-top {
    position: absolute;
    top: 40px;;
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
    background: linear-gradient(140deg,#1f3121  0%,#446847 100%);
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
  
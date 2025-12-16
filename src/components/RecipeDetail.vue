<template>

  <HeaderCard
    variant="recipe"
    :title-override="recipe.title"
    :show-back="true"
    :is-admin="isAdmin"
    :show-recipe-actions="isAdmin"
    @edit-recipe="editRecipe"
    @delete-recipe="showDeleteRecipeModal = true"
    @open-menu="openMenu"
  />

  <div class="recipe-layout">

    <div class="recipe-main">

      <div class="recipe-image">
        <img
          :src="require(`@/assets/${recipe.image || 'default-recipe.jpg'}`)"
          :alt="recipe.title"
        />
      </div>

      <section class="info-grid">
        <div class="time-wrapper">
          <i class="bi bi-clock"></i>
          <span>{{ recipe.totalTime }}</span>
        </div>

        <div class="info-left">
          <h3>Beskrivelse</h3>
          <p>{{ recipe.description }}</p>
        </div>
      </section>
    
      <section class="section-wrapper ingredients-section">

        <div class="ingredients-header">
          <h3>Ingredienser</h3>

          <div class="portion-control">
            <button
              @click="decreasePortion"
              class="icon-button"
              aria-label="Mindre portion"
            >
              <i class="bi bi-dash"></i>
            </button>

            <span class="portion-value">{{ portion }}</span>

            <button
              @click="increasePortion"
              class="icon-button"
              aria-label="Større portion"
            >
              <i class="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <div
          class="ingredient-row"
          v-for="(ing, index) in displayIngredients"
          :key="index"
          :class="{ checked: checkedIngredients.includes(index) }"
          @click="toggleIngredient(index)"
        >

          <p class="ingredient-amount">
            {{ ing.amount == null ? '' : ing.amount * portion }} {{ ing.unitName }}
          </p>
          
          <p class="ingredient-name">
            {{ ing.ingredientName }}
            <i
              v-if="checkedIngredients.includes(index)"
              class="bi bi-check-circle-fill ingredient-check"
            ></i>
          </p>
          
        </div>

      </section>

      <!-- ===================== -->
      <!-- STEPS                -->
      <!-- ===================== -->
      <section class="section-wrapper steps-section">

        <h3>Fremgangsmåde</h3>

        <div class="steps-list">
          <div
            class="step-card"
            v-for="(step, index) in steps"
            :key="index"
            :class="{ completed: completedSteps.includes(step.step) }"
            @click="toggleStep(step.step)"
          >
            <div class="step-inner">
              <p class="step-number">
                {{ step.step < 10 ? '0' + step.step : step.step }}
              </p>

              <p class="step-text">
                {{ step.stepDescription }}
              </p>

              <i
                v-if="completedSteps.includes(step.step)"
                class="bi bi-check-circle-fill step-check"
              ></i>
            </div>
          </div>
        </div>

      </section>

    </div>
  </div>

  
  <ConfirmDeleteRecipeModal
    :visible="showDeleteRecipeModal"
    :recipeTitle="recipe.title"
    @close="showDeleteRecipeModal = false"
    @confirm="handleDeleteRecipeConfirmed"
  />

</template>

  
  <script>

  import RecipeDataService from '@/services/RecipeDataService';
  import RecipeStepsDataService from '@/services/RecipeStepsDataService';
  import IngredientDataService from '@/services/IngredientDataService';
  import UnitDataService from '@/services/UnitDataService';
  import Recipe_IngredientDataService from '@/services/Recipe_IngredientDataService';
  import ConfirmDeleteRecipeModal from "./ConfirmDeleteRecipeModal.vue";
  import HeaderCard from './HeaderCard.vue';

  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';

  
  export default {

    name: 'RecipeDetail',

    components: {
        ConfirmDeleteRecipeModal,
        HeaderCard,
    },

    props: {
    ["openMenu"]: {
      type: Function,
      required: true,
    },
  },

    data() {
      return { 

        isAdmin: localStorage.getItem('isAdmin') === "1",
        recipeID: 0,
        recipe: {},             // én opskrift fra backend
        recipeIngredient: [],   // liste over ingredienser i en opskrift 
        ingredients: [],        // ingredienser fra backend
        steps: [],              // steps fra backend
        units: [],              // units fra backend
        portion: 1, // startværdi for antal portioner
        showDeleteRecipeModal: false,
        completedSteps: [],
        checkedIngredients: []

      }
    },

    computed: {

      displayIngredients() {
       
        return this.recipeIngredient.map(ri => {                                                      // map over den liste der kommer fra recipe_ingredient-tabellen

          const ingredient = this.ingredients.find(i => i.ingredientID === ri.ingredientID);          // find den rigtige ingredient
          
          const unit = this.units.find(u => u.unitID === ri.unitID);                                  // find den rigtige unit

          return {
            amount: ri.amount,                                                                        // mængden kommer direkte fra recipe_ingredient-rækken
            unitName: unit ? unit.name : '',                                                          // tilpas feltnavne til jeres backend (unitName / name / unit etc.)
            ingredientName: ingredient ? ingredient.name : ''
          };

        });
      }

    },


    methods: {

        increasePortion() {
            this.portion++;
        },
        decreasePortion() {
            if (this.portion > 1) this.portion --;
        },

        async handleDeleteRecipeConfirmed() {
          try {
            await RecipeDataService.delete(this.recipeID);
            this.showDeleteRecipeModal = false;
              // Gem toast besked
              sessionStorage.setItem("recipeToast", "Opskriften er slettet!");

              this.$router.push("/opskrifter");

            } catch (err) {
              console.error(err);

              toast.error("Noget gik galt ved sletning!", {
                autoClose: 3000,
                position: toast.POSITION.TOP_CENTER,
              });
          }
        },

        editRecipe() {
          this.$router.push({
            name: 'EditRecipe',
            params: { id: this.recipeID },
          });
        },

      goBack() {
        const cameFromEdit = sessionStorage.getItem("fromEdit");

        if (cameFromEdit === "1") {
          sessionStorage.removeItem("fromEdit");
          this.$router.push("/opskrifter");
        } else {
          this.$router.back();
        }
      },

      toggleStep(stepNumber) {
        const index = this.completedSteps.indexOf(stepNumber);

        if (index === -1) {
          this.completedSteps.push(stepNumber);
        } else {
          this.completedSteps.splice(index, 1);
        }
      },

      toggleIngredient(index) {
        const i = this.checkedIngredients.indexOf(index);
        if (i === -1) {
          this.checkedIngredients.push(index);
        } else {
          this.checkedIngredients.splice(i, 1);
        }
      }

    },

    mounted() {
      
      this.recipeID = this.$route.params.id;      // Henter id fra url og lægger i recipeID

      // Recipe tabel
      RecipeDataService.getOne(this.recipeID).then(res => this.recipe = res.data);

      // Ingredient tabel 
      IngredientDataService.getAll()
      .then(res => this.ingredients = res.data);

      // RecipeSteps tabel
      RecipeStepsDataService.getAll(this.recipeID)
      .then(res => this.steps = res.data);

      // Unit tabel
      UnitDataService.getAll()
      .then(res => this.units = res.data);

      // Junction tabel mellem recipe og ingredients
      Recipe_IngredientDataService.getByRecipeId(this.recipeID)
      .then(res => this.recipeIngredient = res.data);

      const msg = sessionStorage.getItem("recipeToast");
      if (msg) {
        toast.success(msg, {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
        sessionStorage.removeItem("recipeToast");
      }

    }

  }
  
  </script>
  
  <style scoped>

/* =============================== */
/* RECIPE LAYOUT – MOBIL FIRST     */
/* =============================== */

.recipe-layout {
  margin: 0 1.5rem;
  animation: fadeInRecipeDetail 0.45s ease;
}

.recipe-main {
  width: 100%;
}

.section-wrapper {
  margin-top: 2.5rem
}


.recipe-image {
  margin: 1.5rem 0 2rem;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 14px rgba(0,0,0,0.15);
}

.recipe-image img {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}


/* =============================== */
/* BESKRIVELSE + TID               */
/* =============================== */

.info-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-top: 1rem;
}

.info-right {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.time-wrapper {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
}

.info-left {
  grid-column: 1; /* beskrivelse under på mobil */
  margin-top: 1rem;
}


/* =============================== */
/* INGREDIENT HEADER – MOBIL       */
/* =============================== */

.ingredients-header {
    display: flex;
    align-items: flex-start;
    gap: 6rem;
    margin-bottom: 1.5rem;
  }

.ingredient-row {
  display: flex;
  margin-top: 0.5rem;
  cursor: pointer;
  transition: 0.2s ease;
}


.ingredient-row:active {
  transform: scale(0.95);
}

.ingredient-row.checked {
  opacity: 0.5;
}

.ingredient-row.checked .ingredient-name {
  text-decoration: line-through;
}

.ingredient-row:hover {
  background: rgba(218, 218, 218, 0.26);
}

.ingredient-check {
  margin-left: 0.5rem;
  color: #1f3121;
  font-weight: 700;
}

.ingredient-amount {
  width: 110px;
  font-weight: 600;
  margin-right: 1.5rem; 
}

.ingredient-name {
  flex: 1;
}


/* =============================== */
/* PORTION CONTROL – PLUS / MINUS  */
/* =============================== */

.portion-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.1rem;
}


/* Tallet i midten */
.portion-control span {
  min-width: 2rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: #2c2c2c;
}

/* Selve knapperne */
.icon-button {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #08300f;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  transition: all 0.2s ease;
}

/* Ikonet */
.icon-button i {
  font-size: 2rem;
  color: #ffffff;
}

/* Hover */
.icon-button:hover {
  background: #f27405;
  color: white;
  border-color: #f27405;
  box-shadow: 0 8px 14px rgba(242, 116, 5, 0.35);
  transform: translateY(-2px);
}

.icon-button:hover i {
  color: #ffffff;
}

/* Active / klik */
.icon-button:active {
  transform: scale(0.95);
  box-shadow: 0 4px 8px rgba(242, 116, 5, 0.35);
}


/* --------------------- */
/* STEP CARD             */
/* --------------------- */

.steps-section {
  margin-top: 2rem; 
}

.step-card {
  background: linear-gradient(140deg, #1f3121 0%, #446847 100%);
  border-radius: 18px;
  padding: 1.5rem 1.4rem;
  color: white;
  box-shadow: 0 6px 14px rgba(0,0,0,0.15);
  margin-bottom: 1.2rem; /* LUFT mellem kort */
  cursor: pointer;
  transition: 0.25s ease;
  position: relative;
}

.step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 18px rgba(0,0,0,0.25);
}

.step-card:active {
  transform: scale(0.98);
}

.steps-list {
  margin-top: 1.5rem; 
}

.step-number {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1;
  margin: 0;
  opacity: 0.9;
}

/* STEP TEKST */
.step-text {
  margin-top: 0.6rem;
  font-size: 1rem;
  line-height: 1.5;
  opacity: 0.95;
}

.step-card.completed {
  opacity: 0.55;
}

.step-card.completed .step-text {
  text-decoration: line-through;
}

.step-check {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  font-size: 1.4rem;
  color: #9cffb2;
}

.step-inner {
  display: flex;
  flex-direction: column; /* mobil default */
}



/* =============================== */
/* TABLET (600px – 991px)          */
/* =============================== */

@media (min-width: 600px) and (max-width: 991px) {

  .ingredients-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .recipe-layout {
    display: grid;
    margin-left: 3rem;
    margin-right: 3rem;
    margin-top: 3rem;
  }

  .recipe-image img {
    min-height: 280px;
    height: 100%;
  }

  .ingredient-amount {
    width: 110px;
    font-weight: 600;
    margin-right: 3rem; 
  }

  .step-inner {
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
  }

  .step-number {
    min-width: 60px;
    text-align: right;
    margin-top: 0;
  }

  .step-text {
    margin-top: 0;
  }

  .step-card {
    padding: 1.5rem 3rem 1.5rem 1.4rem; 
  }

}

@media (min-width: 992px) and (max-width: 1399px) {

  .ingredients-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .recipe-layout {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  /* Hoved-grid: 2 kolonner */
  .recipe-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 4rem;
    row-gap: 5rem;
  }

  /* ---------- RÆKKE 1 ---------- */

  /* Tid + beskrivelse */
  .info-grid {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .info-left {
    margin-top: 0;
  }

  /* Billede */
  .recipe-image {
    grid-column: 2;
    grid-row: 1;
    margin: 0;
  }

  .recipe-image img {
    height: 100%;
    min-height: 320px;
  }

  /* ---------- RÆKKE 2 ---------- */

  .ingredients-section {
    grid-column: 1;
    grid-row: 2;
    margin-top: 0;
  }

  .steps-section {
    grid-column: 2;
    grid-row: 2;
    margin-top: 0;
  }

  .ingredient-amount {
    width: 110px;
    font-weight: 600;
    margin-right: 4rem; 
  }

  .step-inner {
    flex-direction: row; 
    align-items: flex-start;
    gap: 1.5rem;
  }

  .step-number {
    min-width: 60px;
    text-align: right;
    margin-top: 0;
  }

  .step-text {
    margin-top: 0;
  }

  .step-card {
    padding: 1.5rem 3rem 1.5rem 1.4rem; 
  }
}



/* ------------------------------- */
/*        DESKTOP (≥1400px)        */
/* ------------------------------- */

@media (min-width: 1400px) {

  .ingredients-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1.5rem;
  }

  .recipe-layout {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  /* Hoved-grid: stadig 2 kolonner */
  .recipe-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 5rem;      /* lidt mere luft horisontalt */
    row-gap: 6rem;         /* lidt mere vertikalt */
  }

  /* ---------- RÆKKE 1 ---------- */

  /* Tid + beskrivelse */
  .info-grid {
    grid-column: 1;
    grid-row: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .info-left {
    margin-top: 0;
  }

  /* Billede */
  .recipe-image {
    grid-column: 2;
    grid-row: 1;
    margin: 0;
  }

  .recipe-image img {
    height: 100%;
    min-height: 360px;     /* større billede på store skærme */
  }

  /* ---------- RÆKKE 2 ---------- */



  .ingredients-section {
    grid-column: 1;
    grid-row: 2;
    margin-top: 0;
  }

  .steps-section {
    grid-column: 2;
    grid-row: 2;
    margin-top: 0;
  }

  .ingredient-amount {
    width: 110px;
    font-weight: 600;
    margin-right: 4rem; 
  }

  .step-inner {
    flex-direction: row;        
    align-items: flex-start;
    gap: 1.5rem;
  }

  .step-number {
    min-width: 60px;
    text-align: right;
    margin-top: 0;
  }

  .step-text {
    margin-top: 0;
  }

  .step-card {
    padding: 1.5rem 3rem 1.5rem 1.4rem; 
  }

}

@media (min-width: 1800px) {
  .recipe-layout {
    max-width: 80%;
    margin-top: 5rem;
  }

  .step-inner {
    flex-direction: row;       
    align-items: flex-start;
    gap: 1.5rem;
  }

  .step-number {
    min-width: 60px;
    text-align: right;
    margin-top: 0;
  }

  .step-text {
    margin-top: 0;
    
  }

  .step-card {
    padding: 1.5rem 3.2rem 1.5rem 1.4rem; 
  }
}




@keyframes fadeInRecipeDetail {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}



.dark-mode h3 {
  color: #ffffff;
}

.dark-mode .recipe-image {
  box-shadow: 0 12px 20px rgba(0,0,0,0.6);
  filter: brightness(0.65);
}

.dark-mode .info-left p,
.dark-mode .ingredient-name {
  color: #f3f4f6;
}

.dark-mode .ingredient-amount {
  color: #f3f4f6;
}

.dark-mode .ingredient-row:hover {
  background: rgba(255,255,255,0.05);
}

.dark-mode .step-card {
  box-shadow: 0 8px 18px rgba(0,0,0,0.7);
}

.dark-mode .time-wrapper {
  color: #f3f4f6;
}

.dark-mode .time-wrapper i {
  color: #f3f4f6;
}

.dark-mode .ingredient-row.checked {
  opacity: 0.45;
}

.dark-mode .ingredient-row.checked .ingredient-name {
  text-decoration: line-through;
  color: #f3f4f6;
}

.dark-mode .ingredient-check {
  color: #9cffb2;
}

.dark-mode .portion-control span {
  color: #ffffff;
}

.dark-mode .icon-button {
  border: 2px solid;
  border-color: rgb(52, 97, 56);
}

.dark-mode .icon-button:hover {
  border: 2px solid;
  border-color: #f27405;
}

</style>
  
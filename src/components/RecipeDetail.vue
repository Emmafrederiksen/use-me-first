<template>
    <section class="recipe-header-card">
      <div class="card recipe-card">
       <img
      class="card-img"
      :src="recipe.image ? require(`@/assets/${recipe.image}`) : ''"
      :alt="recipe.title"
    />
        <div class="card-img-overlay d-flex flex-column justify-content-end">
          <button class="icon-top d-flex justify-content-end border-0 bg-transparent p-0" @click="$router.back()">
            <i class="bi bi-arrow-left-circle fs-1 mx-2"></i>
          </button>

          <div 
            v-if="isAdmin" 
            class="admin-action-buttons d-flex gap-3 position-absolute"
          >
            <button class="admin-btn-edit" @click="editRecipe">
              <i class="bi bi-pencil"></i>
            </button>

            <button class="admin-btn-delete" @click="showDeleteRecipeModal = true">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
          

          <h1 class="mx-2"> {{ recipe.title }}</h1>
        </div>
      </div>
    </section>

    <div class="time mt-4 mx-4 d-flex justify-content-end">
      <div class="time-pill d-flex align-items-center py-1 rounded-4">
        <i class="bi bi-clock me-2"></i>
        <span>{{ recipe.totalTime }}</span>
      </div>
    </div>


    <div class="mx-4 mt-4">
        <h3>Beskrivelse</h3>
        <p>{{ recipe.description }}</p>
    </div>

    <div class="mx-4 mt-5">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h3>Ingredienser</h3>
          
          <div class="portion-wrapper d-flex flex-column align-items-center">
  
          <p class="mb-1 fw-semibold">Antal</p> <!-- Labelen -->

          <div class="portion-control d-flex align-items-center gap-2">
            <i class="bi bi-dash-square fs-1 mx-1" @click="decreasePortion"></i>
            <p class="mb-0 mx-1">{{ portion }}</p>
            <i class="bi bi-plus-square fs-1 mx-1" @click="increasePortion"></i>
          </div>
    </div>

        </div>  
    
        <div class="ingredient-row" 
          v-for="(ing, index) in displayIngredients" 
          :key="index">

            <p class="ingredient-amount mt-2"> 
              {{ ing.amount == null ? '' : ing.amount * portion }} {{ ing.unitName }} </p>

            <p class="ingredient-name mt-2"> 
              {{ ing.ingredientName }} 
            </p>

        </div>
    </div>

    <div class="mx-4 mt-5">
        <h3 class="mb-4">Fremgangsmåde</h3>
        <div>
            <div class="col-12" v-for="(step, index) in steps" :key="index">
                <div class="card step-card">
                    <div class="card-body d-flex align-items-start gap-4">
                        <p class="step-number"> {{ step.step < 10 ? '0' + step.step : step.step }}</p>
                        <p class="step-text"> {{ step.stepDescription }}</p>
                    </div>
                </div>
            </div>
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
  import { toast } from 'vue3-toastify';
  import 'vue3-toastify/dist/index.css';


  
  export default {

    name: 'RecipeDetail',

    components: {
        ConfirmDeleteRecipeModal
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
      
    }

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

.admin-action-buttons {
  top: 40px;
  right: 20px;
  z-index: 10;
}

.admin-btn-edit {
  background: #ffffff;
  color: #08300f;        
  border: 2px solid #08300f;
  border-radius: 35%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 10px rgba(0,0,0,0.15);
}

.admin-btn-edit i {
  font-size: 18px;
}

.admin-btn-delete {
  background: #ffffff;
  color: #ed1919;       
  border: 2px solid #ed1919;
  border-radius: 35%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 10px rgba(0,0,0,0.15);
}

.admin-btn-delete i {
  font-size: 18px;
}

  </style>
  
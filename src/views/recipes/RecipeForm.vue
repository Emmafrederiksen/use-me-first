<template>
  <HeaderCard
    :showBack="true"
    :titleOverride="recipeTitle"
    @open-menu="openMenu"
  />

  <div class="recipeform-wrapper">
    <form @submit.prevent="submitRecipe" class="recipeform-grid">

      <!-- Titel -->
      <div class="form-section title-section">
        <label for="title" class="form-label">Titel</label>
        <input type="text" id="title" class="form-control" placeholder="Tilføj titel..." ref="title" />
      </div>

      <!-- Billede -->
      <div class="form-section image-section">
        <label for="formFile" class="form-label">Billede</label>
        <input type="file" id="formFile" class="form-control" />
      </div>

      <!-- Tid -->
      <div class="form-section time-section">
        <label class="form-label">Tid i alt</label>
        <input type="text" id="totalTime" class="form-control" placeholder="Tilføj tid..." ref="totalTime" />
      </div>

      <!-- Beskrivelse -->
      <div class="form-section description-section">
        <label class="form-label">Beskrivelse</label>
        <textarea
          id="description"
          class="form-control auto-grow"
          rows="3"
          placeholder="Tilføj beskrivelse..."
          @input="autoGrow($event)"
          ref="description"
        ></textarea>
      </div>

      <!-- Ingredienser -->
      <div class="form-section ingredients-section">
        <label class="form-label">Ingredienser</label>

        <div v-for="(ingredient, index) in ingredients" :key="index" class="ingredient-card">

          <div class="ingredient-header">
            <span>Ingrediens {{ index + 1 }}</span>
            <button v-if="ingredients.length > 1" type="button" class="btn-delete" @click="removeIngredient(index)" :aria-label="`Slet ingrediens ${index + 1}`">
              <i class="bi bi-trash3" aria-hidden="true"></i>
            </button>
          </div>

          <input
            type="text"
            class="form-control mb-2"
            v-model="ingredient.name"
            placeholder="Tilføj navn..."
          />

          <div class="ingredient-row">
            <div>
              <label class="form-label">Mængde</label>
              <input type="number" v-model="ingredient.amount" class="form-control" placeholder="Indtast antal..." />
            </div>

            <div>
              <label class="form-label">Enhed</label>
              <select v-model="ingredient.unit" class="form-select">
                <option disabled value="">Vælg enhed</option>
                <option v-for="unit in units" :key="unit.unitID" :value="unit.name">
                  {{ unit.name }}
                </option>
              </select>
            </div>
          </div>

        </div>

        <div class="add-small-wrapper">
          <button type="button" class="btn add-small" @click="addIngredient">
            <i class="bi bi-plus-circle" aria-hidden="true"></i> Tilføj ingrediens
          </button>
        </div>
      </div>

      <!-- Steps -->
      <div class="form-section steps-section">
        <label class="form-label">Fremgangsmåde</label>

        <div v-for="(step, index) in steps" :key="index" class="step-card">

          <div class="step-header">
            <span>Trin {{ index + 1 }}</span>
            <button v-if="steps.length > 1" type="button" class="btn-delete" @click="removeStep(index)" :aria-label="`Slet trin ${index + 1}`">
              <i class="bi bi-trash3"></i>
            </button>
          </div>

          <textarea
            v-model="step.description"
            class="form-control auto-grow"
            placeholder="Tilføj beskrivelse..."
            @input="autoGrow($event)"
          ></textarea>

        </div>

        <div class="add-small-wrapper">
          <button type="button" class="btn add-small" @click="addStep">
            <i class="bi bi-plus-circle" aria-hidden="true"></i> Tilføj trin
          </button>
        </div>
      </div>

      <!-- SUBMIT KNAP (ligger i grid) -->
      <div class="submit-wrapper">
        <button type="submit" class="add-btn">
          <i class="bi bi-check2-circle me-2" aria-hidden="true"></i>
          {{ submitButtonText }}
        </button>
      </div>

    </form>
  </div>

  <AdminLoginModal
    v-if="showAdminLogin"
    :visible="showAdminLogin"
    @close="showAdminLogin = false"
    @login-success="handleAdminLoginSuccess"
  />
</template>



<script>

import UnitDataService from '@/services/UnitDataService';
import HeaderCard from "../../components/cards/HeaderCard.vue";
import RecipeDataService from '@/services/RecipeDataService';
import IngredientDataService from '@/services/IngredientDataService';
import RecipeStepsDataService from '@/services/RecipeStepsDataService';
import Recipe_IngredientDataService from '@/services/Recipe_IngredientDataService';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


export default {

  name: "RecipeForm",

  components: {
    HeaderCard,
  },

  props: {
    openMenu: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {

      recipeID: null,

      isEdit: false,

      ingredients: [
        { name: "", amount: null, unit: "" } 
      ],

      steps: [
        { description: "" } 
      ],

      units: [],

      existingRecipeIngredients: [], // de gamle rækker fra recipe_ingredient

      existingSteps: [],             // de gamle steps fra backend

    };
  },

  methods: {

    addIngredient() {
        this.ingredients.push({ name: "", amount: null, unit: "" });
    },
    removeIngredient(index) {
        this.ingredients.splice(index, 1);
    },
    addStep() {
        this.steps.push({ description: "" });
    },
    removeStep(index) {
        this.steps.splice(index, 1);
    },
    autoGrow(event) {
        const textarea = event.target;
        textarea.style.height = "auto";        // nulstil højde
        textarea.style.height = textarea.scrollHeight + "px"; // sæt ny højde
    },


    async submitRecipe() {
      try {
        if (this.isEdit) {
          await this.updateRecipe();
        } else {
          await this.createRecipe();
        }
      } catch (error) {
        console.error(error);
        toast.error("Noget gik galt ved gem af opskrift.", {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
      }
    },

    async createRecipe() {
      
      // Opret opskrift først
      const newRecipeData = {
        title: this.$refs.title.value,
        description: this.$refs.description.value,
        totalTime: this.$refs.totalTime.value,
        image: 'default-recipe.jpg',
      };

      const recipeResponse = await RecipeDataService.create(newRecipeData);
      const recipeID = recipeResponse.data.recipeID;

      // Opret ingredienser og recipe_ingredient
      for (const ing of this.ingredients) {
        const unitID = ing.unit && ing.unit.trim() !== "" 
          ? (this.units.find(u => u.name.trim().toLowerCase() === ing.unit.trim().toLowerCase())?.unitID ?? null) 
          : null;

        const ingredientResponse = await IngredientDataService.create({
          name: ing.name,
        });
        const ingredientID = ingredientResponse.data.ingredientID;

        await Recipe_IngredientDataService.create({
          recipeID: recipeID,
          ingredientID: ingredientID,
          amount: ing.amount,
          unitID: unitID,
        });
      }

      // Opret steps
      for (const [index, step] of this.steps.entries()) {
        await RecipeStepsDataService.create({
          recipeID: recipeID,
          step: index + 1,
          stepDescription: step.description,
        });
      }

      // Gem besked til AllRecipes
      sessionStorage.setItem("recipeToast", "Opskriften er oprettet!");

      this.$router.push("/opskrifter");
    },


    async updateRecipe() {

    // Opdater selve opskriften
    const updateData = {
      title: this.$refs.title.value,
      description: this.$refs.description.value,
      totalTime: this.$refs.totalTime.value,
      image: null,
    };

    await RecipeDataService.update(this.recipeID, updateData);

    // Slet ALLE gamle recipe_ingredient-rækker for denne opskrift
    for (const ri of this.existingRecipeIngredients) {
      await Recipe_IngredientDataService.delete(this.recipeID, ri.ingredientID);
    }

    // Slet ALLE gamle steps
    for (const s of this.existingSteps) {
      await RecipeStepsDataService.delete(this.recipeID, s.step);
    }

    // Opret ingredienser og recipe_ingredient igen ud fra formen
    for (const ing of this.ingredients) {
      const unitID = ing.unit && ing.unit.trim() !== "" 
        ? (this.units.find(u => u.name.trim().toLowerCase() === ing.unit.trim().toLowerCase())?.unitID ?? null)
        : null;

      const ingredientResponse = await IngredientDataService.create({
        name: ing.name,
      });
      const ingredientID = ingredientResponse.data.ingredientID;

      await Recipe_IngredientDataService.create({
        recipeID: this.recipeID,
        ingredientID: ingredientID,
        amount: ing.amount,
        unitID: unitID,
      });
    }

    // Opret steps igen ud fra formen
    for (const [index, step] of this.steps.entries()) {
      await RecipeStepsDataService.create({
        recipeID: this.recipeID,
        step: index + 1,
        stepDescription: step.description,
      });
    }

     sessionStorage.setItem("recipeToast", "Opskriften er opdateret!");
     sessionStorage.setItem("fromEdit", "1");

     // Navigér tilbage til opskriften og vis toast
      this.$router.push(`/opskrift/${this.recipeID}`);

  }


  },

  computed: {

    recipeTitle() {
      return this.isEdit ? "Rediger opskrift" : "Tilføj opskrift";
    },

    submitButtonText() {
      return this.isEdit ? "Gem ændringer" : "Tilføj opskrift";
    },

  },


  mounted() {

  // Hent enheder (units) først
  UnitDataService.getAll().then(response => {
    this.units = response.data;

    // Tjek om vi er i REDIGER-tilstand (har id i URL)
    this.recipeID = this.$route.params.id || null;
    this.isEdit = !!this.recipeID;

    if (this.isEdit) {
      // Hent selve opskriften
      RecipeDataService.getOne(this.recipeID).then(res => {
        const r = res.data;
        if (this.$refs.title) this.$refs.title.value = r.title || "";
        if (this.$refs.totalTime) this.$refs.totalTime.value = r.totalTime || "";
        if (this.$refs.description) this.$refs.description.value = r.description || "";
      });

      // Steps
      RecipeStepsDataService.getAll(this.recipeID).then(res => {
        this.existingSteps = res.data; // gem de originale steps (med step-nummer)
        this.steps = res.data.map(s => ({
          description: s.stepDescription || "",
        }));
      });

      // Ingredienser + junction
      Promise.all([
        IngredientDataService.getAll(),
        Recipe_IngredientDataService.getByRecipeId(this.recipeID),
      ]).then(([ingRes, riRes]) => {
        const allIngredients = ingRes.data;
        const recipeIngredients = riRes.data;

        this.existingRecipeIngredients = recipeIngredients; // gem junction-rækkerne

        this.ingredients = recipeIngredients.map(ri => {
          const ingredient = allIngredients.find(i => i.ingredientID === ri.ingredientID);
          const unit = this.units.find(u => u.unitID === ri.unitID);

          return {
            name: ingredient ? ingredient.name : "",
            amount: ri.amount,
            unit: unit ? unit.name : "",
          };
        });
      });

    }
  });
},


};
</script>

<style scoped>

/* ============================================================
   WRAPPER
   ============================================================ */

.recipeform-wrapper {
  margin: 3rem 1.5rem;
  display: grid;
  gap: 2.2rem;
}

/* Sektion spacing */
.form-section {
  margin-bottom: 2.2rem;
  width: 100%;
}

/* ============================================================
   LABELS
   ============================================================ */

.form-label {
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 1.125rem; /* = 18px */
  color: #2c2c2c;
}

/* ============================================================
   INPUT, SELECT & TEXTAREA — BASE (samme som EditModal)
   ============================================================ */

.form-control,
.form-select,
textarea {
  width: 100%;
  padding: 10px 14px;
  font-size: 1rem;
  background: #fff;
  border-radius: 14px;
  border: 1.8px solid #dadada;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
  resize: none; /* textarea må ikke hånd-resizes */
  overflow: hidden; /* auto-grow virker stadig */
}

/* Hover-effekt */
.form-control:hover,
.form-select:hover,
textarea:hover {
  border-color: #678a69;
}

/* Fokus — grøn highlight + halo */
.form-control:focus,
.form-select:focus,
textarea:focus {
  border-color: #678a69;
  box-shadow: 0 0 0 2px rgba(8, 48, 15, 0.15);
  outline: none;
  background-color: #ffffff;
  
}

/* ============================================================
   SELECT — CUSTOM DROPDOWN PIL
   ============================================================ */

.form-select {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L8 9L15 1' stroke='%2308300F' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

/* ============================================================
   INGREDIENS- & STEP-KORT
   ============================================================ */

.ingredient-card,
.step-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 10px 14px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 1.125rem; /* = 18px */
}

.ingredient-header,
.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: .6rem;
}

.ingredient-row {
  display: flex;
  gap: 12px;
  margin-top: 1.125rem;
}

.ingredient-row > div {
  flex: 1;
}

/* Slet-knappen */
.btn-delete {
  background: transparent;
  border: none;
  color: #e02424;
  font-size: 1.2rem;
}

/* ============================================================
   "Tilføj ingrediens" / "Tilføj trin" buttons
   ============================================================ */

.add-small-wrapper {
  display: flex;
  justify-content: flex-end; /* flytter knapperne til højre */
  
}

.add-small {
  background: #08300f;
  color: white;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.9rem;
  transition: .2s ease;
  border: none;
  box-shadow: 0 8px 14px rgba(0,0,0,0.3);
}

.add-small:hover {
  background: #08300f;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(8,48,15,0.25);
  filter: brightness(1.05);
}

/* ============================================================
   SUBMIT-KNAP (samme som orange knapper)
   ============================================================ */

.submit-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 3rem;
}

.add-btn {
  background: #F27405;
  color: white;
  font-weight: 600;
  padding: 12px 22px;
  border: none;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.05rem;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);
  transition: 0.25s ease;
}

.add-btn:hover {
  background: #f27405;
  color: white;
  border-color: #f27405;
  box-shadow: 0 8px 14px rgba(242, 116, 5, 0.35);
  transform: translateY(-2px);
}

.add-btn:active {
  transform: scale(0.95);
  box-shadow: none;
}

.add-btn i {
  font-size: 1.25rem;
}

/* ============================================================
   RESPONSIVE BREAKPOINTS
   ============================================================ */

/* TABLET (600–991px) */
@media (min-width: 600px) and (max-width: 991px) {
  .recipeform-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
    margin-top: 3rem;
  }
}

/* LAPTOP (992px → 1399px) */
@media (min-width: 992px) {
  .recipeform-wrapper {
    max-width: 800px; /* du kan justere */
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  .recipeform-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.2rem 2rem;
    max-width: 800px;
  }

  /* Række 1 */
  .title-section {
    grid-column: 1; /* venstre */
  }

  .image-section {
    grid-column: 2; /* højre */
  }

  /* Række 2 */
  .time-section {
    grid-column: 1; /* venstre */
  }

  .description-section {
    grid-column: 2; /* højre */
  }

  /* Ingredienser og steps = full width */
  .ingredients-section,
  .steps-section {
    grid-column: 1 / 3;
  }

  /* Submit-knap = højre kolonne */
  .submit-wrapper {
    grid-column: 2;
    justify-content: flex-end;
    margin-top: 0rem;
  }
}

/* DESKTOP (1400px+) */
@media (min-width: 1400px) {
  .recipeform-wrapper {
    max-width: 85%;
    margin-top: 4rem;
  }

  .recipeform-grid {
    max-width: 100%;
  }
}

/* ULTRAWIDE (1800px+) */
@media (min-width: 1800px) {
  .recipeform-wrapper {
    max-width: 80%;
    margin-top: 5rem;
  }
}


/* ============================================================
   DARK MODE
   ============================================================ */

.dark-mode .ingredient-card,
.dark-mode .step-card {
  background: #2b2b2b;
  border: 1px solid #444;
  color: #f1f1f1;
}

/* dropdown-pilen KUN til select */
.dark-mode .form-select {
  background: #4a4a4a;
  color: #fff;
  border: 1px solid #777;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L8 9L15 1' stroke='%23ffffff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}

.dark-mode .form-control,
.dark-mode .form-select,
.dark-mode textarea {
  background-color: #4a4a4a;
  border: 1px solid #777;
  color: #fff;
}

.dark-mode .form-label {
  color: #ccc;
}

.dark-mode .form-control::placeholder,
.dark-mode .form-select::placeholder,
.dark-mode textarea::placeholder {
  color: #ccc;
}

.dark-mode .form-control:hover,
.dark-mode .form-select:hover,
.dark-mode textarea:hover {
  border-color: #8fd5a1;
}

.dark-mode .form-control:focus,
.dark-mode .form-select:focus,
.dark-mode textarea:focus {
  border-color: #8fd5a1;
  box-shadow: 0 0 0 3px rgba(143,213,161,0.25);
}

.dark-mode .add-small {
  background: #0f4c1d;
  color: #fff;
}

.dark-mode .add-small:hover {
  background: #136829;
  color: #fff;
  box-shadow: 0 8px 14px rgba(19,104,41,0.25);

}

.dark-mode .add-btn {
  background: #F27405;
  color: white;
  box-shadow: 0 8px 14px rgba(0,0,0,0.3);
}

.add-btn:hover {
  background: #f27405;
  color: white;
  border-color: #f27405;
  box-shadow: 0 8px 14px rgba(242, 116, 5, 0.35);
  transform: translateY(-2px);
}



</style>
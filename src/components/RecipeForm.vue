<template>
  <HeaderCard :showBack="true" :titleOverride="recipeTitle" />
  <div class="mx-4 mt-4">
    <form @submit.prevent="submitRecipe">
      
        <label for="title" class="form-label fw-bold">Titel</label>
        <input type="text" id="title" name="title" placeholder="Tilføj titel..." class="mb-3 form-control" ref="title" />
      
      
        <label for="formFile" class="form-label mt-4 fw-bold">Billede</label>
        <input class="mb-3 form-control" type="file" id="formFile" name="image"/>

        <label for="totalTime" class="form-label mt-4 fw-bold">Tid i alt</label>
        <input type="text" id="totalTime" class="mb-3 form-control" name="totalTime" placeholder="Tilføj tid..." ref="totalTime" />

        <label for="desciption" class="form-label mt-4 fw-bold">Beskrivelse</label>
        <textarea id="description" class="mb-3 form-control auto-grow" name="description" rows="3" placeholder="Tilføj beskrivelse..." @input="autoGrow($event)" ref="description"></textarea>

        <label class="mb-3 fw-bold mt-4">Ingredienser</label>
        <br />

         <!-- INGREDIENT LIST -->
      <div v-for="(ingredient, index) in ingredients" :key="index" class="mb-3">

        <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label m-0">Ingrediens navn</label>

            <button
                v-if="ingredients.length > 1"
                type="button"
                class="btn btn-sm"
                @click="removeIngredient(index)"
            >
            <i class="bi bi-trash3 text-danger fs-4"></i>
            </button>
        </div>

        <input
            type="text"
            class="form-control mb-2"
            v-model="ingredient.name"
            placeholder="Tilføj navn..."
        />

        <div class="d-flex align-items-center gap-3">
          <div style="width: 40%;">
            <label class="form-label m-0">Mængde</label>
            <input type="number"
                   class="form-control"
                   v-model="ingredient.amount"
                   placeholder="Indtast antal" />
          </div>

          <div style="width: 60%;">
            <label class="form-label m-0">Enhed</label>
            <select class="form-select"
                v-model="ingredient.unit">
                <option disabled value="">Vælg enhed</option>
                <option 
                    v-for="unit in units" 
                    :key="unit.id" 
                    :value="unit.name"
                >
                    {{ unit.name }}
                </option>
            </select>
          </div>
        </div>
      </div>

        <div class="d-flex justify-content-end"> 
            <button type="button" class="btn btn-add-ing" @click="addIngredient">
                <i class="bi bi-plus-circle me-1"></i>
                Tilføj ingrediens
            </button>
        </div>

        <label class="mb-3 fw-bold mt-4">Fremgangsmåde</label>
        <br />

    <div v-for="(step, index) in steps" :key="index" class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-1">
            <label class="form-label m-0">Trin {{ index + 1 }}</label>

            <button
            v-if="steps.length > 1"
            type="button"
            class="btn btn-sm"
            @click="removeStep(index)"
            >
            <i class="bi bi-trash3 text-danger fs-4"></i>
            </button>
        </div>

        <textarea
            v-model="step.description"
            class="form-control mb-3 auto-grow"
            rows="2"
            placeholder="Tilføj beskrivelse af trin..."
            @input="autoGrow($event)"
        ></textarea>
    </div>
        <div class="d-flex justify-content-end">
            <button type="button" class="btn btn-add-ing" @click="addStep">
                <i class="bi bi-plus-circle me-1"></i>
                Tilføj trin
            </button>
        </div>
        <div class="d-flex justify-content-center mt-5">
            <button type="submit" class="btn add-btn">
                <i class="bi bi-check2-circle me-2"></i>
                Tilføj opskrift
            </button>
        </div>
    </form>
  </div>
</template>

<script>
import UnitDataService from '@/services/UnitDataService';
import HeaderCard from "./HeaderCard.vue";
import RecipeDataService from '@/services/RecipeDataService';
import IngredientDataService from '@/services/IngredientDataService';
import RecipeStepsDataService from '@/services/RecipeStepsDataService';
import Recipe_IngredientDataService from '@/services/Recipe_IngredientDataService';

export default {
  name: "RecipeForm",
  components: {
    HeaderCard,
  },
  data() {
    return {
       ingredients: [
        { name: "", amount: null, unit: "" } // start med 1 ingrediens
      ],
      steps: [
        { description: "" } // start med 1 trin
      ],
      units: [],
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
      // 1️⃣ Opret opskrift først
      const newRecipeData = {
        title: this.$refs.title.value,
        description: this.$refs.description.value,
        totalTime: this.$refs.totalTime.value,
        image: null,// evt. billede osv.
      };
      const recipeResponse = await RecipeDataService.create(newRecipeData);
      const recipeID = recipeResponse.data.recipeID;

      // 2️⃣ Opret ingredienser (kun name) og tilføj til junction table
      for (const ing of this.ingredients) {

        const unitID = ing.unit && ing.unit.trim() !== "" ? (this.units.find(u => u.name.trim().toLowerCase() === ing.unit.trim().toLowerCase())?.unitID ?? null) : null;
        console.log("Unit ID for", ing.unit, "er", unitID);

        // Opret ingrediens først
        const ingredientResponse = await IngredientDataService.create({
          name: ing.name,
        });
        const ingredientID = ingredientResponse.data.ingredientID;

        // Opret recipe_ingredient med amount og unit
        await Recipe_IngredientDataService.create({
          recipeID: recipeID,
          ingredientID: ingredientID,
          amount: ing.amount,
          unitID: unitID,
        });
      }

      // 3️⃣ Opret steps
      for (const [index, step] of this.steps.entries()) {
        await RecipeStepsDataService.create({
          recipeID: recipeID,
          step: index + 1,
          stepDescription: step.description,
        });
      }

      alert("Opskrift oprettet!");
        this.$router.push('/opskrifter');   
    } catch (error) {
      console.error(error);
      alert("Noget gik galt ved oprettelsen af opskriften.");
    }
  
    }
  },
  computed: {
    recipeTitle() {
      return this.$route?.params?.id ? "Rediger opskrift" : "Tilføj opskrift";
    },
  },
  mounted() {
    UnitDataService.getAll().then(response => {this.units = response.data;})
  },
};
</script>

<style scoped>
    textarea.form-control {
        resize: none;
    }
    .btn-add-ing {
        background: #08300f;
        color: #ffffff;
        border-radius: 999px;
        border: none;
        font-weight: 400;
        padding: 6px 18px;
        font-size: 14px;
    }
    .auto-grow {
        overflow: hidden;
        resize: none; /* brugeren må ikke ændre selv */
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
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .add-btn i {
        font-size: 16px; 
        line-height: 1;
    }
</style>
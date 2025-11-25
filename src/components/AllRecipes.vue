<template>
  <HeaderCard />

  <div class="mx-4 mt-5">
    <div class="row g-3">

      <div v-if="recipes.length === 0">
        <p>Ingen opskrifter fundet.</p>
      </div>

      <div
        v-for="recipe in recipes"
        :key="recipe.recipeID"
        class="col-6"
      >
      <router-link :to="`/opskrift/${recipe.recipeID}`" class="text-decoration-none">
        <div class="card recipe-card mb-2">
          <img
            class="card-img"
            :src="recipe.image ? require(`@/assets/${recipe.image}`) : ''"
            :alt="recipe.title"
          />
          <div class="card-img-overlay d-flex flex-column justify-content-end">
            <h3>{{ recipe.title }}</h3>
          </div>
        </div>
      </router-link>

    </div>
    </div>
 </div>
</template>


<script>
import HeaderCard from "./HeaderCard.vue";
import RecipeDataService from "@/services/RecipeDataService.js";


export default {
  name: "AllRecipes",

  data() {
    return {
      recipes: [],
    };
  },

  methods: {
    retrieveRecipes() {
      RecipeDataService.getAll()
        .then((response) => {
          this.recipes = response.data;
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },

  mounted() {
    this.retrieveRecipes();
  },

  components: {
    HeaderCard,
  },
};
</script>

<style scoped>
.recipe-card {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
}

.recipe-card .card-img {
  height: 140px;
  object-fit: cover;
  filter: brightness(70%);
}

.recipe-card .card-img-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(0, 0, 0, 0.7)
  );
  color: white;
}

.see-all-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #f27405;
  text-decoration: underline;
}

h3 {
  font-weight: 500;
  font-size: 18px;
  margin-bottom: 0px;
}
</style>

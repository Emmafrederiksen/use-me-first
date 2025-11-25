<template>
  <HeaderCard />

  <div class="mx-4 mt-5">
    <div class="row g-3">
      <div class="col-6">
        <div v-if="recipes.length === 0">
          <p>Ingen opskrifter fundet.</p>
        </div>
        <div v-else>
          <div
            v-for="recipe in recipes"
            :key="recipe.recipeID"
            class="card recipe-card"
          >
            <div class="card-img-overlay d-flex flex-column justify-content-end">
              <h3>HER</h3>
              <h3>{{ recipe.title }}</h3>
              <img :src="require(`@/assets/${recipe.image}`)" />
            </div>
          </div>
        </div>
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

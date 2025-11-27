<template>
  <HeaderCard
  :showAdminIcon="true"
  :isAdmin="isAdmin"
  :subtitle-override="adminSubtitle"
  @open-admin-login="showAdminLogin = true"
  @logout-admin="logoutAdmin"
/>

<!-- Kun for admin -->
<div v-if="isAdmin" class="text-end mx-4 mt-5">
  <router-link to="/opskrifter/tilføj" class="add-btn mt-3 text-decoration-none">
  <i class="bi bi-plus-circle me-2"></i>
    Tilføj ny opskrift
</router-link>

</div>


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
            :src="require(`@/assets/${recipe.image || 'default-recipe.jpg'}`)"
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


<!-- Admin login modal -->
  <AdminLoginModal
    v-if="showAdminLogin"
    :visible="showAdminLogin"
    @close="showAdminLogin = false"
    @login-success="handleAdminLoginSuccess"
  />

</template>


<script>
import HeaderCard from "./HeaderCard.vue";
import RecipeDataService from "@/services/RecipeDataService.js";
import AdminLoginModal from './AdminLoginModal.vue'; 
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";



export default {
  name: "AllRecipes",

  data() {
    return {
      recipes: [],
      showAdminLogin: false,
      isAdmin: localStorage.getItem('isAdmin') === "1",
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

    handleAdminLoginSuccess() {
      this.isAdmin = true;
      localStorage.setItem("isAdmin", "1");
      this.showAdminLogin = false;
    },
    
    logoutAdmin() {
      localStorage.removeItem("isAdmin");
      this.isAdmin = false;
    }

  },

  computed: {

    adminSubtitle() {
    // Når man er admin → specialtekst
    if (this.isAdmin) {
      return "Du er logget ind som admin og kan nu oprette, redigere og slette opskrifter.";
    }

    // Når man IKKE er admin → tom streng
    // så falder HeaderCard tilbage til meta.subtitle
    return "";
    }

  },

  mounted() {
    this.retrieveRecipes();

    const msg = sessionStorage.getItem("recipeToast");
      if (msg) {
        toast.success(msg, {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
        sessionStorage.removeItem("recipeToast");
    }
  },

  components: {
    HeaderCard,
    AdminLoginModal,
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

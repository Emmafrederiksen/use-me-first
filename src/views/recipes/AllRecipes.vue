<template>
  <HeaderCard
  :showAdminIcon="true"
  :isAdmin="isAdmin"
  :subtitle-override="adminSubtitle"
  @open-admin-login="showAdminLogin = true"
  @logout-admin="logoutAdmin"
  @open-menu="openMenu"
/>

<!-- Kun for admin -->
<div v-if="isAdmin" class="admin-add-wrapper">
  <router-link to="/opskrifter/tilføj" class="add-btn text-decoration-none">
    <i class="bi bi-plus-circle" aria-hidden="true"></i>
    Tilføj ny opskrift
  </router-link>
</div>

  <div class="recipes-wrapper">
    <div class="recipes-grid">

          <div v-for="recipe in recipes" :key="recipe.recipeID">
            <router-link :to="`/opskrift/${recipe.recipeID}`" class="text-decoration-none" :aria-label="`Åben opskrift ${recipe.title}`">
              <div class="recipe-card">
                <img class="card-img" :src="require(`@/assets/${recipe.image || 'default-recipe.jpg'}`)" :alt="recipe.title"/>
                  <h3 class="recipe-title">{{ recipe.title }}</h3>
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

import HeaderCard from "../../components/cards/HeaderCard.vue";
import RecipeDataService from "@/services/RecipeDataService.js";
import AdminLoginModal from '../../components/modals/AdminLoginModal'; 
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

  props: {
    openMenu: {
      type: Function,
      required: true,
    },
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




/* -------------------------------- */
/* Base styling (mobil som standard) */
/* -------------------------------- */

.recipes-wrapper {
  margin: 2rem 1.5rem;
}

.recipes-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr; /* to per række på mobil */
  
}

.recipe-card {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  display: block;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);

  transition: transform 0.25s ease, filter 0.25s ease, box-shadow 0.25s ease;
  animation: fadeInRecipeCard 0.45s ease;
  
}

.recipe-card:hover {
  transform: translateY(-4px);
  filter: brightness(1.05);
  box-shadow: 0 12px 20px rgba(0,0,0,0.25);
}

.recipe-card img {
  width: 100%;
  height: 170px;
  object-fit: cover;
  filter: brightness(60%);
}

.recipe-title {
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  margin: 0;
  font-size: 1rem; /* = 16px */
  color: white;
  font-weight: 600;
}

.admin-add-wrapper {
  margin: 2rem 1.5rem 0 1.5rem;
  text-align: right;
}

.add-btn {
  background: #F27405;
  color: white;
  font-weight: 600;
  padding: 10px 18px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
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



/* ------------------------------ */
/* TABLET (≥600px → 991px) */
/* ------------------------------ */

@media (min-width: 600px) and (max-width: 991px) {
  .recipes-wrapper {
    
    margin-top: 3rem;
    margin-left: 3rem;
    margin-right: 3rem;
  }
    
  .recipes-grid {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .recipe-card .card-img {
    height: 190px;
  }

  .recipe-title {
  font-size: 1.125rem; /* = 18px */
  }
  
  .admin-add-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;

}

}

/* ------------------------------ */
/* SMALL → MEDIUM LAPTOP (992px → 1399px) */
/* ------------------------------ */

@media (min-width: 992px) and (max-width: 1399px) {

  .recipes-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  .recipes-grid {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 22px;
  }

  .recipe-card .card-img {
    height: 200px;
  }

  .recipe-title {
  font-size: 1.25rem; /* = 20px */
  }

  .admin-add-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    text-align: right;
  }
}

/* ------------------------------ */
/* LARGE DESKTOP (≥1400px) */
/* ------------------------------ */

@media (min-width: 1400px) {
  .recipes-wrapper {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }

  .recipes-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 38px;
  }

  .recipe-card,
  .recipe-card img {
    height: 240px !important;
  }

  .recipe-title {
  font-size: 1.25rem; /* = 20px */
  }

  .admin-add-wrapper {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
  }
}

/* ------------------------------ */
/* ULTRA WIDE (≥1800px) */
/* ------------------------------ */

@media (min-width: 1800px) {
  .recipes-wrapper {
    max-width: 80%;
    margin-top: 5rem;
  }

  .recipe-card,
  .recipe-card img {
    height: 260px !important;
  }

  .recipes-grid {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 38px;
  }

  .admin-add-wrapper {
    max-width: 80%;
  }
}

/* ------------------------------ */
/* Fade-in animation */
/* ------------------------------ */

@keyframes fadeInRecipeCard {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}


</style>

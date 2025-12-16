<template>
  <section class="header-card">
    <div class="header-inner">

      <div class="d-flex align-items-center justify-content-between">

        <!-- Venstre side -->
        <div class="d-flex align-items-center">
          <button
            v-if="showBack"
            @click="$router.back()"
            class="back-btn me-3"
            aria-label="Gå tilbage"
          >
            <i class="bi bi-arrow-left-short" aria-hidden="true"></i>
          </button>

          <h1 class="title">{{ heading }}</h1>
        </div>

        <!-- Højre side -->
        <div class="right-controls">

  <!-- 🔹 OPSKRIFT ADMIN ACTIONS -->
  <div
    v-if="variant === 'recipe' && showRecipeActions && isAdmin"
    class="recipe-admin-actions"
  >
    <button
      class="admin-btn-edit"
      @click="$emit('edit-recipe')"
      aria-label="Rediger opskrift"
    >
      <i class="bi bi-pencil"></i>
    </button>

    <button
      class="admin-btn-delete"
      @click="$emit('delete-recipe')"
      aria-label="Slet opskrift"
    >
      <i class="bi bi-trash3"></i>
    </button>
  </div>

  <!-- 🔹 GLOBAL ADMIN LOGIN / LOGOUT -->
  <div v-if="showAdminIcon">
    <button 
      v-if="!isAdmin"
      @click="$emit('open-admin-login')"
      class="admin-icon-btn"
      aria-label="Åben admin login"
    >
      <i class="bi bi-person-lock"></i>
    </button>

    <button
      v-else
      @click="$emit('logout-admin')"
      class="admin-logout-btn"
      aria-label="Log ud som admin"
    >
      <i class="bi bi-box-arrow-right"></i>
    </button>
  </div>

  <!-- 🔹 BURGERMENU -->
  <button
    class="burger-btn d-none d-md-flex"
    @click="$emit('open-menu')"
    aria-label="Åben menu"
  >
    <i class="bi bi-list"></i>
  </button>

</div>



      </div>

      <p class="subtitle mb-0" v-html="subheading"></p>

      <!-- Dark mode toggle -->
        <div class="toggle-right">
            <div class="dark-toggle" @click="toggleDarkMode">
              <i v-if="darkMode" class="bi bi-moon-fill"></i>
              <i v-else class="bi bi-brightness-high-fill"></i>

              <div class="toggle-switch">
                <div class="knob" :class="{ active: darkMode }"></div>
              </div>
            </div>
          </div>

    </div>
  </section>
</template>


<script>
export default {
  name: "HeaderCard",

  props: {

    titleOverride: { type: String, default: "" },

    subtitleOverride: { type: String, default: "" },

    showBack: { type: Boolean, default: false },

    showAdminIcon: { type: Boolean, default: false },

    isAdmin: { type: Boolean, default: false },

    variant: { type: String, default: "default" }, // "default" | "recipe"
    recipeImage: { type: String, default: "" },
    showRecipeActions: { type: Boolean, default: false }


  },
  data() {
    return {
      darkMode: false,
    };
  },

  computed: {
    heading() {
      return (
        this.titleOverride || this.$route?.params?.name || this.$route?.meta?.title || ""
      );
    },
    subheading() {
      return this.subtitleOverride || this.$route?.meta?.subtitle || "";
    },
  },

  mounted() {
    // Dark mode persistent
    if (localStorage.getItem("darkModeEnabled") === "1") {
      this.darkMode = true;
      document.body.classList.add("dark-mode");
    }
  },

  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode;

      if (this.darkMode) {
        document.body.classList.add("dark-mode");
        localStorage.setItem("darkModeEnabled", "1");
      } else {
        document.body.classList.remove("dark-mode");
        localStorage.removeItem("darkModeEnabled");
      }
    }
  }
};

</script>

<style scoped>

/* -------------------------------------- */
/*             BASE HEADER STYLE          */
/* -------------------------------------- */

.header-card {
  background: linear-gradient(140deg, #1f3121 0%, #446847 100%);
  width: 100%;
  color: white;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.1);
  padding: 2.5rem 0;
}

/* -------------------------------------- */
/*                TYPOGRAFI               */
/* -------------------------------------- */

.title {
  font-size: 1.5rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1rem;
  margin-top: 0.5rem;
  opacity: 0.95;
}

/* -------------------------------------- */
/*                KNAPPER                 */
/* -------------------------------------- */

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(6px);
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;

  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  cursor: pointer;
  transition: 0.25s ease;
}

.back-btn i {
  font-size: 1.9rem;
  color: #ffffff;
}

/* Hover som på dashboard */
.back-btn:hover {
  background: #f27405;
  color: white;
  border-color: #f27405;
  box-shadow: 0 8px 14px rgba(242, 116, 5, 0.35);
  transform: translateY(-2px);
}

.back-btn:active {
  transform: scale(0.95);
  box-shadow: none;
}

.admin-icon-btn,
.admin-logout-btn {
  background: #fff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.30);
}

.admin-icon-btn i {
  color: #f27405;
  font-size: 1.4rem;
}

.admin-icon-btn:hover {
  background: #f27405;
  color: white;
  border-color: #f27405;
  box-shadow: 0 8px 14px rgba(242, 116, 5, 0.35);
  transform: translateY(-2px);
}

.admin-icon-btn:active {
  transform: scale(0.95);
  box-shadow: none;
}

.admin-icon-btn:hover i {
  color: white;
  transform: translateY(-2px);
}

.admin-logout-btn i {
  color: #b00000;
  font-size: 1.4rem;
}

.recipe-admin-actions {
  display: flex;
  gap: 0.6rem;
}

.recipe-admin-actions .admin-btn-edit,
.recipe-admin-actions .admin-btn-delete {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.admin-btn-edit {
  background: #ffffff;
  color: #08300f;
  border: 2.5px solid #041a09;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 10px rgba(0,0,0,0.15);
  transition: 0.25s ease;
}

.admin-btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(21, 128, 41, 0.25);
  filter: brightness(1.05);
}

.admin-btn-delete {
  background: #ffffff;
  color: #ed1919;
  border: 2px solid #ed1919;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 10px rgba(0,0,0,0.15);
  transition: 0.25s ease;
}

.admin-btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(237, 25, 25, 0.25);
  filter: brightness(1.05);
}

.recipe-admin-actions button:active {
.admin-logout-btn:hover {
  background: #b00000;
  color: white;
  border-color: #b00000;
  box-shadow: 0 8px 14px rgba(176, 0, 0, 0.35);
  transform: translateY(-2px);
}

.admin-logout-btn:active {
  transform: scale(0.95);
  box-shadow: none;
}

/* -------------------------------------- */
/*         RESPONSIVT LAYOUT WRAPPER      */
/* -------------------------------------- */

.header-inner {
  width: 100%;
  padding-left: 1.5rem; /* Mobil spacing */
  padding-right: 1.5rem; 
  padding-top: 2rem;
}

/* -------------------------------------- */
/* TABLET (≥ 600px)                       */
/* -------------------------------------- */
@media (min-width: 600px) {
  .header-inner {
    padding-left: 3rem;
    padding-right: 3rem;
    padding-top: 3rem;
  }

  .title {
    font-size: 2rem; /* = 32px */
  }

  .subtitle {
    font-size: 1.375rem; /* = 22px */
    
  }
}

/* -------------------------------------- */
/* LAPTOP (992px → 1399px)                */
/* -------------------------------------- */
@media (min-width: 992px) and (max-width: 1399px) {
  .header-inner {
    max-width: 800px;
    padding-left: 0%;
    padding-right: 0%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 3rem;
  }

  .title {
    font-size: 2.250rem; /* = 36px */
  }

  .subtitle {
    font-size: 1.375rem; /* = 22px */
  }
}

/* -------------------------------------- */
/* DESKTOP XL (≥ 1400px → 1799px)         */
/* -------------------------------------- */
@media (min-width: 1400px) and (max-width: 1799px) {
  .header-inner {
    max-width: 85%;
    padding-left: 0%;
    padding-right: 0%;
    margin: 0 auto;
    padding-top: 3rem;
  }

  .title {
    font-size: 2.25rem; /* = 36px */
  }

  .subtitle {
    font-size: 1.250rem; /* = 20px */
  }
}

/* -------------------------------------- */
/* ULTRA-WIDE (≥ 1800px)                  */
/* -------------------------------------- */
@media (min-width: 1800px) {
  .header-inner {
    max-width: 80%;
    padding-left: 0%;
    padding-right: 0%;
    margin: 0 auto;
    padding-top: 3rem;
  }

  .title {
    font-size: 2.25rem; /* = 36px */
  }

  .subtitle {
    font-size: 1.250rem; /* = 20px */
  }
}

.right-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem; 
  margin-left: auto;
}



.burger-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.3rem;
  transition: 0.25s ease;
}

.burger-btn:hover {
  opacity: 0.8;
}

@media (max-width: 767px) {
  .burger-btn {
    display: none !important;
  }
}

/* Desktop XL (≥ 1400px) — større burgerikon */
@media (min-width: 1400px) {
  .burger-btn {
    font-size: 2.6rem; 
  }
}

/* Ultra-wide (≥ 1800px) — endnu større */
@media (min-width: 1800px) {
  .burger-btn {
    font-size: 3rem; 
  }
}

/* -------------------------------------- */
/*       CUSTOM DARK MODE TOGGLE          */
/* -------------------------------------- */

.dark-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.dark-toggle i {
  font-size: 1.7rem;
  color: #ffffff;
  transition: 0.25s ease;
}

/* Switch base */
.toggle-switch {
  width: 44px;
  height: 22px;
  background: rgba(255,255,255,0.4);
  border-radius: 20px;
  position: relative;
  transition: 0.3s ease;
}

/* Knappen */
.knob {
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: 0.3s ease;
}

/* Når dark-mode er aktiv */
.knob.active {
  transform: translateX(22px);
}

/* DARK MODE STYLING */
.dark-mode .toggle-switch {
  background: rgba(0,0,0,0.5);
}

.dark-mode .knob {
  background: #ffa349;
}

.dark-mode .dark-toggle i {
  color: #ffa349;
}

.dark-toggle {
  margin-left: auto;
}

.toggle-right {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px; /* valgfrit */
}
</style>

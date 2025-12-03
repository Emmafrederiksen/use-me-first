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
          >
            <i class="bi bi-arrow-left-circle fs-1 text-white"></i>
          </button>

          <h1 class="title mb-1">{{ heading }}</h1>
        </div>

        <!-- Højre side -->
        <div class="right-controls">

          <!-- Admin ikoner -->
          <div v-if="showAdminIcon" class="me-3">
            <button v-if="!isAdmin" @click="$emit('open-admin-login')" class="admin-icon-btn">
              <i class="bi bi-person-lock"></i>
            </button>

            <button v-else @click="$emit('logout-admin')" class="admin-logout-btn">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </div>

          <!-- BURGERMENU (kun tablet/desktop) -->
          <button class="burger-btn d-none d-md-flex" @click="$emit('open-menu')">
            <i class="bi bi-list"></i>
          </button>

        </div>


      </div>

      <p class="subtitle mb-0" v-html="subheading"></p>

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

    isAdmin: { type: Boolean, default: false }

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
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  font-size: 16px;
  margin-top: 0.5rem;
  opacity: 0.95;
}

/* -------------------------------------- */
/*                KNAPPER                 */
/* -------------------------------------- */

.back-btn {
  background: transparent;
  border: none;
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

.admin-logout-btn i {
  color: #b00000;
  font-size: 1.4rem;
}

/* -------------------------------------- */
/*         RESPONSIVT LAYOUT WRAPPER      */
/* -------------------------------------- */

.header-inner {
  width: 100%;
  padding-left: 1.5rem; /* Mobil spacing */
  padding-right: 1.5rem; /* Mobil spacing */
  padding-top: 2rem;
}

/* TABLET (≥ 600px) */
@media (min-width: 600px) {
  .header-inner {
  padding-left: 3rem; /* Tablet spacing */
  padding-right: 3rem; /* Tablet spacing */
  padding-top: 3rem;
  }

  .title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 18px;
  }
}

/* LAPTOP (≥ 992px) */
@media (min-width: 992px) {
  .header-inner {
    max-width: 900px;
    margin: 0 auto;
    padding-top: 3rem;
  }

  .title {
    font-size: 38px;
  }

  .subtitle {
    font-size: 20px;
  }
}

/* DESKTOP XL (≥ 1400px) */
@media (min-width: 1400px) {
  .header-inner {
    max-width: 1100px;
    padding-top: 3rem;
  }

  .title {
    font-size: 42px;
  }

  .subtitle {
    font-size: 22px;
  }
}

.right-controls {
  display: flex;
  align-items: center;
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


</style>

<template>
  <section class="header-card pt-5 pb-5 px-4">
    <div class="d-flex align-items-center justify-content-between">

      <!-- VENSTRE SIDE: tilbagepil + titel -->
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

      <!-- HØJRE SIDE: login eller logout -->
      <div v-if="showAdminIcon">

        <!-- Login ikon -->
        <button
          v-if="!isAdmin"
          @click="$emit('open-admin-login')"
          class="admin-icon-btn"
        >
          <i class="bi bi-person-lock"></i>
        </button>

        <!-- Logout ikon -->
        <button
          v-else
          @click="$emit('logout-admin')"
          class="admin-logout-btn"
        >
          <i class="bi bi-box-arrow-right"></i>
        </button>

      </div>

    </div>

    <p class="subtitle mb-0">{{ subheading }}</p>
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
.header-card {
  background: linear-gradient(140deg, #1f3121 0%, #446847 100%);
  width: 100%;
  color: white;
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  font-size: 16px;
  margin-top: 0.5rem;
}

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
</style>

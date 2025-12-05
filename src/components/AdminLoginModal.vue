<template>
  <div v-if="visible" class="admin-modal-overlay">
    <div class="admin-modal">

      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 class="mb-1">Admin login</h3>
          <div class="admin-modal-underline"></div>
        </div>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>

      <p class="mb-4">Log ind for at administrere opskrifter.</p>

      <label class="form-label fw-semibold small">Brugernavn</label>
      <input
        v-model="username"
        class="form-control admin-input mb-3"
        placeholder="Indtast dit brugernavn..."
      />

      <label class="form-label fw-semibold small">Adgangskode</label>
      <input
        v-model="password"
        type="password"
        class="form-control admin-input mb-4"
        placeholder="Indtast din adgangskode..."
      />

      <div class="d-flex justify-content-between gap-2 mt-2">
        <button
          class="btn admin-btn-cancel flex-fill"
          @click="$emit('close')"
        >
          Annuller
        </button>

        <button
          class="btn admin-btn-login flex-fill"
          @click="handleLogin"
        >
          Log ind
        </button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "AdminLoginModal",

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      username: "",
      password: "",
    };
  },

  methods: {
    handleLogin() {
      // Her kan I senere skifte til rigtig backend-auth
      if (this.username === "admin" && this.password === "1234") {
        // Fortæl parent: det lykkedes
        this.$emit("login-success");
        // nulstil inputs
        this.username = "";
        this.password = "";
      } else {
        alert("Forkert brugernavn eller adgangskode");
      }
    },
  },
};
</script>

<style scoped>
.admin-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.admin-modal {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 20px 20px;
  width: 90%;
  max-width: 380px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.25);
}

.admin-modal-underline {
  height: 2px;
  width: 80px;
  background: #dddddd;
  margin-top: 4px;
}

.admin-input {
  border-radius: 999px;
  padding: 10px 14px;
  border: 1px solid #d0d5dd;
  font-size: 0.95rem;
}

.admin-btn-cancel {
  background: #08300f;
  color: #ffffff;
  border-radius: 999px;
  border: none;
  font-weight: 600;
}

.admin-btn-login {
  background: #f27405;
  color: #ffffff;
  border-radius: 999px;
  border: none;
  font-weight: 600;
}

.admin-btn-cancel:hover,
.admin-btn-login:hover {
  filter: brightness(0.95);
}

.dark-mode .admin-modal{
  background-color: #2c2c2c;
  color: #ffffff;
}
.dark-mode .btn-close {
  filter: invert(1);
}

.dark-mode .admin-input {
  background-color: #9c9c9c;
  border: 1px solid #444444;
}
.dark-mode .admin-btn-cancel {
  background: #444444;
}
</style>

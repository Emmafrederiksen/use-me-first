<template>
  <div v-if="visible" class="admin-overlay">

    <div class="admin-box">

      <!-- Header -->
      <div class="admin-header">
        <div class="admin-title-wrapper">
          <h3 class="admin-title">Admin login</h3>
          <div class="admin-title-underline"></div>
        </div>

        <button class="admin-close" @click="$emit('close')" aria-label="Luk admin log ind">
          <i class="bi bi-x" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Description -->
      <p class="admin-description">Log ind for at administrere opskrifter.</p>

      <!-- Input fields -->
      <label for="username" class="admin-label">Brugernavn *</label>
      <input
        id="username"
        v-model="username"
        class="admin-input mb-3"
        placeholder="Indtast dit brugernavn..."
      />

      <label for="password" class="admin-label">Adgangskode *</label>
      <input
        id="password"
        v-model="password"
        type="password"
        class="admin-input mb-4"
        placeholder="Indtast din adgangskode..."
      />

      <!-- Buttons -->
      <div class="admin-actions">
        <button class="pm-btn-cancel" @click="$emit('close')">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
          Annuller
        </button>

        <button class="pm-btn-used" @click="handleLogin">
          <i class="bi bi-check2-circle" aria-hidden="true"></i>
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

/* =============================== */
/* OVERLAY (samme blur som andre)  */
/* =============================== */
.admin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

/* =============================== */
/* MODAL BOX                       */
/* =============================== */
.admin-box {
  background: #fff;
  border-radius: 24px;
  padding: 24px 24px 32px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.22);
  position: relative;
}

/* =============================== */
/* HEADER + TITLE + CLOSE          */
/* =============================== */
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px; 
}

.admin-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.admin-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0;
  color: #000;
  line-height: 1.25; 
}


.admin-title-underline {
  height: 2px;
  width: 90px;
  background: #ddd;
  margin-top: 4px;
}

.admin-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  top: 15px;      /* løfter krydset op */
  right: 15px;    /* flytter det lidt mere ud i hjørnet */
  position: absolute;
}

/* =============================== */
/* TEXT                            */
/* =============================== */
.admin-description {
  margin: 16px 0 24px;
  font-size: 1rem;
  color: #333;
}

.admin-label {
  font-weight: 600;
  margin-bottom: 6px;
  display: block;
}

/* =============================== */
/* INPUTS (samme som EditModal)    */
/* =============================== */
.admin-input {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #d0d5dd;
  background: #fff;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  transition: 0.2s ease;
}

.admin-input:focus {
  border-color: #08300f;
  box-shadow: 0 0 0 2px rgba(8,48,15,0.15);
  outline: none;
}

/* =============================== */
/* BUTTONS (samme som pm-knapper)  */
/* =============================== */

.admin-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 20px;
}

/* Grøn outline */
.pm-btn-cancel {
  flex: 1;
  border-radius: 999px;
  border: 2px solid #08300f;
  background: white;
  color: #08300f;
  padding: 10px 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.pm-btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(8,48,15,0.25);
}

/* Orange knap */
.pm-btn-used {
  flex: 1;
  border-radius: 999px;
  background: #f27405;
  color: white;
  padding: 10px 18px;
  font-weight: 600;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.2s ease;
}

.pm-btn-used:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(242,116,5,0.25);
  filter: brightness(1.05);
}

/* Ikon-størrelser */
.pm-btn-cancel i,
.pm-btn-used i {
  font-size: 1.2rem;
}

.dark-mode .admin-box{
  background-color: #2c2c2c;
  color: #ffffff;
}
.dark-mode .admin-close {
  filter: invert(1);
}

.dark-mode .admin-input {
  background-color: #4a4a4a;
  border: 1px solid #777;
  color: #ffffff;
}
.dark-mode .pm-btn-cancel {
  background: #7c7c7c;
  color: #ffffff;
  border: 2px solid #ffffff;
}
.dark-mode .pm-btn-cancel:hover {
  box-shadow: 0 8px 14px rgba(255,255,255,0.25);
}

.dark-mode .admin-input:focus {
  border-color: #8fd5a1;
  box-shadow: 0 0 0 2px rgba(143, 213, 161, 0.15);
}

.dark-mode .admin-input:hover {
  border-color: #8fd5a1;
}

.dark-mode h3, .dark-mode .admin-description {
  color: #ffffff;
}

.dark-mode .admin-input::placeholder {
  color: #e4e4e4;
}
/* RESPONSIV */
@media (min-width: 600px) {
  .admin-box {
    max-width: 460px;
    padding: 32px 32px 40px;
  }
}

</style>

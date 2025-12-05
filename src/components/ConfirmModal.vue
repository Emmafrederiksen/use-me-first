<template>
  <div v-if="visible" class="confirm-overlay">

    <div class="confirm-box">

      <!-- HEADER -->
      <div class="confirm-header">
        <div class="confirm-title-wrapper">
          <h3 class="confirm-title">{{ productName }}</h3>
          <div class="modal-title-underline"></div>
        </div>

        <button class="confirm-close" @click="$emit('close')">
          <i class="bi bi-x"></i>
        </button>
      </div>


      <!-- BESKRIVELSE -->
      <div class="confirm-body">
        <p>{{ description }}</p>
      </div>

      <!-- KNAPPER -->
      <div class="confirm-actions">
        <button class="pm-btn-cancel" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
          Annuller
        </button>

        <button class="pm-btn-used" @click="$emit('confirm', actionType)">
          <i class="bi bi-check2-circle"></i>
          Bekræft
        </button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "ConfirmModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    productName: {
      type: String,
      required: true,
    },
    description : {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped>
/* ========================================= */
/* OVERLAY MED BLUR (samme som ProductModal) */
/* ========================================= */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000 !important; /* højere end ProductModal */
}

/* ========================================= */
/* MODAL-BOKS (samme stil som ProductModal)  */
/* ========================================= */
.confirm-box {
  background: #fff;
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  padding: 24px 22px 26px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.22);
  position: relative;
}



/* ========================================= */
/* HEADER                                     */
/* ========================================= */
.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.confirm-title {
  font-weight: 700;
  margin: 0;
  color: #000;
}

.confirm-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.modal-title-underline {
  height: 2px;
  width: 90px;
  background: #dddddd;
  margin-top: 4px;
}

.confirm-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
  top: 15px;      /* løfter krydset op */
  right: 15px;    /* flytter det lidt mere ud i hjørnet */
  position: absolute;
}

/* ========================================= */
/* BODY                                       */
/* ========================================= */
.confirm-body {
  margin-top: 18px;
  font-size: 1rem;
  color: #333;
  text-align: left;
}

/* ========================================= */
/* ACTION KNAPPER (samme stil som ProductModal) */
/* ========================================= */
.confirm-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  gap: 12px;
}

/* ANNULLER (grøn outline) */
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

/* BEKRÆFT (orange) */
.pm-btn-used {
  flex: 1;
  border-radius: 999px;
  background: #f27405;
  color: white;
  padding: 10px 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.2s ease;
  border: none;
}

.pm-btn-used:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(242,116,5,0.25);
  filter: brightness(1.05);
}

/* Ikoner større */
.pm-btn-cancel i,
.pm-btn-used i {
  font-size: 1.2rem;
}

/* ========================================= */
/* RESPONSIV                                   */
/* ========================================= */
@media (min-width: 600px) {
  .confirm-box {
    max-width: 500px;
    padding: 32px 28px;
  }
}

.dark-mode .modal-content {
  background-color: #2c2c2c;
  color: #ffffff;
}
.dark-mode .btn-cancel {
  background: #444444;
  color: #ffffff;
  border: 2px solid #ffffff;
}
.dark-mode .close-icon {
  color: #ffffff;
}
</style>
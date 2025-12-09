<template>
  <div v-if="visible" class="confirm-overlay">

    <div class="confirm-box">

      <!-- HEADER -->
      <div class="confirm-header">
        <div class="confirm-title-wrapper">
          <h3 class="confirm-title">Slet opskrift</h3>
          <div class="modal-title-underline"></div>
        </div>

        <button class="confirm-close" @click="$emit('close')" aria-label="Luk modal">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <!-- BESKRIVELSE -->
      <div class="confirm-body">
        <p>
          Er du sikker på, at du vil slette
          <strong>{{ recipeTitle }}</strong>?<br />
          Denne handling kan ikke fortrydes.
        </p>
      </div>

      <!-- KNAPPER -->
      <div class="confirm-actions">
        <button
          ref="cancelBtn"
          class="pm-btn-cancel"
          @click="$emit('close')"
        >
          <i class="bi bi-x-lg"></i>
          Annuller
        </button>

        <button
          class="pm-btn-confirm"
          @click="$emit('confirm')"
        >
          <i class="bi bi-trash3" aria-hidden="true"></i>
          Slet opskrift
        </button>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: "ConfirmDeleteRecipeModal",
  props: {
    visible: Boolean,
    recipeTitle: String,
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.cancelBtn?.focus();
        });
      }
    },
  },
};
</script>

<style scoped>
/* =============== */
/* OVERLAY + BLUR  */
/* =============== */
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(6px);
}

/* ===================== */
/* MODAL-STIL (samme som ProductModal / ConfirmModal) */
.confirm-box {
  background: #fff;
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  padding: 24px 22px 26px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.22);
  position: relative;
}

/* HEADER */
.confirm-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.confirm-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.confirm-title {
  font-weight: 700;
  margin: 0;
  color: #000;
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
  top: 15px;
  right: 15px;
  position: absolute;
}

/* BODY */
.confirm-body {
  margin-top: 18px;
  font-size: 1rem;
  color: #333;
}

/* ACTIONS */
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

/* SLET (samme orange som ConfirmModal "Bekræft") */
.pm-btn-confirm {
  flex: 1;
  border-radius: 999px;
  background: #e02424;
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

.pm-btn-cancel i,
.pm-btn-used i {
  font-size: 1.2rem;
}

/* DARK MODE */
.dark-mode .confirm-box {
  background-color: #2c2c2c;
  color: #ffffff;
}

.dark-mode .pm-btn-cancel {
  background: #444444;
  color: #ffffff;
  border: 2px solid #ffffff;
}

.dark-mode .confirm-close {
  filter: invert(1);
}

.dark-mode p, .dark-mode h3 {
  color: #ffffff;
}
</style>

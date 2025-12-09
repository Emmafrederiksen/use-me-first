<template>
  <div v-if="visible" class="admin-modal-overlay">
    <div
      class="admin-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-recipe-title"
      ref="modal"
      >
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 id="delete-recipe-title" class="mb-1">Slet opskrift</h3>
          <div class="admin-modal-underline"></div>
        </div>
        <button class="btn-close" @click="$emit('close')" aria-label="Luk modal"></button>
      </div>

      <p class="mb-3">
        Er du sikker på, at du vil slette
        <strong>{{ recipeTitle }}</strong>?<br />
        Denne handling kan ikke fortrydes.
      </p>

      <div class="d-flex justify-content-between gap-2 mt-3">
        <button
          ref="cancelBtn"
          class="btn admin-btn-cancel flex-fill"
          @click="$emit('close')"
          aria-label="Annuller sletning"
        >
          Annuller
        </button>

        <button
          class="btn admin-btn-delete flex-fill"
          @click="$emit('confirm')"
          aria-label="Bekræft sletning af opskrift"
        >
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
    visible: {
      type: Boolean,
      default: false,
    },
    recipeTitle: {
      type: String,
      default: "",
    },
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.$refs.cancelBtn.focus();
        });
      }
    },
  },
};
</script>

<style scoped>
.admin-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(6px);
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

.admin-btn-cancel {
  background: #08300f;
  color: #ffffff;
  border-radius: 999px;
  border: none;
  font-weight: 600;
}

.admin-btn-delete {
  background: #ed1919;
  color: #ffffff;
  border-radius: 999px;
  border: none;
  font-weight: 600;
}

.admin-btn-cancel:hover,
.admin-btn-delete:hover {
  filter: brightness(0.95);
}

.dark-mode .admin-modal {
  background-color: #2c2c2c;
  color: #ffffff;
}
.dark-mode .admin-btn-cancel {
  background-color: #444444;
}
.dark-mode .btn-close {
  filter: invert(1);
}
</style>

<template>
  <div v-if="visible" class="admin-modal-overlay">
    <div class="admin-modal">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h3 class="mb-1">Slet opskrift</h3>
          <div class="admin-modal-underline"></div>
        </div>
        <button class="btn-close" @click="$emit('close')"></button>
      </div>

      <p class="mb-3">
        Er du sikker på, at du vil slette
        <strong>{{ recipeTitle }}</strong>?<br />
        Denne handling kan ikke fortrydes.
      </p>

      <div class="d-flex justify-content-between gap-2 mt-3">
        <button
          class="btn admin-btn-cancel flex-fill"
          @click="$emit('close')"
        >
          Annuller
        </button>

        <button
          class="btn admin-btn-delete flex-fill"
          @click="$emit('confirm')"
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
</style>

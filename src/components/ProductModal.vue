<template>
  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header justify-content-center position-relative">
          <h5 class="modal-title">{{ product.name }}</h5>
          <!-- dette skal være produktnavnet !-->
          <button
            type="button"
            class="close-icon position-absolute end-0 me-3"
            v-on:click="$emit('close')"
            aria-label="Close"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <p>
            <i class="bi bi-circle-fill red-circle"></i>
            Udløber om <span class="date">2 dage</span>
          </p>
          <!-- dette skal være dynamisk baseret på udløbsdato !-->
          <p class="info-row">
            <span class="label">Udløbsdato</span
            ><span class="value">{{product.date}}</span>
          </p>
          <p class="info-row">
            <span class="label">Mængde</span><span class="value">{{product.quantity}}</span>
          </p>
          <p class="info-row">
            <span class="label">Placering</span
            ><span class="value">{{product.location}}</span>
          </p>
        </div>
        <button type="button" class="btn btn-recipe mt-3 mb-2">
            <i class="bi bi-fork-knife"></i>
            Se opskrifer med mælk
        </button>
        <div class="modal-footer justify-content-center">
          <button type="button" class="btn btn-delete">
            <i class="bi bi-trash3"></i>
          </button>
          <button type="button" class="btn btn-edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button type="button" class="btn btn-primary">
            <i class="bi bi-check2-circle"></i>
            Marker som brugt
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductModal",
  props: {
    product: {
        type: Object,
        required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-title {
  font-weight: bold;
}
.modal-body {
  text-align: center;
}
.date, .label {
  font-weight: bold;
}
.red-circle {
  color: red;
}
.btn-primary {
  background: #f27405;
  color: #ffffff;
  font-weight: 500;
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  margin-bottom: 10px;
  text-decoration: none;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
}
.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {
  background: #f27405 !important;
  color: #ffffff !important;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
  outline: none !important;
}

.btn-delete {
  background: #ffffff;
  color: #ed1919;
  font-weight: 500;
  border: 2px solid #ed1919;
  border-radius: 999px;
  padding: 8px 18px;
  margin-bottom: 10px;
  text-decoration: none;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
}
.btn-delete:hover,
.btn-delete:focus,
.btn-delete:active {
  background: #ffffff !important;
  color: #ed1919 !important;
  border: 2px solid #ed1919 !important;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
  outline: none !important;
}
.btn-edit {
  background: #ffffff;
  color: #08300f;
  font-weight: 500;
  border: 2px solid #08300f;
  border-radius: 999px;
  padding: 8px 18px;
  margin-bottom: 10px;
  text-decoration: none;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
}
.btn-edit:hover,
.btn-edit:focus,
.btn-edit:active,
.btn-recipe:hover,
.btn-recipe:focus,
.btn-recipe:active {
  background: #ffffff !important;
  color: #08300f !important;
  border: 2px solid #08300f !important;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
  outline: none !important;
}
.btn-recipe {
  background: #ffffff;
  color: #08300f;
  font-weight: 500;
  border: 2px solid #08300f;
  border-radius: 999px;
  padding: 8px 18px;
  margin-bottom: 10px;
  text-decoration: none;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
  display: block;
  width: fit-content;
  margin: 0 auto 10px;
}
.close-icon {
  background: none;
  border: none;
  font-size: 3rem;
  color: #000;
}
.modal-header {
  font-size: 1.5rem;
  border-bottom: 2px solid #000000;
}
.modal-footer {
  border-top: none;
}

.info-row {
  display: flex;
  justify-content: space-between; /* Label til venstre, value til højre */
  margin: 0.3rem 0; /* lidt mellemrum mellem rækker */
}

.label {
  font-weight: bold; /* gør label tydeligere */
}

.value {
  text-align: right; /* sikre, at value er højrestillet */
}
</style>

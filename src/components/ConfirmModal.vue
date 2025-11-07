<template>
  <div
    v-if="visible"
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ productName }}</h5>
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
            <p>{{description}}</p>
        </div>
        <div class="modal-footer justify-content-right">
          <button type="button" class="btn btn-cancel" v-on:click="$emit('close')">
            <i class="bi bi-x"></i>
            Annullér
          </button>
          <button type="button" class="btn btn-primary"  v-on:click="$emit('confirm', actionType)">
            <i class="bi bi-check2-circle"></i>
            Bekræft
          </button>
        </div>
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
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-title {
  font-weight: bold;
}
.modal-body {
  text-align: center;
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
.btn-cancel {
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
.btn-cancel:hover,
.btn-cancel:focus,
.btn-cancel:active {
  background: #ffffff !important;
  color: #08300f !important;
  border: 2px solid #08300f !important;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
  outline: none !important;
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
</style>
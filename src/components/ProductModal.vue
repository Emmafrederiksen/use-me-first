<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header position-relative">
          <div class="modal-title-wrapper">
            <h5 class="modal-title">{{ product.name }}</h5>
            <div class="modal-title-underline"></div>
          </div>
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
            <span
              class="dot"
              v-bind:class="badgeClass(daysLeft(product.expiresAt))"
            ></span>
            <span v-if="daysLeft(product.expiresAt) < 0">
              Udløbet for 
              <strong>
                {{ Math.abs(daysLeft(product.expiresAt)) }}          <!-- Math.abs = tager det positive tal af et negativt tal -->
                {{ Math.abs(daysLeft(product.expiresAt)) === 1 ? 'dag' : 'dage' }} 
              </strong>
              siden
            </span>
            <span v-else-if="daysLeft(product.expiresAt) === 0">
                Udløber<strong> i dag</strong>
            </span>
              <span v-else-if="daysLeft(product.expiresAt) === 1">
                Udløber <strong>i morgen</strong>
              </span>
              <span v-else>
                Udløber om <strong>{{ daysLeft(product.expiresAt) }} dage</strong>
              </span>
          </p>
          <p class="info-row">
            <span class="label">Udløbsdato</span>
            <span class="value">{{ dateDisplay }}</span>
          </p>
          <p class="info-row">
            <span class="label">Mængde</span
            ><span class="value">{{ amountUnit }}</span>
          </p>
          <p class="info-row">
            <span class="label">Placering</span
            ><span class="value">{{ product.location }}</span>
          </p>
        </div>
        <router-link to="/opskrifter">
          <button type="button" class="btn btn-recipe mt-3 mb-2">
            <i class="bi bi-fork-knife"></i>
            Se opskrifer med {{ product.name }}
          </button>
        </router-link>
        <div class="modal-footer justify-content-center">
          <button
            type="button"
            class="btn btn-delete"
            v-on:click="openConfirmModal('delete')"
          >
            <i class="bi bi-trash3"></i>
          </button>
          <button
            type="button"
            class="btn btn-edit"
            v-on:click="openEditModal()"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            type="button"
            class="btn btn-primary"
            v-on:click="openConfirmModal('markUsed')"
          >
            <i class="bi bi-check2-circle"></i>
            Marker som brugt
          </button>
        </div>
      </div>
    </div>
  </div>
  <ConfirmModal
    v-bind:visible="showConfirmModal"
    v-bind:actionType="currentAction"
    v-bind:productName="product.name"
    v-bind:description="description"
    v-on:close="showConfirmModal = false"
    v-on:confirm="handleConfirm"
  />

  <EditModal
    v-bind:visible="showEditModal"
    v-bind:product="localProduct"
    v-on:update-product="updateProduct"
    v-on:close="showEditModal = false"
  />
</template>

<script>
import ConfirmModal from "./ConfirmModal.vue";
import EditModal from "./EditModal.vue";
import { toast } from "vue3-toastify";

export default {
  name: "ProductModal",
  components: {
    ConfirmModal,
    EditModal,
  },
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
  data() {
    return {
      products: [],
      localProduct: { ...this.product },
      showConfirmModal: false,
      description: "",
      currentAction: "",
      showEditModal: false,
    };
  },
  methods: {
    openConfirmModal(action) {
      this.currentAction = action;
      if (action === "delete") {
        this.description = `Er du sikker på, at du vil slette ${this.product.name}? Denne handling kan ikke fortrydes.`;
      } else if (action === "markUsed") {
        this.description = `Er du sikker på, at du vil markere ${this.product.name} som brugt?`;
      }
      this.showConfirmModal = true;
    },
    openEditModal() {
      this.selectedProduct = { ...this.product }; // clone for sikkerhed
      this.showEditModal = true;
    },
    updateProduct(updatedProduct) {
      // Opdater lokal kopi
      this.localProduct = { ...updatedProduct };
      // Emit op til parent
      this.$emit("update-product", updatedProduct);
  },
    handleConfirm(action) { //metode til at håndtere bekræftelse i confirm modal
      this.showConfirmModal = false;
      this.$emit("close");
      // Logik til at håndtere bekræftelsen
      if (action === "delete") {
        this.$emit('delete-product', this.product.id);
        toast.success("Din vare er blevet slettet!", {
          autoClose: 3000,
          position: toast.POSITION.TOP_CENTER,
        });
      } else if (action === "markUsed") {
        this.$emit('delete-product', this.product.id);
        toast.success(
          "Godt klaret! Du har brugt en vare og undgået at smide den ud!",
          {
            autoClose: 3000,
            position: toast.POSITION.TOP_CENTER,
          }
        );
      }
    },
    daysLeft(dateString) {
      // dateString = den dato, varen udløber
      const today = new Date(); // today = den dato, det er i dag
      const targetDate = new Date(dateString); // targetDate = den dato, varen udløber
      const diffTime = targetDate - today; // diffTime = forskellen i tid mellem i dag og udløbsdatoen (i millisekunder)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Konverterer millisekunder til dage og runder op
    },

    badgeClass(days) {
      // Vælger farve baseret på antal dage til udløbsdato
      if(days < 0 ) return 'expired';
      if (days < 3) return "danger";
      if (days <= 4) return "warning";
      return "success";
    },
  },

  computed: {
    date() {
      // Antal dage til udløbsdato
      const today = new Date();
      const expiryDate = new Date(this.product.expiresAt);
      const timeDiff = expiryDate - today;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff < 0) return `${Math.abs(daysDiff)} dage siden`;
      if (daysDiff === 0) return "i dag";
      if (daysDiff === 1) return "1 dag";
      return `${daysDiff} dage`;
    },
    amountUnit() {
      // Formateret mængde og enhed
      if(this.product.amount && this.product.unit) {
        return `${this.product.amount} ${this.product.unit}`
      }
      return 'Ikke angivet';
    },
    dateDisplay() {
      const dateObj = new Date(this.product.expiresAt); // Opretter et Date-objekt fra produktets dato

      const day = String(dateObj.getDate()).padStart(2, "0"); // Henter dagen og sørger for to cifre
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Henter måneden (0-baseret, så +1) og sørger for to cifre
      const year = dateObj.getFullYear(); // Henter året

      return `${day}-${month}-${year}`;
    },
  },
  watch: {
    product: {
    immediate: true,
    handler(newVal) {
      this.localProduct = { ...newVal };
    }
  }
  }
};
</script>

<style scoped>

.modal {
  background-color: rgba(0, 0, 0, 0.35) !important;
  backdrop-filter: blur(3px);
}


/* Gør modalboks identisk med admin modal */
.modal-content {
  background: #ffffff;
  border-radius: 24px !important;   /* Runde hjørner */
  padding: 24px 20px 20px;          /* Indvendig padding */
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
  border: none;                     /* Fjern Bootstrap standard edge */
}

/* Sikrer at modal ikke går helt ud til kanter */
.modal-dialog {
  max-width: 420px !important; /* samme bredde som admin login */
  margin: 20px auto !important; /* luft over/under + centreret */
  padding: 0 16px; /* luft til siderne på små skærme */
}



.modal-title {
  font-weight: bold;
}
.modal-body {
  text-align: left !important;   /* ikke centreret */
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 0.95rem;
  line-height: 1.45;
}

.modal-body p:first-of-type {
  margin-bottom: 1rem;
  font-size: 1rem;
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

  transform: translateY(-2px);
  box-shadow: 0 14px 18px rgba(0, 0, 0, 0.18);

  outline: none !important;
  transition: all 0.2s ease;
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
  font-size: 2rem; 
  color: #333;
  top: 10px;
  right: 16px;
  cursor: pointer;
}


.modal-header {
  border-bottom: none !important;
  padding-bottom: 0;
  padding-top: 10px;
  position: relative;
  display: block; /* så titel placeres venstre */
}

.modal-title-wrapper {
  width: 100%;
  text-align: left;
}

.modal-title-underline {
  height: 2px;
  width: 80px;
  background: #ddd;
  margin-bottom: 6px;
}


.modal-footer {
  border-top: none;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 1rem;
  border-bottom: 1px solid #e6e6e6;
}

.info-row:last-of-type {
  border-bottom: none; /* ingen streg under sidste element */
}

.info-row .label {
  font-weight: 600;
  color: #333;
}

.info-row .value {
  color: #444;
  text-align: right;
}

.label {
  font-weight: bold;
}

.value {
  text-align: right;
}

a {
  text-decoration: none;
  color: inherit;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
  display: inline-block;
}

.dot.danger {
  background: #e02424;
}

.dot.warning {
  background: #f5b400;
}

.dot.success {
  background: #1fbf62;
}
.dot.expired {
    background: #000000;
}
</style>

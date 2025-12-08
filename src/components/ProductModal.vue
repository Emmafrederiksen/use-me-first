<template>
  <div v-if="visible" class="productmodal-overlay" tabindex="-1" role="dialog">

    <div class="productmodal-box" role="document">

      <div class="productmodal-content">

        <div class="modal-header position-relative">
          <div class="modal-title-wrapper">
            <h3 class="productmodal-title">{{ product.name }}</h3>
            <div class="modal-title-underline"></div>
          </div>
          <button
            type="button"
            class="close-icon position-absolute end-0"
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
              v-bind:class="badgeClass(daysLeft(product.expiresAt))">
              </span>
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
          <button type="button" class="pm-btn-recipe">
            <i class="bi bi-fork-knife"></i>
            Se opskrifter med {{ product.name }}
          </button>
        </router-link>
        
        <div class="productmodal-actions">

          <button type="button" class="pm-btn-delete" v-on:click="openConfirmModal('delete')">
            <i class="bi bi-trash3"></i>
          </button>

          <button type="button" class="pm-btn-edit" v-on:click="openEditModal()">
            <i class="bi bi-pencil"></i>
          </button>

          <button type="button" class="pm-btn-used" v-on:click="openConfirmModal('markUsed')">
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

/* =========================================================
   PRODUCT MODAL — OVERLAY & CONTAINER
   ========================================================= */
.productmodal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);   /* ← Blur tilbage */
  -webkit-backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000 !important; /* ← vigtig ændring */
}


.productmodal-box {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 22px 26px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.22);
  position: relative;
}

.productmodal-content {
  width: 100%;
}

/* =========================================================
   TITLE + CLOSE BUTTON
   ========================================================= */
.productmodal-title {
  font-weight: 700;
  margin: 0;
  color: #000;
}

.modal-title-wrapper {
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

.close-icon {
  background: none;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
}

/* =========================================================
   MODAL BODY + TOP INFO (Udløbs-linjen)
   ========================================================= */
.modal-body {
  padding: 0 4px;
  margin-top: 16px !important;
  text-align: left;
  color: #333;
}

.modal-body > p:first-of-type {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  margin: 10px 0 30px;
}

/* Dot status indikator */
.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-right: 8px;
  box-shadow: 0 0 0 2px rgba(0,0,0,0.2);
  display: inline-block;
}

.dot.danger { background: #e02424; }
.dot.warning { background: #f5b400; }
.dot.success { background: #1fbf62; }
.dot.expired { background: #000; }

/* =========================================================
   INFO ROWS (Udløbsdato, Mængde, Placering)
   ========================================================= */
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.97rem;
  border-bottom: 1px solid #eee;
}

.info-row:last-of-type {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #222;
}

.value {
  color: #444;
  text-align: right;
}

/* =========================================================
   OPSKRIFT-KNAP (grøn outline)
   ========================================================= */
.pm-btn-recipe {
  background: #ffffff;
  color: #08300f;
  border: 2px solid #08300f;
  border-radius: 999px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: fit-content;
  margin: 30px auto 18px;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.10);
  cursor: pointer;
  transition: all 0.2s ease;
  
}

/* Hover-effekt (samme som de andre pm-knapper) */
.pm-btn-recipe:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(8, 48, 15, 0.18); /* mildere og blødere */
  filter: brightness(1.05);
}

/* Fjerner standard link-styling når router-link omslutter knappen */
a:has(button.pm-btn-recipe) {
  all: unset !important;
  text-decoration: none !important;
  color: inherit !important;
  display: flex; /* så indholdet ikke hopper */
}

/* Ikoner i knapper med TEKST */
.pm-btn-recipe i {
  font-size: 1.2rem; 
}


/* =========================================================
   ACTION KNAPPER (delete, edit, used)
   ========================================================= */
.productmodal-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
  gap: 12px;
  width: 100%;
}

/* Fælles layout til alle tre knapper */
.pm-btn-delete,
.pm-btn-edit,
.pm-btn-used {
  height: 58px;
  border-radius: 999px;
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  white-space: nowrap;
}

/* Ikoner i runde IKON-knapper (delete + edit) */
.pm-btn-delete i,
.pm-btn-edit i {
  font-size: 1.2rem;
}

.pm-btn-used i {
  font-size: 1.5rem;   /* ens og lidt større */
}

/* DELETE (rød outline) */
.pm-btn-delete {
  border: 2px solid #ED1919;
  color: #ED1919;
  background: white;
}

.pm-btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(237, 25, 25, 0.25);
  filter: brightness(1.05);
}

/* EDIT (grøn outline) */
.pm-btn-edit {
  border: 2px solid #08300f;
  color: #08300f;
  background: white;
}

.pm-btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(8,48,15,0.25);
  filter: brightness(1.05);
}

/* USED (orange, fyldt) */
.pm-btn-used {
  background: #f27405;
  color: white;
  border: none;
  flex: 1;
  min-width: 130px;
}

.pm-btn-used:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(242,116,5,0.25);
  filter: brightness(1.05);
}

/* =========================================================
   RESPONSIVE TWEAKS
   ========================================================= */
@media (max-width: 420px) {
  .productmodal-actions {
    gap: 8px;
  }
  .pm-btn-delete,
  .pm-btn-edit {
    padding: 0 16px;
    height: 52px;
  }
  .pm-btn-used {
    height: 52px;
    font-size: 0.9rem;
  }
}


/* Tablet */
@media (min-width: 600px) {
  .productmodal-box {
    max-width: 500px;
    padding: 32px 30px;
  }

  .modal-title {
    font-size: 1.6rem;
  }

  .modal-body {
    font-size: 1.05rem;
  }

  .pm-btn-recipe {
    font-size: 1.05rem;
    padding: 12px 28px;
  }

  .pm-btn-used {
    font-size: 1.05rem;
  }
}

/* Laptop */
@media (min-width: 900px) {
  .productmodal-box {
    max-width: 600px;
    padding: 36px 34px;
  }

  .modal-title {
    font-size: 1.7rem;
  }

  .info-row {
    font-size: 1.05rem;
  }

  .pm-btn-delete,
  .pm-btn-edit {
    height: 62px;
  }

  .pm-btn-used {
    height: 62px;
    font-size: 1.1rem;
  }
}

/* Desktop Large */
@media (min-width: 1400px) {
  .productmodal-box {
    max-width: 720px;
    padding: 42px 40px;
  }

  .modal-title {
    font-size: 1.9rem;
  }

  .modal-body {
    font-size: 1.10rem;
  }

  .pm-btn-recipe {
    font-size: 1.1rem;
    padding: 14px 32px;
  }

  .pm-btn-delete,
  .pm-btn-edit {
    height: 58px;
  }

  .pm-btn-used {
    height: 58px;
    font-size: 1.10rem;
  }
}

.dark-mode .productmodal-content, .dark-mode .productmodal-box {
  background-color: #2c2c2c;
  color: #ffffff;
}
.dark-mode .modal-body span, .dark-mode h3 {
  color: #ffffff;
}

.dark-mode .close-icon {
  filter: invert(1);
}

</style>

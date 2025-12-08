<template>
  <div v-if="visible" class="edit-overlay">

    <div class="edit-box">
      
      <!-- HEADER -->
      <div class="edit-header">
        <div class="edit-title-wrapper">
          <h3 class="edit-title">Rediger {{ product.name }}</h3>
          <div class="edit-title-underline"></div>
        </div>

        <button class="edit-close" @click="$emit('close')">
          <i class="bi bi-x"></i>
        </button>
      </div>

      <!-- BODY / FORM -->
      <div class="edit-body">
        <form @submit.prevent="submitForm">

          <!-- NAVN -->
          <div class="mb-4 mt-3">
            <label class="edit-label">Varenavn *</label>
            <input type="text" class="edit-input" v-model="Name" placeholder="Indtast navn..." required />
          </div>

          <!-- PLACERING -->
          <div class="mb-4">
            <label class="edit-label">Placering</label>
            <select class="edit-select" v-model="Location">
              <option value="1">Køleskab</option>
              <option value="2">Fryser</option>
              <option value="3">Depot</option>
            </select>
          </div>

          <!-- UDLØBSDATO -->
          <div class="mb-4">
            <label class="edit-label">Udløbsdato *</label>
            <input type="date" class="edit-input" v-model="Date" required />
          </div>

          <!-- MÆNGDE + ENHED -->
          <div class="edit-row">
            <div class="edit-col-small">
              <label class="edit-label">Mængde</label>
              <input type="number" class="edit-input" v-model="Amount" placeholder="1" />
            </div>

            <div class="edit-col-large">
              <label class="edit-label">Enhed</label>
              <select class="edit-select" v-model="Unit">
                <option disabled value="">Vælg enhed</option>
                <option value="1">Gram</option>
                <option value="2">Bakke(r)</option>
                <option value="3">Stk.</option>
                <option value="4">Kilo</option>
                <option value="5">Liter</option>
                <option value="6">Pakke(r)</option>
              </select>
            </div>
          </div>

          <!-- GEM-KNAP -->
          <button class="edit-save-btn" type="submit">
            <i class="bi bi-check2-circle"></i>
            Gem ændringer
          </button>

        </form>
      </div>

    </div>

  </div>
</template>


<script>

import { toast } from "vue3-toastify";

export default {

  name: "EditModal",

  props: {
    visible: {
      type: Boolean,
      default: false,
    },

    product: {
      type: Object,
      required: true,
    },

  },

  data() {
    return {
      Name: "",
      Location: "",
      Date: "",
      Amount: "",
      Unit: "",
    };
  },

  methods: {
    submitForm() {
      // --- Map dropdown values back to text ---
      let locationText = "";
      switch (this.Location) {
        case "1":
          locationText = "Køleskab";
          break;
        case "2":
          locationText = "Fryser";
          break;
        case "3":
          locationText = "Depot";
          break;
      }

      let unitText = "";
      switch (this.Unit) {
        case "1":
          unitText = "Gram";
          break;
        case "2":
          unitText = "Bakke(r)";
          break;
        case "3":
          unitText = "Stk.";
          break;
        case "4":
          unitText = "Kilo";
          break;
        case "5":
          unitText = "Liter";
          break;
        case "6":
          unitText = "Pakke(r)";
          break;
      }

      const updatedProduct = {
        ...this.product,
        name: this.Name,
        location: locationText,
        expiresAt: this.Date ? new Date(this.Date).toISOString() : null,
        amount: this.Amount ? Number(this.Amount) : "",
        unit: unitText,
      };

      toast.success("Dine ændringer er blevet gemt! Varen er nu opdateret", {
        autoClose: 3000,
        position: toast.POSITION.TOP_CENTER,
      });

      this.$emit("update-product", updatedProduct);
      this.$emit("close");
    },
  },

  watch: {
    product: {
      immediate: true,

      handler(newProduct) {
        if (newProduct) {
          // Name
          this.Name = newProduct.name || "";

          // Location (tekst -> value)
          switch (newProduct.location) {
            case "Køleskab":
              this.Location = "1";
              break;
            case "Fryser":
              this.Location = "2";
              break;
            case "Depot":
              this.Location = "3";
              break;
            default:
              this.Location = "";
          }

          // Date (konverter til YYYY-MM-DD format, som input[type=date] kræver)
          if (newProduct.expiresAt) {
            const dateObj = new Date(newProduct.expiresAt);
            // Korrigér for tidszoneforskydning, ellers viser den forkert dato
            const localDate = new Date(
              dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
            );
            this.Date = localDate.toISOString().split("T")[0];
          } else {
            this.Date = "";
          }


          this.Amount =
            newProduct.amount !== undefined &&
            newProduct.amount !== null &&
            newProduct.amount !== ""
              ? Number(newProduct.amount)
              : "";

          // Unit (tekst -> value)
          switch (newProduct.unit) {
            case "Gram":
              this.Unit = "1";
              break;
            case "Bakke(r)":
              this.Unit = "2";
              break;
            case "Stk.":
              this.Unit = "3";
              break;
            case "Kilo":
              this.Unit = "4";
              break;
            case "Liter":
              this.Unit = "5";
              break;
            case "Pakke(r)":
              this.Unit = "6";
              break;
            default:
              this.Unit = "";
          }
        }
      },
    },
  },
};


</script>

<style scoped>

/* =========================================================
   OVERLAY — samme blur & z-index som ConfirmModal
   ========================================================= */
.edit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000 !important;
}

/* =========================================================
   MODAL BOX
   ========================================================= */
.edit-box {
  background: #fff;
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  padding: 24px 22px 26px;
  box-shadow: 0 18px 40px rgba(0,0,0,0.22);
  position: relative;
}

/* =========================================================
   HEADER
   ========================================================= */
.edit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-title-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.edit-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000;
  margin: 0;
}

.edit-title-underline {
  height: 2px;
  width: 90px;
  background: #dddddd;
  margin-top: 4px;
}

.edit-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
  top: 15px;      /* løfter krydset op */
  right: 15px;    /* flytter det lidt mere ud i hjørnet */
  position: absolute;
}

/* =========================================================
   BODY + FORM FIELDS
   ========================================================= */
.edit-body {
  margin-top: 18px;
}

.edit-label {
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
  display: block;
}

/* INPUTS */
.edit-input,
.edit-select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #d0d5dd; 
  background: #fff;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.06);
  transition: 0.2s ease;
}

.edit-input:focus,
.edit-select:focus {
  border-color: #08300f;
  box-shadow: 0 0 0 2px rgba(8, 48, 15, 0.15);
  outline: none;
}

/* EXTRA styling — custom dropdown pil */
.edit-select {
  padding-right: 40px; /* giver plads til custom pil */
  appearance: none;    /* fjern default pil */

  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L8 9L15 1' stroke='%2308300F' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center; /* ryk pil ind */
  background-size: 16px;
}

/* =========================================================
   RÆKKER OG KOLONNER TIL MÆNGDE + ENHED
   ========================================================= */

/* Mængde + Enhed række */
.edit-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.edit-col-small {
  width: 30%;
}

.edit-col-large {
  width: 70%;
}

/* =========================================================
   GEM ÆNDRINGER KNAP — samme stil som orange knapper
   ========================================================= */
.edit-save-btn {
  width: 100%;
  background: #f27405;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 18px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  cursor: pointer;
  transition: 0.2s ease;
}

.edit-save-btn i {
  font-size: 1.4rem;
}

.edit-save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 14px rgba(242,116,5,0.25);
  filter: brightness(1.05);
}

/* =========================================================
   RESPONSIVE — som ConfirmModal & ProductModal
   ========================================================= */
@media (min-width: 600px) {
  .edit-box {
    max-width: 500px;
    padding: 32px 28px;
  }

  .edit-title {
    font-size: 1.55rem;
  }

  .edit-save-btn {
    font-size: 1.05rem;
  }
}

.dark-mode .edit-box {
  background-color: #2c2c2c;
  color: #ffffff;
}

.dark-mode .edit-close {
  filter: invert(1);
}

.dark-mode .edit-input, .dark-mode .edit-select {
  background-color: #9c9c9c;
  border: 1px solid #444444;
}

.dark-mode .edit-label, .dark-mode h3 {
  color: #ffffff;
}


</style>

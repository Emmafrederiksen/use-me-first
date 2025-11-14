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
          <h5 class="modal-title">Rediger {{ product.name }}</h5>
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
          <form @submit.prevent="submitForm" class="mx-4">
            <div class="mb-4 mt-5">
              <label for="name" class="form-label bold-label">Varenavn *</label>
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="Indtast navn..."
                v-model="Name"
                required
              />
            </div>

            <div class="mb-4">
              <label for="location" class="form-label bold-label"
                >Placering</label
              >
              <select
                id="location"
                class="form-select"
                aria-label="Vælg placering"
                v-model="Location"
              >
                <option value="1">Køleskab</option>
                <option value="2">Fryser</option>
                <option value="3">Depot</option>
              </select>
            </div>

            <div class="mb-4">
              <label for="date" class="form-label bold-label"
                >Udløbsdato *</label
              >
              <input
                type="date"
                class="form-control"
                id="date"
                v-model="Date"
                required
              />
            </div>

            <div class="d-flex align-items-center gap-3">
              <div class="mb-4" style="width: 30%">
                <label for="amount" class="form-label bold-label">Mængde</label>
                <input
                  type="number"
                  class="form-control"
                  id="amount"
                  placeholder="1"
                  v-model="Amount"
                />
              </div>

              <div class="mb-4" style="width: 70%">
                <select
                  id="value"
                  class="form-select"
                  aria-label="Vælg enhed"
                  style="margin-top: 32px"
                  v-model="Unit"
                >
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

            <button to="/indtast" class="add-btn mt-3" type="submit">
              <i class="bi bi-check2-circle me-2"></i>
              Gem ændringer
            </button>
          </form>
        </div>
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
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-title {
  font-weight: bold;
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
.add-btn {
  background: #f27405;
  color: #ffffff;
  font-weight: 500;
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  margin-bottom: 10px;
  text-decoration: none;
  box-shadow: 0 10px 14px rgba(0, 0, 0, 0.14);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-btn i {
  font-size: 1.2rem;
  line-height: 1;
}

.bold-label {
  font-weight: 600;
}
</style>

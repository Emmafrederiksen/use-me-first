<template>
  <HeaderCard @open-menu="openMenu" titleOverride="Tilføj vare" />

  <div class="additem-wrapper">
    <form @submit.prevent="validateAndSubmit" class="additem-grid" novalidate>

      <!-- VARER NAVN -->
      <div class="form-section name-section">
        <label for="name" class="form-label">Varenavn *</label>

        <input
          id="name"
          type="text"
          class="form-control"
          placeholder="Indtast navn..."
          v-model="Name"
          :aria-invalid="nameError ? 'true' : 'false'"
          :aria-describedby="nameError ? 'name-error' : null"
          :class="{ 'input-error': nameError }"
          aria-required="true"
          required
        />

        <!-- Fejlbesked -->
        <p
          v-if="nameError"
          id="name-error"
          class="error-text"
          role="alert"
          aria-live="assertive"
        >
          Varenavn skal udfyldes.
        </p>
      </div>

      <!-- PLACERING -->
      <div class="form-section location-section">
        <label for="location" class="form-label">Placering</label>

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

      <!-- DATO -->
      <div class="form-section date-section">
        <label for="date" class="form-label">Udløbsdato *</label>

        <input
          id="date"
          type="date"
          class="form-control"
          v-model="Date"
          :aria-invalid="dateError ? 'true' : 'false'"
          :aria-describedby="dateError ? 'date-error' : null"
          :class="{ 'input-error': dateError }"
          aria-required="true"
          required
        />

        <!-- Fejlbesked -->
        <p
          v-if="dateError"
          id="date-error"
          class="error-text"
          role="alert"
          aria-live="assertive"
        >
          Du skal vælge en udløbsdato.
        </p>
      </div>

      <!-- MÆNGDE + ENHED -->
      <div class="form-section amount-section">
        <label for="amount" class="form-label">Mængde</label>

        <input
          id="amount"
          type="number"
          class="form-control"
          placeholder="Indtast antal"
          v-model="Amount"
          :aria-describedby="unitError ? 'unit-error' : null"
          :aria-invalid="unitError ? 'true' : 'false'"
          :class="{ 'input-error': unitError }"
        />
      </div>

      <div class="form-section unit-section">
        <label for="unit" class="form-label">Enhed</label>

        <select
          id="unit"
          class="form-select"
          aria-label="Vælg enhed"
          v-model="Unit"
          :aria-invalid="unitError ? 'true' : 'false'"
          :class="{ 'input-error': unitError }"
        >
          <option disabled value="">Vælg enhed</option>
          <option value="1">Gram</option>
          <option value="2">Bakke(r)</option>
          <option value="3">Stk.</option>
          <option value="4">Kilo</option>
          <option value="5">Liter</option>
          <option value="6">Pakke(r)</option>
        </select>

        <!-- Fejl -->
        <p
          v-if="unitError"
          id="unit-error"
          class="error-text"
          role="alert"
          aria-live="assertive"
        >
          Hvis du angiver en mængde, skal du vælge en enhed.
        </p>
      </div>

      <!-- GEM KNAP -->
      <div class="submit-wrapper">
        <button type="submit" class="add-btn">
          <i class="bi bi-check2-circle"></i>
          Gem vare
        </button>
      </div>

    </form>
  </div>
</template>

<script>
import HeaderCard from './HeaderCard.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'AddItem',

  props: {
    openMenu: {
      type: Function,
      required: true,
    },
  },

  components: { HeaderCard },

  data() {
    return {
      Name: '',
      Location: '1',
      Date: '',
      Amount: null,
      Unit: '',

      // fejlstates
      nameError: false,
      dateError: false,
      unitError: false,
    };
  },

  methods: {
    validateAndSubmit() {
      this.nameError = !this.Name.trim();
      this.dateError = !this.Date;
      this.unitError = this.Amount && !this.Unit;

      if (this.nameError || this.dateError || this.unitError) return;

      this.submitForm();
    },

    submitForm() {
      const newItem = {
        name: this.Name,
        location: this.Location,
        expiresAt: this.Date,
        amount: this.Amount,
        unit: this.Unit,
      };

      const existingItems = JSON.parse(localStorage.getItem('myFridgeItems') || '[]');
      existingItems.push(newItem);
      localStorage.setItem('myFridgeItems', JSON.stringify(existingItems));

      this.Name = '';
      this.Location = '1';
      this.Date = '';
      this.Amount = null;
      this.Unit = '';

      toast.success('Din vare er blevet gemt!', {
        autoClose: 2500,
        position: toast.POSITION.TOP_CENTER,
      });
    },
  },
};
</script>

<style scoped>

/* Wrapper matcher RecipeForm */
.additem-wrapper {
  margin: 3rem 1.5rem;
}

.additem-grid {
  display: grid;
  gap: 2rem;
}

.form-label {
  font-weight: 600;
  font-size: 1.125rem;
  margin-bottom: 8px;
}

/* Inputs */
.form-control,
.form-select {
  width: 100%;
  padding: 10px 14px;
  border-radius: 14px;
  background: #fff;
  border: 1.8px solid #dadada;
  transition: 0.25s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.06);
}

/* ============================================================
   SELECT — CUSTOM DROPDOWN PIL
   ============================================================ */

.form-select {
  appearance: none;
  padding-right: 40px;
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L8 9L15 1' stroke='%2308300F' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
}
/* ------------------------ */

.form-control:focus,
.form-select:focus {
  border-color: #678a69;
  box-shadow: 0 0 0 2px rgba(8, 48, 15, 0.15);
  outline: none;
  background-color: #ffffff;
}


/* Error state */
.input-error {
  border-color: #d93025;
  box-shadow: 0 0 0 2px rgba(217,48,37,0.25);
}

.error-text {
  color: #d93025;
  font-size: 0.9rem;
  margin-top: 6px;
}

/* Submit */
.submit-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.add-btn {
  background: #F27405;
  color: white;
  padding: 12px 22px;
  border-radius: 999px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: none;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);
}

/* RESPONSIVE GRID (samme logik som RecipeForm.vue) */

/* Tablet */
@media (min-width: 600px) {
  .additem-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
  }
}

/* Laptop – to kolonner */
@media (min-width: 992px) {
  .additem-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .additem-grid {
    grid-template-columns: 1fr 1fr;
  }

  .name-section { grid-column: 1 / 3; }
  .location-section { grid-column: 1; }
  .date-section { grid-column: 2; }
  .amount-section { grid-column: 1; }
  .unit-section { grid-column: 2; }

  .submit-wrapper {
    grid-column: 2;
  }
}

/* Desktop */
@media (min-width: 1400px) {
  .additem-wrapper {
    max-width: 85%;
  }
}

/* Ultrawide */
@media (min-width: 1800px) {
  .additem-wrapper {
    max-width: 80%;
  }
}

/* Dark mode */
.dark-mode .form-control,
.dark-mode .form-select {
  background: #4a4a4a;
  color: #fff;
  border: 1px solid #777;
}

.dark-mode .form-select {
  background-image: url("data:image/svg+xml,%3Csvg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L8 9L15 1' stroke='%23ffffff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
}


.form-control:hover,
.form-select:hover {
  border-color: #678a69;
}


.dark-mode .form-label {
  color: #ccc;
}

.dark-mode .error-text {
  color: #ff7a7a;
}

.dark-mode .form-control::placeholder,
.dark-mode .form-select::placeholder {
  color: #e0e0e0;
}

</style>

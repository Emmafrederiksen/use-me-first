<template>
    <HeaderCard 
    
    @open-menu="openMenu"

    />

    <form @submit.prevent="submitForm" class="mx-4" novalidate>
        <div class="mb-4 mt-5">
            <label for="name" class="form-label bold-label">Varenavn *</label>
            <input
                ref="nameInput" type="text" class="form-control" id="name" placeholder="Indtast navn"
                v-model="Name" :aria-describedby="nameError ? 'name-error' : null"
                :class="{'is-invalid': nameError }" required aria-required="true">
        </div>

        <!-- Fejlbesked il skræmlæser for varenavn -->
         <div
            v-if="nameError"
            id="name-error"
            class="invalid-feedback"
            role="alert"
            aria-live="assertive"
            >
            Varenavn skal udfyldes
         </div>

        <div class="mb-4">
            <label for="location" class="form-label bold-label">Placering</label>
            <select id="location" class="form-select" aria-label="Vælg placering" v-model="Location">
                <option value="1">Køleskab</option>
                <option value="2">Fryser</option>
                <option value="3">Depot</option>
            </select>
        </div>

        <div class="mb-4">
            <label for="date" class="form-label bold-label">Udløbsdato *</label>
            <input 
                ref="dateInput" type="date" class="form-control" id="date"
                v-model="Date" :aria-describedby="dateError ? 'date-error' : null"
                :class="{'is-invalid': dateError }" required aria-required="true">
        </div>

        <!-- Fejlbesked til skræmlæser for udløbsdato -->
        <div
            v-if="dateError"
            id="date-error"
            class="invalid-feedback"
            role="alert"
            aria-live="assertive"
            >
            Udløbsdato skal udfyldes
         </div>

        <div class="d-flex align-items-center gap-3">
            <div class="mb-4" style="width: 40%;">
                <label for="amount" class="form-label bold-label">Mængde</label>
                <input type="number" class="form-control" id="amount" placeholder="Indtast antal" v-model="Amount">
            </div>

            <div class="mb-4" style="width: 60%;">
                <select id="value" class="form-select" aria-label="Vælg enhed" style="margin-top: 32px;" v-model="Unit">
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
            <i class="bi bi-check2-circle me-2" aria-hidden="true"></i>
            Gem vare
        </button>
    </form>
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

    data() {
        return {
            Name: '',
            Location: '1',
            Date: '',
            Amount: null,
            Unit: '',
            nameError: false,
            dateError: false,
        }
    },
    
    components: {
        HeaderCard,
    },

    methods: {
        submitForm() {
            this.nameError = false;
            this.dateError = false;

            if (!this.Name) { 
                this.nameError = true;
                this.$refs.nameInput.classList.add('is-invalid');
            }
            if (!this.Date) { 
                this.dateError = true;
                this.$refs.dateInput.classList.add('is-invalid');
            }

            if (this.nameError || this.dateError ) return;

            // Samler data i et objekt: newItem
            const newItem = {
                name: this.Name,
                location: this.Location, 
                expiresAt: this.Date,
                amount: this.Amount,
                unit: this.Unit,
            };


            // Gemmes midlertidigt i localStorage så varer bevares ved opdatering af siden
            const existingItems = JSON.parse(localStorage.getItem('myFridgeItems') || '[]');
            existingItems.push(newItem);
            localStorage.setItem('myFridgeItems', JSON.stringify(existingItems));


            // Nulstil felter efter indsendelse
            this.Name = '';
            this.Location = '1';
            this.Date = '';
            this.Amount = null;
            this.Unit = '';

            // Toast message when succes
            toast.success('Din vare er blevet gemt!', {
                autoClose: 3000,
                position: toast.POSITION.TOP_CENTER
            });

        },
        
    }
}
</script>

<style scoped>
.add-btn {
  background: #F27405;
  color: #ffffff;
  font-weight: 500;
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  margin-bottom: 10px;
  text-decoration: none;
  box-shadow: 0 10px 14px rgba(0,0,0,0.14);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.add-btn i {
  font-size: 16px; 
  line-height: 1;
}

.bold-label {
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
}

.dark-mode input {
    background-color: #9c9c9c;
    border: 1px solid #444444;
}
.dark-mode select {
    background-color: #9c9c9c;
    border: 1px solid #444444;
}
.dark-mode label {
    color: #ffffff;

}

</style>
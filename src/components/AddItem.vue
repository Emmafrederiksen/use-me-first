<template>
    <HeaderCard />

    <form @submit.prevent="submitForm" class="mx-4">
        <div class="mb-4 mt-5">
            <label for="name" class="form-label bold-label">Varenavn *</label>
            <input type="text" class="form-control" id="name" placeholder="Indtast navn..." v-model="Name">
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
            <input type="date" class="form-control" id="date" v-model="Date">
        </div>

        <div class="d-flex align-items-center gap-3">
            <div class="mb-4" style="width: 30%;">
                <label for="amount" class="form-label bold-label">Mængde</label>
                <input type="number" class="form-control" id="amount" placeholder="1" v-model="Amount">
            </div>

            <div class="mb-4" style="width: 70%;">
                <select id="value" class="form-select" aria-label="Vælg enhed" style="margin-top: 32px;" v-model="Unit">
                    <option value="1">Gram</option>
                    <option value="2">Bakker</option>
                    <option value="3">Stk.</option>
                    <option value="4">Kilo</option>
                    <option value="5">Liter</option>
                </select>
            </div>
        </div>

        <button to="/indtast" class="add-btn mt-3" type="submit">
            <i class="bi bi-check2-circle me-2"></i>
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

    data() {
        return {
            Name: '',
            Location: '1',
            Date: '',
            Amount: null,
            Unit: '5',
        }
    },
    
    components: {
        HeaderCard,
    },
    methods: {
        submitForm() {

            // Validate required fields
            if(!this.Name || !this.Date) {
                alert('Udfyld venligst alle påkrævede felter markeret med *');
                return;
            }

            //Log data for testing - replace with actual save logic
            console.log('Name:' + this.Name);
            this.Name = '';

            console.log('Location:' + this.Location);
            this.Location = '1';

            console.log('Date:' + this.Date);
            this.Date = '';

            console.log('Amount:' + this.Amount);
            this.Amount = null;

            console.log('Unit:' + this.Unit);
            this.Unit = '5';
            
            //acyual save logic here


            // Toast message when succes
            toast.success('Din vare er blevet gemt!', {
                autoClose: 4000,
                position: toast.POSITION.BOTTOM_CENTER
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
  font-size: 1.2rem; 
  line-height: 1;
}

.bold-label {
    font-weight: 600;
}


</style>
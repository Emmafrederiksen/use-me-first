<template>

    <HeaderCard />

    <!-- Søge funktion -->
    <div class="d-flex align-items-center gap-2 mt-5 mx-4 mb-3">
      <div class="input-group search-wrap shadow rounded-5">
        <span class="input-group-text bg-white border-0"><i class="bi bi-search"></i></span>
        <input v-model.trim="query" type="search" class="form-control border-0" placeholder="Søg efter varer…" />
      </div>
      <button class="btn btn-white shadow rounded-3 px-3 border"><i class="bi bi-sliders2"></i></button>
    </div>

    <!-- liste -->
    <div class="mt-5 mx-4">
      
      <div v-for="item in filtered" :key="item.id" class="card item-card mb-3 shadow-sm">
        <div class="card-body d-flex justify-content-between align-items-start">
          <div class="text-white">
            <div class="fw-bold">{{ item.name }}</div>
            <small class="d-block">Udløber om <strong>{{ daysLabel(item.expiresAt) }}</strong></small>
            <small>Antal: {{ item.qty }}</small>
          </div>
          <span class="dot" :class="badgeClass(dl(item.expiresAt))"></span>
        </div>
      </div>

      <p v-if="filtered.length === 0" class="text-muted mt-4">Ingen varer matcher “{{ query }}”.</p>

    </div>

</template>


<script>

import HeaderCard from './HeaderCard.vue';

export default {
    name: 'MyFridge',
    components: {
        HeaderCard,
    },

    data() {
        return {

            query: '',

            items: [
                { }
            ]



        }
    },

    computed: {
        
        heading() {
            return this.$route?.meta?.title || '';
        },
        subheading() {
            return this.$route?.meta?.subtitle || '';
        },

    },

}
</script>

<style scoped>

.search-wrap { 
    background:#fff; 
    border-radius:999px; 
    box-shadow:0 6px 16px rgba(0,0,0,.08); 
    width:100%;
    }

.search-wrap .form-control:focus { 
    box-shadow:none; 
    }

.item-card { 
    border:0; 
    border-radius:16px; 
    background:linear-gradient(135deg,#7CA982 0%, #A6C48A 100%); 
    }

.dot { 
    width:14px; 
    height:14px; 
    border-radius:50%; 
    box-shadow:0 0 0 2px rgba(255,255,255,.6); 
    }

.dot.danger { 
    background:#E02424; 
    } 
    
.dot.warning { 
    background:#F5B400; 
    } 
    
.dot.success { 
    background:#1FBF62; 
    }

</style>
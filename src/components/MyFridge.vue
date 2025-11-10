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

      <div v-for="group in groupedItems" 
      :key="group.name" 
      class="card item-card mb-3 shadow-sm"
      @click="goToGroup(group)"
      >

        <div class="card-body d-flex justify-content-between align-items-start">
            <div class="text-white">
            <div class="fw-bold">{{ group.name }}</div>
            <small class="d-block">Du har <strong>{{ group.count }}</strong> stk.</small>
            <small class="d-block">Udløber om: <strong>{{ daysLabel(group.earliest) }}</strong></small>
            </div>
            <span class="dot" :class="badgeClass(daysLeft(group.earliest))"></span>
        </div>
        </div>


      <p v-if="groupedItems.length === 0" class="text-muted mt-4">Ingen varer matcher “{{ query }}”.</p>

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
                { id: 1, name: 'Mælk', expiresAt: '2025-11-08', amount: 1, unit: 'Liter', location: 'Køleskab' },
                { id: 2, name: 'Mælk', expiresAt: '2025-11-17', amount: 2, unit: 'Liter', location: 'Køleskab' },
                { id: 3, name: 'Mælk', expiresAt: '2025-11-19', amount: 2, unit: 'Liter', location: 'Køleskab' },
                { id: 4, name: 'Rugbrød', expiresAt: '2025-11-11'},
                { id: 5, name: 'Kyllingebryst', expiresAt: '2025-11-13'},
            ],
        }
    },

    computed: {
        
        heading() {
            return this.$route?.meta?.title || '';
        },
        subheading() {
            return this.$route?.meta?.subtitle || '';
        },


        groupedItems() {

            // lav søgestrengen om til små bogstaver
            const q = (this.query || '').toLowerCase();

            // Filtrér først listen ud fra søgning
            const filtered = this.items.filter(x =>
                (x.name || '').toLowerCase().includes(q)
            );

            // Lav et "Map" hvor vi samler varer med samme navn
            const map = new Map();

            for (const item of filtered) {
                const key = (item.name || '').toLowerCase(); // navnet bruges som nøgle, fx “mælk”

                // Hvis der ikke findes en gruppe for navnet, opret én
                if (!map.has(key)) {
                map.set(key, {
                    name: item.name,   // navnet (fx Mælk)
                    entries: [],       // alle de mælk vi finder
                });
                }

                // tilføj varen til gruppen
                map.get(key).entries.push(item); 
            }

            // 3️⃣ Lav et array ud af grupperne
            const groups = Array.from(map.values()).map(group => {
                // find den tidligste udløbsdato i gruppen
                const earliest = group.entries
                .slice() // lav en kopi af arrayet
                .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt))[0]?.expiresAt; // sorter stigende og tag den første

                return {
                name: group.name,
                count: group.entries.length,  // hvor mange af denne type
                earliest: earliest,           // tidligste udløbsdato
                entries: group.entries,       // selve listen (skal bruges senere)
                };
            });

            // 4️⃣ Sortér grupperne så dem der udløber først kommer først
            return groups.sort(
                (a, b) => new Date(a.earliest) - new Date(b.earliest)
            );
            },


    },


    methods: {

        // Beregn antal dage til udløbsdato
        daysLeft(dateString) { // dateString = den dato, varen udløber
            const today = new Date(); // today = den dato, det er i dag
            const targetDate = new Date(dateString); // targetDate = den dato, varen udløber
            const diffTime = targetDate - today; // diffTime = forskellen i tid mellem i dag og udløbsdatoen (i millisekunder)
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Konverterer millisekunder til dage og runder op
        }, 

        daysLabel(dateString) { // Returnerer en tekst baseret på antal dage til udløbsdato
            const days = this.daysLeft(dateString);
            if (days < 0) return `${Math.abs(days)} dage siden`; // Math.abs = tager det positive tal af et negativt tal
            if (days === 0) return 'i dag';
            if (days === 1) return '1 dag';
            return `${days} dage`; 
        },

        badgeClass(days) { // Vælger farve baseret på antal dage til udløbsdato
            if (days < 3) return 'danger'; 
            if (days <= 4) return 'warning';
            return 'success';
        },

        goToGroup(group) {
            
            // gem gruppens varer (f.eks. alle mælk) i sessionStorage
            sessionStorage.setItem('groupEntries', JSON.stringify(group.entries));

            // naviger til ItemOverview og send gruppens navn som parameter
            this.$router.push({
                name: 'ItemOverview',
                params: {
                    name: group.name, // navn vises i URL, f.eks. /mitkoeleskab/Mælk
                }
            });
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
    background: linear-gradient(140deg,#1f3121  0%,#446847 100%);
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
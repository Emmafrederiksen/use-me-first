<template>

    <HeaderCard 
    
    @open-menu="openMenu"
    
    />

    <!-- Søge funktion -->
    <div class="d-flex align-items-center gap-2 mt-5 mx-4 mb-3">
      <div class="input-group search-wrap shadow rounded-5">
        <span class="input-group-text border-0"><i class="bi bi-search" aria-hidden="true"></i></span>
        <label class="visually-hidden" for="searchInput">Søg efter varer</label> <!-- bruges kun af skærmlæseren -->
        <input id="searchInput" v-model.trim="query" type="search" class="form-control border-0" placeholder="Søg efter varer" />
      </div>
      <button class="btn btn-white shadow rounded-3 px-3 border" aria-label="Åben filtermenu"><i class="bi bi-sliders2" aria-hidden="true"></i></button>
    </div>

    <!-- liste -->

    

    <div class="mt-5 mx-4">

      <div v-for="group in groupedItems" 
      :key="group.name" 
      class="card item-card mb-3 shadow-sm"
      @click="goToGroup(group)"
      role="button"
      tabindex="0"
      @keyup.enter="goToGroup(group)"
      >

        <div class="card-body d-flex justify-content-between align-items-start">
            <div class="text-white">
            <div class="fw-bold">{{ group.name }}</div>
            <small class="d-block">Antal: <strong>{{ group.count }}</strong></small>

            <small class="d-block">
            <template v-if="daysLeft(group.earliest) < 0">
                Udløbet for 
                <strong> 
                    {{ Math.abs(daysLeft(group.earliest)) }}     <!-- Math.abs = tager det positive tal af et negativt tal -->
                    {{ Math.abs(daysLeft(group.earliest)) === 1 ? 'dag' : 'dage' }}     
                </strong> 
                siden       
            </template>
            <template v-else-if="daysLeft(group.earliest) === 0">
                Udløber<strong>  i dag </strong>
            </template>
            <template v-else-if="daysLeft(group.earliest) === 1">
                Udløber <strong>i morgen</strong>
              </template>
            <template v-else>
                Udløber om <strong> {{ daysLeft(group.earliest) }} dage </strong>
            </template>
            </small>

            </div>
            <span class="dot" :class="badgeClass(daysLeft(group.earliest))" aria-hidden="true"></span>
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

    props: {
        openMenu: {
        type: Function,
        required: true,
        },
    },

    data() {
        return {

            query: '',
            items: [],
        }
    },

    // Henter varer fra localStorage når komponenten mountes (loader) og tilpasser data formatet
    mounted() {
  const storedItems = sessionStorage.getItem('allItems');
  const myFridgeItems = localStorage.getItem('myFridgeItems');

  let parsedAll = [];
  let parsedMyFridge = [];

  try {
    parsedAll = storedItems ? JSON.parse(storedItems) : [];
  } catch (e) {
    console.warn('Fejl ved parsing af allItems:', e);
  }

  try {
    parsedMyFridge = myFridgeItems ? JSON.parse(myFridgeItems) : [];
  } catch (e) {
    console.warn('Fejl ved parsing af myFridgeItems:', e);
  }

  // ✅ Nu kan du trygt kalde this.mapUnit / this.mapLocation
  const normalizedFridge = parsedMyFridge.map((it, idx) => ({
    id: it.id ?? `local-${idx}`,
    name: it.name || 'Ukendt vare',
    expiresAt: it.expiresAt ? new Date(it.expiresAt) : null,
    amount: it.amount ?? 1,
    unit: this.mapUnit(it.unit),
    location: this.mapLocation(it.location),
  }));

  // Kombiner
  this.items = [...parsedAll, ...normalizedFridge];
  this.items = Array.from(new Map(this.items.map(i => [i.id, i])).values());

  // Fallback testdata hvis alt er tomt
  if (this.items.length === 0) {
    this.items = [
      { id: 1, name: 'Mælk', expiresAt: '2025-11-20', amount: 1, unit: 'Liter', location: 'Køleskab' },
      { id: 2, name: 'Mælk', expiresAt: '2025-11-21', amount: 2, unit: 'Liter', location: 'Køleskab' },
      { id: 3, name: 'Mælk', expiresAt: '2025-11-23', amount: 1, unit: 'Liter', location: 'Køleskab' },
      { id: 4, name: 'Rugbrød', expiresAt: '2025-11-24', amount: 1, unit: 'Stk.', location: 'Køleskab' },
      { id: 5, name: 'Kyllingebryst', expiresAt: '2025-11-28', amount: 1, unit: 'Bakke(r)', location: 'Køleskab'},
      

    ];
  }

  // Gem så alt er synkroniseret
  sessionStorage.setItem('allItems', JSON.stringify(this.items));
  localStorage.setItem('fridgeItems', JSON.stringify(this.items));
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

        badgeClass(days) { // Vælger farve baseret på antal dage til udløbsdato
            if(days < 0 ) return 'expired';
            if (days < 3) return 'danger'; 
            if (days <= 4) return 'warning';
            return 'success';
        },

        goToGroup(group) {
            // Gemmer alle varer (entries) i denne gruppe i sessionStorage.
            // group.entries indeholder ALLE varer der har samme navn (f.eks. alle "Mælk").
            // Disse data læses senere i ItemOverview.vue når brugeren navigerer videre.
            sessionStorage.setItem('groupEntries', JSON.stringify(group.entries));

            // Navigerer til ItemOverview-ruten.
            // Vi sender gruppens navn som URL-parameter, så ItemOverview kan vise korrekt overskrift.
            this.$router.push({
                name: 'ItemOverview',    // Navnet på ruten vi vil navigere til
                params: { 
                    name: group.name     // F.eks. "Mælk" — bruges i UI og URL
                }
            });
        },

        mapUnit(unitId) {
            const units = {
                '1': 'Gram',
                '2': 'Bakke(r)',
                '3': 'Stk.',
                '4': 'Kilo',
                '5': 'Liter',
                '6': 'Pakke(r)',
            };
             if (Object.values(units).includes(unitId)) {
                return unitId;
            }
            return units[unitId] || '(enhed ikke angivet)';
        },
        mapLocation(locationId) {
            const locations = {
                '1': 'Køleskab',
                '2': 'Fryser',
                '3': 'Depot',
            };
            return locations[locationId] || 'Køleskab';
        },
    },


     watch: {
         items: {
         deep: true,                                                               // se ændringer inde i array/objekter
         handler(newVal) {                                                         // kør når items ændre sig
                                                                                   // Hver gang varer ændrer sig -> skriv til localStorage
             localStorage.setItem('fridgeItems', JSON.stringify(newVal));          // gem altid den nyeste liste
         }
        }
    }

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
.dot.expired {
    background: #000000;
}
.input-group-text {
    background-color: #ffffff;
}
.btn-white {
    background-color: #ffffff;
}
    
.dark-mode .form-control {
    background-color: #9c9c9c;
    border: 1px solid #444444;
}
.dark-mode .input-group-text, .dark-mode .i{
    background-color: #9c9c9c;
    color:#ffffff;
}
.dark-mode .btn-white {
    background-color: #9c9c9c;
    color: #ffffff;
}

.dark-mode .text-muted {
    color: #cccccc !important;
}
</style>
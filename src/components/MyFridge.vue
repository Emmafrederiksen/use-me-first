<template>

  <HeaderCard @open-menu="openMenu" />

  <div class="myfridge-wrapper">

    <!-- SEARCH ROW -->
    <div class="search-row">

      <div class="search-wrap">
        <i class="bi bi-search" aria-hidden="true"></i>
        <label class="visually-hidden" for="searchInput">Søg efter varer</label> <!-- bruges kun af skærmlæseren -->
        <input 
          id="searchInput"
          v-model.trim="query"
          type="search"
          placeholder="Søg efter varer"
        />
      </div>

      <button class="filter-btn" aria-label="Åben filtermenu">
        <i class="bi bi-sliders2" aria-hidden="true"></i>
      </button>

    </div>

    <!-- 📦 ITEM LIST -->
    <div class="items-wrapper">

      <div
        v-for="group in groupedItems"
        :key="group.name"
        class="item-card"
        @click="goToGroup(group)"
        role="button"
        tabindex="0"
        @keyup.enter="goToGroup(group)"
        
      >

        <div class="card-body">

          <div>
            <div class="fw-bold">{{ group.name }}</div>
            <small>Antal: <strong>{{ group.count }}</strong></small>

            <small class="d-block">
              <template v-if="daysLeft(group.earliest) < 0">
                Udløbet for
                <strong>
                  {{ Math.abs(daysLeft(group.earliest)) }}
                  {{ Math.abs(daysLeft(group.earliest)) === 1 ? 'dag' : 'dage' }}
                </strong>
                siden
              </template>

              <template v-else-if="daysLeft(group.earliest) === 0">
                Udløber <strong>i dag</strong>
              </template>

              <template v-else-if="daysLeft(group.earliest) === 1">
                Udløber <strong>i morgen</strong>
              </template>

              <template v-else>
                Udløber om
                <strong>{{ daysLeft(group.earliest) }} dage</strong>
              </template>
            </small>
          </div>

          <span class="dot" :class="badgeClass(daysLeft(group.earliest))" aria-hidden="true"></span>

        </div>
      </div>

      <p
        v-if="groupedItems.length === 0"
        class="empty-message"
      >
        Ingen varer matcher "{{ query }}".
      </p>

    </div>

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

/* -------------------------------------------------- */
/* WRAPPER — Samme spacing som AddItem / RecipeForm */
/* -------------------------------------------------- */

.myfridge-wrapper {
  margin: 3rem 1.5rem;
}

/* -------------------------------------------------- */
/* SEARCH BAR */
/* -------------------------------------------------- */

.search-row {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 2rem;
  margin-bottom: 1.5rem;
  animation: fadeInCard 0.45s ease;
}

.search-wrap {
  flex: 1;
  background: #ffffff;
  border-radius: 999px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  border: 1.8px solid #dadada;  
  transition: all 0.25s ease;
}

.search-wrap:hover {
    border-color: #678a69;  
}

.search-wrap:focus-within {
    border-color: #678a69;  
    box-shadow: 0 0 0 2px rgba(8,48,15,0.15);
}

.search-wrap i {
  font-size: 1.25rem;
  color: #08300f;
}

.search-wrap input {
  border: none;
  width: 100%;
  background: transparent;
  margin-left: 10px;
  outline: none;
  font-size: 1rem;
}

.search-wrap input::placeholder {
  color: #777;
}

/* FILTER BUTTON */
.filter-btn {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  box-shadow: 0 6px 16px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: 0.25s ease;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 22px rgba(0,0,0,0.20);
}

/* -------------------------------------------------- */
/* ITEM CARDS */
/* -------------------------------------------------- */

.items-wrapper {
  margin-top: 2rem;
}

.item-card {
  background: linear-gradient(140deg, #1f3121 0%, #446847 100%);
  border-radius: 22px;
  padding: 0;
  margin-bottom: 1.2rem;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(0,0,0,0.20);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  animation: fadeInCard 0.45s ease;
}

.item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 26px rgba(0,0,0,0.25);
}

.card-body {
  display: flex;
  justify-content: space-between;
  padding: 1.4rem 1.6rem;
}

/* Farve dot */
.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  margin-left: 14px;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.45);
}

.dot.expired { background: #000; }
.dot.danger  { background: #e02424; }
.dot.warning { background: #f5b400; }
.dot.success { background: #1fbf62; }

/* --------------------------------------------- */
/* EMPTY MESSAGE */
/* --------------------------------------------- */

.empty-message {
  font-size: 1rem;
  color: #777;
  margin-top: 2rem;
  text-align: start;
}

/* -------------------------------------------------- */
/* RESPONSIVE BREAKPOINTS — MATCHER ADDITEM/RECIPEFORM */
/* -------------------------------------------------- */

@media (min-width: 600px) {
  .myfridge-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
    margin-top: 3rem;
  }
}

@media (min-width: 992px) {
  .myfridge-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }
}

@media (min-width: 1400px) {
  .myfridge-wrapper {
    max-width: 85%;
    margin-top: 4rem;
  }
}

@media (min-width: 1800px) {
  .myfridge-wrapper {
    max-width: 80%;
    margin-top: 5rem;
  }
}

/* -------------------------------------------------- */
/* DARK MODE */
/* -------------------------------------------------- */

.dark-mode .search-wrap {
  background: #4a4a4a;
}

.dark-mode .search-wrap input {
  color: #ffffff;
}

.dark-mode .search-wrap input::placeholder {
  color: #dddddd;
}

.dark-mode .search-wrap i {
  color: #ffffff;
}

.dark-mode .filter-btn {
  background: #4a4a4a;
  color: #ffffff;
  border: 1px solid #666;
}

.dark-mode .item-card {
  background: linear-gradient(140deg, #1f3121 0%, #446847 100%);
  box-shadow: 0 10px 20px rgba(0,0,0,0.35);
}

.dark-mode .dot {
  box-shadow: 0 0 0 2px rgba(255,255,255,0.35);
}

.dark-mode .empty-message {
  color: #cccccc;
}

/* -------------------------------------------------- */
/* ANIMATIONS */
/* -------------------------------------------------- */

@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}


</style>
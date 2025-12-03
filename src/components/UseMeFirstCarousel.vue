<template>
  <div class="carousel-wrapper">
    <div class="d-flex justify-content-between align-items-center">
      <h2>Brug mig først</h2>
      <!-- desktop-pile -->
      <div class="d-none d-sm-flex align-items-center arrow-buttons">
        <button class="btn btn-light rounded-circle border" @click="scrollLeft" aria-label="Scroll venstre">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="btn btn-light rounded-circle border" @click="scrollRight" aria-label="Scroll højre">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="expiringSoon.length">
      <div class="usefirst-wrap">
        <div class="usefirst-track" ref="track">
          <div
            v-for="item in expiringSoon"
            :key="item.id"
            class="usefirst-card card shadow-sm"
            @click="$emit('open-product', item)"
          >
            <div class="card-body d-flex justify-content-between align-items-start">
              <div class="text-white">
                <div class="fw-bold">{{ item.name }}</div>

                <small class="d-block" v-if="daysLeft(item.expiresAt) < 0">
                  Udløbet for <strong>{{ Math.abs(daysLeft(item.expiresAt)) }} dage</strong> siden
                </small>
                <small class="d-block" v-else-if="daysLeft(item.expiresAt) === 0">
                  <strong>Udløber i dag</strong>
                </small>
                <small class="d-block" v-else-if="daysLeft(item.expiresAt) === 1">
                  Udløber <strong>i morgen</strong>
                </small>
                <small class="d-block" v-else>
                  Udløber om <strong>{{ daysLeft(item.expiresAt) }} dage</strong>
                </small>
              </div>

              <span class="dot" :class="badgeClass(daysLeft(item.expiresAt))"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <p v-else class="text-muted">Ingen varer udløber snart 🎉</p>
  </div>
</template>

<script>

export default {

  name: 'UseMeFirstCarousel',
  props: {
    // hvor mange dage der stadig regnes som “snart” (ikke-grøn)
    daysUntilExpiry: { 
        type: Number, 
        default: 4 
    },

    // max antal kort at vise
    maxVisibleItems: { 
        type: Number, 
        default: 10 
    },

    // (valgfrit) giv varer ind udefra i stedet for localStorage
    items: { 
        type: Array, 
        default: null 
    },
  },

  data() {
    return {
      localItems: [],
      selectedProduct: null,
      showModal: false,
    };
  },

  mounted() {
  if (!this.items) {
    const allItems = sessionStorage.getItem('allItems');
    const myFridgeItems = localStorage.getItem('myFridgeItems');
    const fridgeItems = localStorage.getItem('fridgeItems');

    const parsedAll = allItems ? JSON.parse(allItems) : [];
    const parsedMyFridge = myFridgeItems ? JSON.parse(myFridgeItems) : [];

    if(parsedAll.length === 0 && parsedMyFridge.length === 0) {
      this.localItems = fridgeItems ? JSON.parse(fridgeItems) : [];
      return;
    }

    // Kun normaliser items, hvis de ikke allerede er normaliserede
    const normalizedFridge = parsedMyFridge.map((it, idx) => ({
      id: it.id ?? `local-${idx}`,
      name: it.name || 'Ukendt vare',
      expiresAt: it.date || it.expiresAt || null, // tjek både 'date' og 'expiresAt'
      amount: it.amount ?? 1,
      unit: this.mapUnit(it.unit),
      location: this.mapLocation(it.location),
    }));

    // Undgå dubletter: brug Set eller uniqBy id
    const combined = [...parsedAll, ...normalizedFridge];
    const uniqueItems = Array.from(new Map(combined.map(i => [i.id, i])).values());

    this.localItems = uniqueItems;
  }
},

  computed: {

    sourceItems() {
      return this.items ?? this.localItems;
    },

    expiringSoon() {
      return this.sourceItems
        .slice()
        .sort((a,b) => new Date(a.expiresAt) - new Date(b.expiresAt))
        .filter(it => this.daysLeft(it.expiresAt) <= this.daysUntilExpiry)
        .slice(0, this.maxVisibleItems);
    },
  },


  methods: {

    daysLeft(d) {
      const today = new Date();
      const target = new Date(d);
      return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    },

    badgeClass(days) { // Vælger farve baseret på antal dage til udløbsdato
            if( days < 0 ) return 'expired';
            if (days < 3) return 'danger'; 
            if (days <= 4) return 'warning';
            return 'success';
        },

    mapUnit(unitCode) {
      switch (unitCode) {
        case "1": return "Gram";
        case "2": return "Bakke(r)";
        case "3": return "Stk.";
        case "4": return "Kilo";
        case "5": return "Liter";
        case "6": return "Pakke(r)";
        default: return "Ukendt enhed";
      }
    },

    mapLocation(locationCode) {
      switch (locationCode) {
        case "1": return "Køleskab";
        case "2": return "Fryser";
        case "3": return "Depot";
        default: return "Ukendt placering";
      }
    },

    scrollLeft() {
      const el = this.$refs.track;
      if (!el) return;
      el.scrollBy({ left: -280, behavior: 'smooth' });
    },

    scrollRight() {
      const el = this.$refs.track;
      if (!el) return;
      el.scrollBy({ left: 280, behavior: 'smooth' });
    },
  },

};

</script>

<style scoped>

.usefirst-wrap { 
    overflow: hidden; 
}

.usefirst-track {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 10px;
  -webkit-overflow-scrolling: touch;
}

.usefirst-card {
  min-width: 240px;
  scroll-snap-align: start;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(140deg,#1f3121 0%,#446847 100%);
}


.dot { 
  width:14px; height:14px; border-radius:50%;
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


/* ------------------------------ */
/*      BASE (mobile)             */
/* ------------------------------ */
.carousel-wrapper{
  margin: 3rem 1.5rem 0 1.5rem;
}

h2 {
  margin-bottom: 1rem;
}


/* ------------------------------ */
/* TABLET (≥ 600px)               */
/* ------------------------------ */
@media (min-width: 600px) {
  .carousel-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
  }

  .usefirst-card {
  min-width: 300px;
  font-size: 20px;
  padding-top: 10px;
  padding-bottom: 0.7rem;
  padding-left: 0.7rem;
  }

  .usefirst-track {
  gap: 18px;
  }

  h2 {
  margin-bottom: 1.4rem;
  }

  .arrow-buttons {
    margin-bottom: 1.4rem;
    gap: 0.5rem;
    font-size: 1.5rem;
  }
}

/* ------------------------------ */
/* LAPTOP (992px → 1399px)        */
/* MATCHER ALERT + HEADER (800px) */
/* ------------------------------ */
@media (min-width: 992px) and (max-width: 1399px) {
  .carousel-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  h2 {
  margin-bottom: 1.8rem;
  }

  .arrow-buttons {
    margin-bottom: 2.1rem;
    gap: 0.9rem;
    font-size: 1.5rem;
  }
  
}

/* ------------------------------ */
/* DESKTOP XL (≥ 1400px → 1799px) */
/* MATCHER HEADER (1100px)        */
/* ------------------------------ */
@media (min-width: 1400px) and (max-width: 1799px) {
  .carousel-wrapper {
    max-width: 85%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }
}

/* ------------------------------ */
/* ULTRAWIDE (≥ 1800px)           */
/* MATCHER ALERT (1400px)         */
/* ------------------------------ */
@media (min-width: 1800px) {
  .carousel-wrapper {
    max-width: 80%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 5rem;
  }
}



</style>

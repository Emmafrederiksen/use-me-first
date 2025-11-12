<template>
  <div class="mx-4 mt-5">
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h2 class="mb-1">Brug mig først</h2>
      <!-- desktop-pile -->
      <div class="d-none d-sm-flex align-items-center gap-2">
        <button class="btn btn-light btn-sm rounded-circle border" @click="scrollLeft" aria-label="Scroll venstre">
          <i class="bi bi-chevron-left"></i>
        </button>
        <button class="btn btn-light btn-sm rounded-circle border" @click="scrollRight" aria-label="Scroll højre">
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <div v-if="expiringSoon.length">
      <div class="usefirst-wrap">
        <div class="usefirst-track" ref="track">
          <div
            v-for="it in expiringSoon"
            :key="it.id"
            class="usefirst-card card shadow-sm"
          >
            <div class="card-body d-flex justify-content-between align-items-start">
              <div class="text-white">
                <div class="fw-bold">{{ it.name }}</div>

                <small class="d-block" v-if="daysLeft(it.expiresAt) < 0">
                  Udløbet for <strong>{{ Math.abs(daysLeft(it.expiresAt)) }} dage</strong> siden
                </small>
                <small class="d-block" v-else-if="daysLeft(it.expiresAt) === 0">
                  <strong>Udløber i dag</strong>
                </small>
                <small class="d-block" v-else-if="daysLeft(it.expiresAt) === 1">
                  Udløber <strong>i morgen</strong>
                </small>
                <small class="d-block" v-else>
                  Udløber om <strong>{{ daysLeft(it.expiresAt) }} dage</strong>
                </small>
              </div>

              <span class="dot" :class="badgeClass(daysLeft(it.expiresAt))"></span>
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
    };
  },

  mounted() {

    if (!this.items) {
      const saved = localStorage.getItem('fridgeItems');
      const allItems = sessionStorage.getItem('allItems');

      this.localItems = allItems ? JSON.parse(allItems) : (saved ? JSON.parse(saved) : []);
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
            if (days < 3) return 'danger'; 
            if (days <= 4) return 'warning';
            return 'success';
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
</style>

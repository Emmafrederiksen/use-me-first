<template>
  <HeaderCard

    :show-back="true"
    :title-override="itemName"
    :subtitle-override="subtitleText"

  />

  <!-- Liste over alle varer i denne gruppe -->
  <div class="mx-4 mt-5" v-if="sortedEntries.length">

    <!-- Ét kort pr. enhed i denne gruppe -->
    <div
      v-for="item in sortedEntries"
      :key="item.id"
      class="card item-card mb-3 shadow-sm"
    >
      <div class="card-body d-flex justify-content-between align-items-start">
        <div class="text-white">
          <div class="fw-bold">{{ item.name }}</div>
          <small class="d-block">Udløber om <strong>{{ daysLabel(item.expiresAt) }}</strong></small>
        </div>
        <span class="dot" :class="badgeClass(daysLeft(item.expiresAt))"></span>
      </div>
    </div>
  </div>

</template>

<script>

import HeaderCard from './HeaderCard.vue';

export default {

  name: 'ItemOverview',
  components: { HeaderCard }, 

  // fordi ruten har props:true i routeren
  props: { 
    name: { 
        type: String, 
        default: '' 
    } 
 },

  data() {
    // læs gruppens entries (sat i MyFridge.goToGroup)
    const entries = JSON.parse(sessionStorage.getItem('groupEntries') || '[]');
    return {
      entries,
      itemName: this.name || this.$route.params.name || '',
    };
  },


  computed: {

    // sorter entries efter udløbsdato (nærmeste først)
    sortedEntries() {
      return this.entries.slice() // slice() laver en kopi af arrayet, så vi ikke ændrer originalen
      .sort((a, b) => new Date(a.expiresAt) - new Date(b.expiresAt)); // sorter stigende efter udløbsdato
    },

    // samlet antal items i denne gruppe
    totalCount() {
      return this.sortedEntries.length; 
    },

    // tekst til underoverskriften
    subtitleText () {
        return `Du har ${this.totalCount} stk. ${this.itemName.toLowerCase()} i køleskabet. Brug den øverste først.`; 
    }
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
    
  },
};
</script>

<style scoped>


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

<template>
  <HeaderCard

    :show-back="true"
    :title-override="itemName"
    :subtitle-override="subtitleText"
    @open-menu="openMenu"

  />

  <!-- Liste over alle varer i denne gruppe -->
  <div class="mx-4 mt-5" v-if="sortedEntries.length">

    <!-- Ét kort pr. enhed i denne gruppe -->
    <div
      v-for="item in sortedEntries"
      :key="item.id"
      class="card item-card mb-3 shadow-sm"
    >
      <div class="card-body d-flex justify-content-between align-items-start" v-on:click="openProductModal(item)">
        <div class="text-white">
          <div class="fw-bold">{{ item.name }}</div>

          <small class="d-block">
              <template v-if="daysLeft(item.expiresAt) < 0">
                Udløbet for 
                    <strong>
                      {{ Math.abs(daysLeft(item.expiresAt)) }}          <!-- Math.abs = tager det positive tal af et negativt tal -->
                      {{ Math.abs(daysLeft(item.expiresAt)) === 1 ? 'dag' : 'dage' }}
                    </strong> 
                    siden          
              </template>
              <template v-else-if="daysLeft(item.expiresAt) === 0">
                Udløber<strong> i dag</strong>
              </template>
              <template v-else-if="daysLeft(item.expiresAt) === 1">
                Udløber <strong>i morgen</strong>
              </template>
              <template v-else>
                Udløber om <strong>{{ daysLeft(item.expiresAt) }} dage</strong>
              </template>
          </small>
           
        </div>
        <span class="dot" :class="badgeClass(daysLeft(item.expiresAt))" aria-hidden="true"></span>
      </div>
    </div>
  </div>
  
  <ProductModal 
        v-if="selectedProduct && showModal" 
        v-bind:visible="showModal" 
        v-bind:product="selectedProduct" 
        v-on:close="showModal = false"
        v-on:delete-product="deleteProduct"
        v-on:update-product="updateProduct"
    />

</template>

<script>

import HeaderCard from './HeaderCard.vue';
import ProductModal from './ProductModal.vue';

export default {

  name: 'ItemOverview',
  components: { HeaderCard, ProductModal }, 

  // fordi ruten har props:true i routeren
  props: { 
    name: { 
        type: String, 
        default: '' 
    }, 
    
    openMenu: {
      type: Function,
      required: true,
    },
 },
 

  data() {
    // læs gruppens entries (sat i MyFridge.goToGroup)
    const entries = JSON.parse(sessionStorage.getItem('groupEntries') || '[]');
    return {
      entries,
      itemName: this.name || this.$route.params.name || '',
      selectedProduct: null,
      showModal: false,
    };
  },

  updated() {    
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
        return `Du har ${this.totalCount} ${this.itemName.toLowerCase()} i køleskabet. Brug den øverste først.`; 
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

        badgeClass(days) { // Vælger farve baseret på antal dage til udløbsdato
            if( days < 0 ) return 'expired';
            if (days < 3) return 'danger'; 
            if (days <= 4) return 'warning';
            
            return 'success';
        },
        openProductModal(item) {
            this.selectedProduct = item;
            this.showModal = true;
        },
        deleteProduct(id) {
          // 1: Hent allItems fra sessionStorage
          const allItems = JSON.parse(sessionStorage.getItem('allItems') || '[]');
          const myFridgeItems = JSON.parse(localStorage.getItem('myFridgeItems') || '[]');

          // 2: Fjern produkt fra allItems og gem tilbage i sessionStorage
          const updatedAll = allItems.filter(item => item.id !== id);
          const updatedMyFridge = myFridgeItems.filter(item => item.id !== id);
          sessionStorage.setItem('allItems', JSON.stringify(updatedAll));
          localStorage.setItem('myFridgeItems', JSON.stringify(updatedMyFridge));

          // 3: Opdater lokal entries
          this.entries = this.entries.filter(item => item.id !== id);

          // 4: Gem ny groupEntries
          sessionStorage.setItem('groupEntries', JSON.stringify(this.entries));
          localStorage.setItem('myFridgeItems', JSON.stringify(this.entries));
        },
          formatProductForStorage(product) {
            return {
              ...product,
              unitName: product.unitId,
              locationName: product.locationId,
          };
      },  
        updateProduct(updatedProduct) {
    // 1: Opdater entries lokalt
    const index = this.entries.findIndex(item => item.id === updatedProduct.id);
    if (index !== -1) {
      this.entries.splice(index, 1, updatedProduct);
      this.selectedProduct = updatedProduct;
    }

    // 2: Formatér produkt til gemning
    const formattedProduct = this.formatProductForStorage(updatedProduct);

    // 3: Gem entries i sessionStorage og localStorage
    const updatedEntries = this.entries.map(item => this.formatProductForStorage(item));
    sessionStorage.setItem('groupEntries', JSON.stringify(updatedEntries));
    localStorage.setItem('myFridgeItems', JSON.stringify(updatedEntries));

    // 4: Opdater allItems
    const allItems = JSON.parse(sessionStorage.getItem('allItems') || '[]');
    const allIndex = allItems.findIndex(item => item.id === updatedProduct.id);
    if (allIndex !== -1) {
      allItems.splice(allIndex, 1, formattedProduct);
      sessionStorage.setItem('allItems', JSON.stringify(allItems));
    }
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
};
</script>

<style scoped>


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

</style>

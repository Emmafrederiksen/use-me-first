<template>

  <HeaderCard
    :show-back="true"
    :title-override="itemName"
    :subtitle-override="subtitleText"
    @open-menu="openMenu"
  />

  <div class="itemoverview-wrapper">

    <!-- LISTE OVER ENKELTE VARER I GRUPPEN -->
    <div class="items-wrapper" v-if="sortedEntries.length">

      <div
        v-for="item in sortedEntries"
        :key="item.id"
        class="item-card"
        @click="openProductModal(item)"
      >

        <div class="card-body">

          <div>
            <div class="fw-bold">{{ item.name }}</div>

            <small class="d-block">
              <template v-if="daysLeft(item.expiresAt) < 0">
                Udløbet for
                <strong>
                  {{ Math.abs(daysLeft(item.expiresAt)) }}
                  {{ Math.abs(daysLeft(item.expiresAt)) === 1 ? 'dag' : 'dage' }}
                </strong>
                siden
              </template>

              <template v-else-if="daysLeft(item.expiresAt) === 0">
                Udløber <strong>i dag</strong>
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

    <!-- Empty message -->
    <p v-else class="empty-message">
      Der er ingen varer i denne kategori.
    </p>

  </div>

  <ProductModal
    v-if="selectedProduct && showModal"
    :visible="showModal"
    :product="selectedProduct"
    @close="showModal = false"
    @delete-product="deleteProduct"
    @update-product="updateProduct"
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

/* --------------------------------------------- */
/* WRAPPER — samme som MyFridge */
/* --------------------------------------------- */

.itemoverview-wrapper {
  margin: 3rem 1.5rem;
}

/* Container til liste */
.items-wrapper {
  margin-top: 2rem;
}


/* --------------------------------------------- */
/* ITEM CARDS */
/* --------------------------------------------- */

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


/* --------------------------------------------- */
/* DOT STATUS */
/* --------------------------------------------- */

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
  margin-top: 2rem;
  color: #777;
}


/* --------------------------------------------- */
/* RESPONSIVE BREAKPOINTS */
/* --------------------------------------------- */

@media (min-width: 600px) {
  .itemoverview-wrapper {
    margin-left: 3rem;
    margin-right: 3rem;
    margin-top: 3rem;
  }
}

@media (min-width: 992px) {
  .itemoverview-wrapper {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }
}

@media (min-width: 1400px) {
  .itemoverview-wrapper {
    max-width: 85%;
    margin-top: 4rem;
  }
}

@media (min-width: 1800px) {
  .itemoverview-wrapper {
    max-width: 80%;
    margin-top: 5rem;
  }
}


/* --------------------------------------------- */
/* DARK MODE */
/* --------------------------------------------- */

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


/* --------------------------------------------- */
/* ANIMATION */
/* --------------------------------------------- */

@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

</style>

<template>
  <div id="app" :class="{'no-scroll': showMenu}">

    <!-- SLIDE-IN MENMENU -->
    <SlideMenu 
      :visible="showMenu" 
      @close="closeMenu"
    />

    <!-- SIDEINDHOLD -->
    <main>
      <!-- SEND openMenu videre til SIDERNE -->
      <router-view :openMenu="openMenu" />
    </main>


    <!-- BUNDMENU (kun mobil) -->
    <NavBar />
  </div>
</template>


<script>
import SlideMenu from '@/components/SlideMenu.vue';
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'App',

  components: {
    SlideMenu,
    NavBar,
  },

  data() {
    return {
      showMenu: false,
    };
  },

  methods: {
    openMenu() {
      this.showMenu = true;
      document.body.classList.add('no-scroll');
    },
    closeMenu() {
      this.showMenu = false;
      document.body.classList.remove('no-scroll');
    }
  }
};
</script>



<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

#app {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  background-color: #FEFBF6;
  min-height: 100vh;
  padding-bottom: 3rem; /* plads til mobil-navbar */

}

/* Når dark mode er slået til */
body.dark-mode {
  background-color: #2c2c2c;
}

body.dark-mode #app {
  background-color: #2c2c2c;
}

@media (min-width: 600px) {
  #app {
    padding-bottom: 1rem;
  }
}

.no-scroll {
  overflow: hidden;
  height: 100vh;
}


/* ======================================= */
/*        ELEGANT ORANGE TOAST DESIGN       */
/* ======================================= */

.Toastify__toast {
  border-radius: 18px !important;
  padding: 14px 18px !important;
  font-size: 1rem !important;
  font-weight: 500;

  background: #fffaf4 !important;      
  color: #2c2c2c !important;            

  border-left: 6px solid #f27405 !important; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.12) !important;

  display: flex !important;
  align-items: center !important;
}

/* Ikonfarve */
.Toastify__toast-icon svg {
  fill: #f27405 !important;
}

/* Luk-knap */
.Toastify__close-button {
  color: #2c2c2c !important;
  opacity: 0.7 !important;
  font-size: 1.2rem !important;
}

.Toastify__close-button:hover {
  opacity: 1 !important;
  color: #f27405 !important;
}

/* Slide-in animation */
.Toastify__toast--enter {
  animation: toastSlideIn 0.35s ease forwards;
}

@keyframes toastSlideIn {
  from { transform: translateY(-12px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}


/* ======================================= */
/*               DARK MODE                 */
/* ======================================= */

body.dark-mode .Toastify__toast {
  background: #2e2e2e !important;
  color: #ffffff !important;
  border-left: 6px solid #ffa349 !important; 
  box-shadow: 0 10px 26px rgba(0,0,0,0.35) !important;
}

body.dark-mode .Toastify__toast-icon svg {
  fill: #ffa349 !important;
}

body.dark-mode .Toastify__close-button {
  color: #fff !important;
}


/* ======================================= */
/*               RESPONSIVE                */
/* ======================================= */

@media (min-width: 600px) {
  .Toastify__toast {
    max-width: 420px !important;
    margin: 0 auto !important;
  }
}

@media (min-width: 992px) {
  .Toastify__toast {
    font-size: 1.125rem;
    padding: 16px 22px !important;
    max-width: 460px !important;
  }
}


</style>

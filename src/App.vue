<template>
  <div id="app">

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
    },
    closeMenu() {
      this.showMenu = false;
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
  padding-bottom: 2rem; /* plads til mobil-navbar */
}
</style>

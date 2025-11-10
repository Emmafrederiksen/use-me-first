<template>
  <main>
    <router-view></router-view>
  </main>
  <NavBar />
</template>


<script>

import NavBar from './components/NavBar.vue';

export default {

  name: 'App',

  components: {
    NavBar,    
  },

}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');


#app {
  font-family: 'Inter', sans-serif;
  margin: 0 auto;
  background-color: #FEFBF6;
  min-height: 100vh;
  padding-bottom: 2rem;
}
</style>

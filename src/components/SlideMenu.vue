<template>
  <div class="overlay" v-if="visible" @click="$emit('close')">
    <aside class="menu" @click.stop>
      
      <button class="close-btn" @click="$emit('close')">
        <i class="bi bi-x-lg"></i>
      </button>

        <nav>
            <router-link to="/" class="pt-5" @click="$emit('close')">
                <i class="bi bi-house"></i> Forside
            </router-link>

            <router-link to="/opskrifter" :class="{ 'router-link-active': $route.path.startsWith('/opskrift') }" @click="$emit('close')">
                <i class="bi bi-fork-knife"></i> Opskrifter
            </router-link>

            <router-link to="/indtast" @click="$emit('close')">
                <i class="bi bi-plus-circle"></i> Tilføj varer
            </router-link>

            <router-link to="/mitkoeleskab" :class="{ 'router-link-active': $route.path.startsWith('/mitkoeleskab') }" @click="$emit('close')">
                <i class="bi bi-file-post"></i> Mit køleskab
            </router-link>

            <router-link to="/indkoebsliste" @click="$emit('close')">
                <i class="bi bi-pencil-square"></i> Indkøbsliste
            </router-link>
        </nav>


    </aside>
  </div>
</template>


<script>
export default {
  name: "SlideMenu",

  props: {
    visible: {
      type: Boolean,
      required: true
    }
  }
};
</script>


<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
 
  z-index: 2000 !important;
}

.menu {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 280px;
  background: #1f3121;
  padding: 2rem 1.5rem;
  box-shadow: -4px 0 12px rgba(0,0,0,0.2);
  animation: slideIn 0.25s ease forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

nav {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

nav a {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  font-size: 1.4rem;
  text-decoration: none;
  font-weight: 300;
  transition: 0.25s ease;
}

nav a i {
  font-size: 1.6rem;
  transition: 0.25s ease;
}

nav a:hover {
  color: #F27405;
}

nav a:hover i {
  transform: scale(1.2);
  color: #F27405;
}

/* Aktiv rute */
.router-link-active {
  color: #F27405 !important;
  font-weight: 500;
}

.router-link-active i {
  color: #F27405 !important;
  transform: scale(1.2);
}


.close-btn {
  background: transparent;
  border: none;
  position: absolute;
  right: 1rem;
  top: 1rem;
  color: white;
  font-size: 1.8rem;
}

.close-btn:hover {
    color: #F27405;
    transform: scale(1.2);
    transition: 0.25s ease;
}

</style>

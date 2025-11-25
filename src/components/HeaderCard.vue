<template>
  <section class="header-card pt-5 pb-5 px-4">
    <div class="d-flex align-items-center justify-content-between">
  <!-- VENSTRE SIDE: tilbagepil + titel -->
  <div class="d-flex align-items-center">
    <button
      v-if="showBack"
      @click="$router.back()"
      class="back-btn me-3"
    >
      <i class="bi bi-arrow-left-circle fs-1 text-white"></i>
    </button>

    <h1 class="title mb-1">{{ heading }}</h1>
  </div>

  <!-- HØJRE SIDE: admin ikon -->
  <button
    v-if="showAdminIcon"
    @click="$emit('open-admin-login')"
    class="admin-icon-btn"
  >
    <i class="bi bi-person-lock"></i>
  </button>
</div>


    <p class="subtitle mb-0">{{ subheading }}</p>
    
  </section>
</template>




<script>

export default {
    name: 'HeaderCard',

    props: {
        titleOverride: {
            type: String,
            default: '',
        },
        subtitleOverride: {
            type: String,
            default: '',
        },

        showBack: {
            type: Boolean, 
            default: false,
        },

        showAdminIcon: {      
          type: Boolean,
          default: false,
        },
    },

    computed: {
        heading() {
            // Brug override først, ellers :name, ellers meta.title
            return this.titleOverride || this.$route?.params?.name || this.$route?.meta?.title || '';
        },
        subheading() {
            // Brug override først, ellers meta.subtitle
            return this.subtitleOverride || this.$route?.meta?.subtitle || '';
        },
    },

}

</script>


<style scoped>

    .header-card {
        background: linear-gradient(140deg,#1f3121  0%,#446847 100%);
        width: 100%;
        color: white;
        text-align: start;   
        border-bottom-left-radius: 25px;
        border-bottom-right-radius: 25px;
        box-shadow: 0.5rem 0.5rem 1rem rgba(0, 0, 0, 0.1);
        font-family: 'Inter', sans-serif;
    }

    .header-card h1 {
        margin: 0;
        font-size: 26px;
        font-weight: 700;
    }

    .header-card p {
        margin: 0.5rem 0 0 0;
        font-size: 16px;
        font-weight: 400;
    }

    .title { 
        margin:0; 
        font-size:2rem; 
        font-weight:700; 
    }
    
    .subtitle { 
        margin:.5rem 0 0; 
        font-size:1rem; 
        font-weight:300; 
    }


    .back-btn {
    background: transparent;
    border: none; 
    transition: all 0.2s ease;
    }


    .admin-icon-btn {
    background: #fff;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.30);
  }

  .admin-icon-btn i {
    color: #F27405;
    font-size: 1.4rem;
  }



 

</style>
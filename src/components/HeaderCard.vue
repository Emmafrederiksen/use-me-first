<template>
  <section class="header-card pt-5 pb-5 px-4">
    <div class="d-flex align-items-start">
      <!-- Tilbagepil ud for overskriften -->
      <button
        v-if="showBack"
        class="btn  rounded-circle border me-3 mt-1"
        @click="$router.back()"
        style="width:40px; height:40px;"
      >
        <i class="bi bi-arrow-left"></i>
      </button>

      <div>
        <h1 class="title mb-1">{{ heading }}</h1>
        
      </div>
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

  .btn {
  background: white;
  color: #4b4b4b;
  border: none;
  transition: background 0.2s ease;
}

.btn:hover {
  background: #f1f1f1;
}

</style>
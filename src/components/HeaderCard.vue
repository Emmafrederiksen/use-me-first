<template>
    <section class="header-card pt-5 pb-5">
        <h1 class="title"> {{ heading }}</h1>
        <p class="subtitle"> {{ subheading }}</p>
    </section>
</template>


<script>

export default {
    name: 'HeaderCard',
    computed: {
        heading() {
            return this.$route?.meta?.title || '';
        },
        subheading() {
            return this.$route?.meta?.subtitle || '';
        }
    }
}

</script>


<style scoped>

    .header-card {
        background: linear-gradient(90deg,#A6C48A  0%,#7CA982 100%);
        padding: 1.5rem;
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
        font-size: 2rem;
        font-weight: 700;
    }

    .header-card p {
        margin: 0.5rem 0 0 0;
        font-size: 1rem;
        font-weight: 300;
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


</style>
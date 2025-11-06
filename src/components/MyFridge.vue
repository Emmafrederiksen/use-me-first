<template>
    <HeaderCard />
</template>


<script>

import HeaderCard from './HeaderCard.vue';

export default {
    name: 'MyFridge',
    components: {
        HeaderCard,
    },
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
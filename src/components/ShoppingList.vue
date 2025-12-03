<template>
    <HeaderCard 
    
    @open-menu="openMenu"
    
    />
</template>

<script>

import HeaderCard from './HeaderCard.vue';

export default {

    name: 'ShoppingList',

    components: {
        HeaderCard,
    },  
    
    props: {
        openMenu: {
        type: Function,
        required: true,
        },
    },
}
</script>
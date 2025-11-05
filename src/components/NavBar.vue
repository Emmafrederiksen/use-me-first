<template>
    <header>
        <nav>
            <ul>
                <li>
                    <router-link to="/overview">OverView</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>



<style scoped>
    header {
        background-color: #42b983;
        padding: 1rem;
        color: white;
    }

    nav ul {
        list-style: none;
        display: flex;
        gap: 1rem;
        padding: 0;
        margin: 0;
    }

    nav a {
        color: white;
        text-decoration: none;
    }

    nav a.router-link-active {
        font-weight: bold;
        text-decoration: underline;
    }
</style>
<template>
    <header class="fixed-bottom" role="navigation" aria-label="Hovedmenu">
        <nav>
            <ul>
                <li>
                    <router-link to="/"> <i class="bi bi-house d-flex justify-content-center nav-icon py-1" aria-hidden="true"></i> Forside</router-link>
                </li>
                <li>  
                    <router-link to="/opskrifter" v-bind:class="{ 'router-link-active': $route.path.startsWith('/opskrift') }"> <i class="bi bi-fork-knife d-flex justify-content-center nav-icon py-1" aria-hidden="true"></i> Opskrifter</router-link>
                </li>
                <li>
                    <router-link to="/indtast"> <i class="bi bi-plus-circle d-flex justify-content-center nav-icon py-1" aria-hidden="true"></i> Tilføj varer</router-link>
                </li>
                <li>
                    <router-link to="/mitkoeleskab" v-bind:class="{ 'router-link-active': $route.path.startsWith('/mitkoeleskab') }" > <i class="bi bi-file-post d-flex justify-content-center nav-icon py-1" aria-hidden="true"></i> Mit køleskab</router-link>
                </li>
                <li>
                    <router-link to="/indkoebsliste"><i class="bi bi-pencil-square d-flex justify-content-center nav-icon py-1" aria-hidden="true"></i> Indkøbsliste</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>



<style scoped>
    header {
        background: linear-gradient(140deg,#1f3121  0%,#446847 100%);
        padding: 1rem;
        width: 100;
        z-index: 999;
        color: white;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-top-left-radius: 25px;
        border-top-right-radius: 25px;
        box-shadow: 0.5rem -0.5rem 1rem rgba(0, 0, 0, 0.1);
        font-size: 12px;
        font-family: 'Inter', sans-serif;
    
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
        font-weight:300;
        transition: color 0.25s;
    }
    nav a .nav-icon {
        font-size: 1.5rem;
        transition: transform .25s ease, color 0.25s ease;
    }

    nav a.router-link-active {
        font-weight:600;
        color: #F27405;
    }
    nav a.router-link-active .nav-icon {
        transform: scale(1.3);
        color: #F27405;
    }

    @media (min-width: 768px) {
    header {
        display: none;
    }
}

</style>
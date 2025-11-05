<template>
    <header class="fixed-bottom" role="navigation" aria-label="Hovedmenu">
        <nav>
            <ul>
                <li>
                    <router-link to="/"> <i class="bi bi-house d-flex justify-content-center nav-icon py-1"></i> Forside</router-link>
                </li>
                <li>
                    <router-link to="/opskrifter"> <i class="bi bi-fork-knife d-flex justify-content-center nav-icon py-1"></i> Opskrifter</router-link>
                </li>
                <li>
                    <router-link to="/indtast"> <i class="bi bi-plus-circle d-flex justify-content-center nav-icon py-1"></i> Indtast varer</router-link>
                </li>
                <li>
                    <router-link to="/mitkøleskab"> <i class="bi bi-file-post d-flex justify-content-center nav-icon py-1"></i> Mit køleskab</router-link>
                </li>
                <li>
                    <router-link to="/indkøbsliste"><i class="bi bi-pencil-square d-flex justify-content-center nav-icon py-1"></i> Indkøbsliste</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>



<style scoped>
    header {
        background: linear-gradient(90deg,#A6C48A  0%,#7CA982 100%);
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
        font-weight:200;
        transition: color 0.25s;
    }
    nav a .nav-icon {
        font-size: 1.5rem;
        transition: transform .25s ease, color 0.25s ease;
    }

    nav a.router-link-active {
        font-weight:800;
        color: #08300F;
    }
    nav a.router-link-active .nav-icon {
        transform: scale(1.3);
        color: #08300F;
    }
</style>
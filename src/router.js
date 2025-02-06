import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import Clientes from './views/Clientes.vue'
import Produtos from './views/Produtos.vue'
import Vendas from './views/Vendas.vue'

const routes = [
    {
        path: '/',
        name: "Home",
        component: Home,
    },
    {
        path: '/clientes',
        name: "Clientes",
        component: Clientes,
    },
    {
        path: '/produtos',
        name: "Produtos",
        component: Produtos,
    },
    {
        path: '/vendas',
        name: "Vendas",
        component: Vendas,
    },
];

const router = createRouter({
    history: createWebHistory(), 
    routes,
})

export default router
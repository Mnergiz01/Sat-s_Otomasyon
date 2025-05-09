import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import App from '@/App.vue';

// Views
import ProductsView from '@/views/ProductsView.vue';
import TablesView from '@/views/TablesView.vue';
import CartView from '@/views/CartView.vue';
import ProductManagementView from '@/views/ProductManagementView.vue';
import TableManagementView from '@/views/TableManagementView.vue';

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: ProductsView },
    { path: '/tables', component: TablesView },
    { path: '/cart', component: CartView },
    { path: '/admin/products', component: ProductManagementView },
    { path: '/admin/tables', component: TableManagementView }
  ]
});

// Create Pinia store
const pinia = createPinia();

// Create app
const app = createApp(App);
app.use(router);
app.use(pinia);

app.mount('#app');
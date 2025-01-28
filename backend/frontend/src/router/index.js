import { createRouter, createWebHistory } from 'vue-router';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
//import OrdersView from '../views/OrdersView.vue';
//import CartView from '../views/CartView.vue';

const routes = [
  { path: '/products', component: ProductsView },
  { path: '/products/:id', component: ProductDetailView }
 // { path: '/orders', component: OrdersView },
 // { path: '/cart', component: CartView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

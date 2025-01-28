import { createRouter, createWebHistory } from 'vue-router';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CartView from '../views/CartView.vue';
import OrdersView from '../views/OrdersView.vue';
import OrderDetailView from '../views/OrderDetailView.vue';

const routes = [
  { path: '/products', component: ProductsView },
  { path: '/products/:id', component: ProductDetailView },
  { path: '/cart', component: CartView },
  { path: '/orders', component: OrdersView },
  { path: '/order/:id', component: OrderDetailView }, // Add route for order details
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

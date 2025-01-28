import { createRouter, createWebHistory } from 'vue-router';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CartView from '../views/CartView.vue';
import OrdersView from '../views/OrdersView.vue';
import OrderDetailView from '../views/OrderDetailView.vue';
import EditProductView from '../views/EditProductView.vue';

const routes = [
  { path: '/products', component: ProductsView },
  { path: '/products/:id', component: ProductDetailView },
  { path: '/cart', component: CartView },
  { path: '/orders', component: OrdersView },
  { path: '/order/:id', component: OrderDetailView },
  { path: '/edit-product/:id', component: EditProductView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

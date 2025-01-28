import { createRouter, createWebHistory } from 'vue-router';
import ProductsView from '../views/ProductsView.vue';
import ProductDetailView from '../views/ProductDetailView.vue';
import CartView from '../views/CartView.vue';
import OrdersView from '../views/OrdersView.vue';
import OrderDetailView from '../views/OrderDetailView.vue';
import EditProductView from '../views/EditProductView.vue';
import OrderApprovalView from '../views/OrderApprovalView.vue';

const routes = [
  { path: '/products', component: ProductsView },
  { path: '/products/:id', component: ProductDetailView },
  { path: '/cart', component: CartView },
  { path: '/orders', component: OrdersView },
  { path: '/orders/:id', component: OrderDetailView },
  { path: '/edit-product/:id', component: EditProductView },
  { path: '/orders/:id/approval', component: OrderApprovalView }, // Updated route for order approval
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

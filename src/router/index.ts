import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import ProductDetailsPage from '../pages/ProductDetailsPage.vue';
import CartPage from '../pages/CartPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/products/:id',
    name: 'ProductDetails',
    component: ProductDetailsPage,
    props: true,
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

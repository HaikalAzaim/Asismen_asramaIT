// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/components/HomeView.vue';
import TambahBarang from '@/components/TambahBarang.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/post', component: TambahBarang }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

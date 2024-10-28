// src/router/index.js
import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import { createRouter, createWebHistory } from "vue-router";

import Categories from "../pages/Categories.vue";
import CreateCategory from '@/pages/CreateCategory.vue';
import DetailCategory from '@/pages/DetailCategory.vue';
import EditCategory from '@/pages/EditCategory.vue';
import DeleteCategory from '../pages/DeleteCategory.vue';

import Products from '../pages/Products.vue';
import CreateProduct from '@/pages/CreateProduct.vue';
// import DetailProduct from '@/pages/DetailProduct.vue';
// import EditProduct from '@/pages/EditProduct.vue';
import DeleteProduct from '../pages/DeleteProduct.vue';

const routes = [
  { path: "/", redirect: "/login" },
  
  { path: "/login", component: Login },
  { path: "/register", component: Register },

  { path: "/categories", component: Categories },
  { path: '/create-category', component: CreateCategory },
  { path: '/categories/:id', component: DetailCategory },
  { path: '/categories/edit/:id', component: EditCategory },
  { path: '/categories/delete/:id', component: DeleteCategory },

  { path: "/products", component: Products },
  { path: '/create-product', component: CreateProduct },
  // { path: '/products/:id', component: DetailProduct },
  // { path: '/products/edit/:id', component: EditProduct },
  { path: '/products/delete/:id', component: DeleteProduct },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

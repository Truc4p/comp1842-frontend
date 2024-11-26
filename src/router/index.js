// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import Logout from "@/pages/Logout.vue";

import PublicPage from "@/pages/PublicPage.vue";
import AdminPage from "@/pages/admin/AdminPage.vue";
import CustomerPage from "@/pages/customer/CustomerPage.vue";

import Categories from "../pages/admin/Categories.vue";
import CreateCategory from '@/pages/admin/CreateCategory.vue';
import DetailCategory from '@/pages/admin/DetailCategory.vue';
import EditCategory from '@/pages/admin/EditCategory.vue';
import DeleteCategory from '../pages/admin/DeleteCategory.vue';

import Products from '../pages/admin/Products.vue';
import CreateProduct from '@/pages/admin/CreateProduct.vue';

import DetailProduct from '@/pages/customer/DetailProduct.vue';
// import EditProduct from '@/pages/EditProduct.vue';
import DeleteProduct from '../pages/admin/DeleteProduct.vue';

const routes = [
  { path: "/", redirect: "/public-page" },

  { path: "/public-page", component: PublicPage },
  { path: "/admin/admin-page", component: AdminPage },
  { path: "/customer/customer-page", component: CustomerPage },
  
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/logout", component: Logout },

  { path: "/admin/categories", component: Categories },
  { path: '/create-category', component: CreateCategory },
  { path: '/categories/:id', component: DetailCategory },
  { path: '/categories/edit/:id', component: EditCategory },
  { path: '/categories/delete/:id', component: DeleteCategory },

  { path: "/admin/products", component: Products },
  { path: '/create-product', component: CreateProduct },
  { path: '/products/:id', component: DetailProduct },
  // { path: '/products/edit/:id', component: EditProduct },
  { path: '/products/delete/:id', component: DeleteProduct },

  { path: "/customer/products", component: Products },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

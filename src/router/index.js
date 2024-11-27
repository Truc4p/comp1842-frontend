import { createRouter, createWebHistory } from "vue-router";
import { getUserRole } from '../utils/auth';

import Login from "@/pages/public/Login.vue";
import Register from "@/pages/public/Register.vue";
import Logout from "@/pages/public/Logout.vue";
import PublicPage from "@/pages/public/PublicPage.vue";
import PublicLayout from "@/layout/PublicLayout.vue";

import AdminLayout from "@/layout/AdminLayout.vue";
import AdminPage from "@/pages/admin/AdminPage.vue";
import CustomerPage from "@/pages/customer/CustomerPage.vue";

import Categories from "@/pages/admin/Categories.vue";
import CreateCategory from '@/pages/admin/CreateCategory.vue';
import DetailCategory from '@/pages/admin/DetailCategory.vue';
import EditCategory from '@/pages/admin/EditCategory.vue';
import DeleteCategory from '@/pages/admin/DeleteCategory.vue';

import Products from '@/pages/admin/Products.vue';
import CreateProduct from '@/pages/admin/CreateProduct.vue';
import EditProduct from '@/pages/admin/EditProduct.vue';
import DeleteProduct from '@/pages/admin/DeleteProduct.vue';

import CustomerLayout from "@/layout/CustomerLayout.vue";
import DetailProduct from '@/pages/customer/DetailProduct.vue';
import Cart from '@/pages/customer/Cart.vue';

const routes = [
  { path: "/", 
    component: PublicLayout,
    children: [
      { path: "", component: PublicPage },
      { path: "login", component: Login },
      { path: "register", component: Register },
      { path: "logout", component: Logout },
    ],
  },

  {
    path: "/admin",
    component: AdminLayout,  meta: { requiresAuth: true, role: 'admin' } ,
    children: [
      { path: "", component: AdminPage },
      { path: "categories", component: Categories },
      { path: "create-category", component: CreateCategory },
      { path: "categories/:id", component: DetailCategory },
      { path: "categories/edit/:id", component: EditCategory },
      { path: "categories/delete/:id", component: DeleteCategory },

      { path: "products", component: Products },
      { path: "create-product", component: CreateProduct },
      { path: "products/:id", component: DetailProduct },
      { path: "products/edit/:id", component: EditProduct },
      { path: "products/delete/:id", component: DeleteProduct },
    ],
  },

  {
    path: "/customer",
    component: CustomerLayout, meta: { requiresAuth: true, role: 'customer' } ,
    children: [
      { path: "", component: CustomerPage },
      { path: "products/:id", component: DetailProduct },
      { path: "cart", component: Cart },

    ],
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const userRole = getUserRole();

  if (requiresAuth) {
    if (!userRole) {
      next('/login');
    } else {
      const routeRole = to.meta.role;
      if (routeRole && routeRole !== userRole) {
        next('/login');
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;
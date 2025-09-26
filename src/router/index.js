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

// Admin - Categories
import Categories from "@/pages/admin/categories/Categories.vue";
import CreateCategory from '@/pages/admin/categories/CreateCategory.vue';
import DetailCategory from '@/pages/admin/categories/DetailCategory.vue';
import EditCategory from '@/pages/admin/categories/EditCategory.vue';
import DeleteCategory from '@/pages/admin/categories/DeleteCategory.vue';

// Admin - Products
import Products from '@/pages/admin/products/Products.vue';
import CreateProduct from '@/pages/admin/products/CreateProduct.vue';
import DetailProductAdmin from '@/pages/admin/products/DetailProductAdmin.vue';
import EditProduct from '@/pages/admin/products/EditProduct.vue';
import DeleteProduct from '@/pages/admin/products/DeleteProduct.vue';

// Admin - Orders
import Orders from '@/pages/admin/orders/Orders.vue';
import DetailOrder from '@/pages/admin/orders/DetailOrder.vue';
import EditOrder from '@/pages/admin/orders/EditOrder.vue';
import DeleteOrderByAdmin from '@/pages/admin/orders/DeleteOrderByAdmin.vue';

// Admin - Users
import Users from '@/pages/admin/users/Users.vue';

// Admin - Finance
import CashFlow from '@/pages/admin/finance/CashFlow.vue';
import AdvancedFinance from '@/pages/admin/finance/AdvancedFinance.vue';
import HumanResources from '@/pages/admin/finance/HumanResources.vue';

// Admin - Analytics
import Analytics from '@/pages/admin/analytics/Analytics.vue';

// Customer
import CustomerLayout from "@/layout/CustomerLayout.vue";

// Customer - Products
import DetailProduct from '@/pages/customer/products/DetailProduct.vue';

// Customer - Shopping
import Cart from '@/pages/customer/shopping/Cart.vue';
import Checkout from '@/pages/customer/shopping/Checkout.vue';

// Customer - Orders
import OrderDetail from '@/pages/customer/orders/OrderDetail.vue';
import OrderHistory from '@/pages/customer/orders/OrderHistory.vue';
import DeleteOrder from '@/pages/customer/orders/DeleteOrder.vue';

// Customer - Account
import Profile from '@/pages/customer/account/Profile.vue';

const routes = [
  {
    path: "/",
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
    component: AdminLayout, meta: { requiresAuth: true, role: 'admin' },
    children: [
      // { path: "", component: AdminPage },
      { path: "", component: CashFlow },
      { path: "categories", component: Categories },
      { path: "create-category", component: CreateCategory },
      { path: "categories/:id", component: DetailCategory },
      { path: "categories/edit/:id", component: EditCategory },
      { path: "categories/delete/:id", component: DeleteCategory },

      { path: "products", component: Products },
      { path: "create-product", component: CreateProduct },
      { path: "products/:id", component: DetailProductAdmin },
      { path: "products/edit/:id", component: EditProduct },
      { path: "products/delete/:id", component: DeleteProduct },

      { path: "users", component: Users },
      { path: "analytics", component: Analytics },
      { path: "cashflow", component: CashFlow },
      { path: "advanced-finance", component: AdvancedFinance },
      { path: "hr", component: HumanResources },

      { path: "orders", component: Orders },
      { path: "orders/order/:id", component: DetailOrder },
      { path: "orders/order/edit/:id", component: EditOrder },
      { path: "orders/delete/:id", component: DeleteOrderByAdmin },


    ],
  },

  {
    path: "/customer",
    component: CustomerLayout, meta: { requiresAuth: true, role: 'customer' },
    children: [
      { path: "", component: CustomerPage },
      { path: "products/:id", component: DetailProduct },
      { path: "cart", component: Cart },
      { path: "checkout", component: Checkout },
      { path: "orders/order/:id", component: OrderDetail },
      { path: "order-history", component: OrderHistory },
      { path: "profile", component: Profile },
      { path: "orders/delete/:id", component: DeleteOrder },

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
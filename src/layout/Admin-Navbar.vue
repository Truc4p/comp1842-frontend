<!-- src/components/Admin-Navbar.vue -->
<template>
  <nav class="bg-blue-400 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/admin" class="text-white font-bold text-xl">MyApp</router-link>
      </div>
      <div>
        <router-link to="/admin/products" class="text-white mr-4">{{ t('products') }}</router-link>
        <router-link to="/admin/categories" class="text-white mr-4">{{ t('categories') }}</router-link>
        <router-link to="/admin/orders" class="text-white mr-4">{{ t('orders') }}</router-link>
        <router-link to="/admin/users" class="text-white mr-4">{{ t('users') }}</router-link>
        <router-link to="/logout" class="text-white mr-4">{{ t('logout') }}</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<style scoped>
/* Add your styles here */
</style>
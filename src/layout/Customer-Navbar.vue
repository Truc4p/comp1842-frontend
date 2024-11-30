<!-- src/components/Customer-Navbar.vue -->
<template>
  <nav class="bg-lime-100 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/customer" class="text-lime-700 font-bold text-xl">WrenCos</router-link>
      </div>
      <div>
        <router-link to="/customer/profile" class="text-lime-700 mr-4">{{ t('profile') }}</router-link>
        <router-link to="/customer/order-history" class="text-lime-700 mr-4">{{ t('orderHistory') }}</router-link>
        <router-link to="/logout" class="text-lime-700 mr-4">{{ t('logout') }}</router-link>
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
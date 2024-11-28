<!-- src/components/Customer-Navbar.vue -->
<template>
  <nav class="bg-blue-400 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/customer" class="text-white font-bold text-xl">WrenCos</router-link>
      </div>
      <div>
        <router-link to="/profile" class="text-white mr-4">{{ t('profile') }}</router-link>
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
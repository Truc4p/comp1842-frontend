<template>
  <nav class="bg-lime-100 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/" class="text-lime-700 font-bold text-xl">WrenCos</router-link>
      </div>
      <div>
        <router-link to="/login" class="text-lime-700 mr-4">{{ t('login') }}</router-link>
        <router-link to="/register" class="text-lime-700 mr-8">{{ t('register') }}</router-link>
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
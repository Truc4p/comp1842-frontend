<template>
  <nav class="bg-green-600 shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-2">
          <router-link to="/" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span class="text-white font-bold text-xl ml-2">WrenCos</span>
          </router-link>
        </div>
        
        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="text-white hover:text-green-200 transition-colors duration-200">
            {{ t('home') }}
          </router-link>
          <router-link to="/login" class="text-white hover:text-green-200 transition-colors duration-200">
            {{ t('login') }}
          </router-link>
          <router-link to="/register" class="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md font-medium transition-colors duration-200">
            {{ t('register') }}
          </router-link>
        </div>
        
        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="text-white focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-3 pb-3 space-y-1">
        <router-link to="/" class="block text-white hover:bg-green-700 px-3 py-2 rounded-md">
          {{ t('home') }}
        </router-link>
        <router-link to="/login" class="block text-white hover:bg-green-700 px-3 py-2 rounded-md">
          {{ t('login') }}
        </router-link>
        <router-link to="/register" class="block text-white hover:bg-green-700 px-3 py-2 rounded-md">
          {{ t('register') }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
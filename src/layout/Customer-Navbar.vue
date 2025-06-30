<!-- src/components/Customer-Navbar.vue -->
<template>
  <nav class="bg-green-600 shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-2">
          <router-link to="/customer" class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <span class="text-white font-bold text-xl ml-2">WrenCos</span>
          </router-link>
        </div>
        
        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/customer" class="text-white hover:text-green-200 transition-colors duration-200">
            {{ t('home') }}
          </router-link>
          <router-link to="/customer/profile" class="text-white hover:text-green-200 transition-colors duration-200">
            {{ t('profile') }}
          </router-link>
          <router-link to="/customer/order-history" class="text-white hover:text-green-200 transition-colors duration-200">
            {{ t('orderHistory') }}
          </router-link>
          <router-link to="/customer/cart" class="relative text-white hover:text-green-200 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span v-if="cartItemCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {{ cartItemCount }}
            </span>
          </router-link>
          <router-link to="/logout" class="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-md font-medium transition-colors duration-200">
            {{ t('logout') }}
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
        <router-link to="/customer" class="block text-white hover:bg-green-700 px-3 py-2 rounded-md">
          {{ t('home') }}
        </router-link>
        <router-link to="/customer/profile" class="block text-white hover:bg-green-700 px-3 py-2 rounded-md">
          {{ t('profile') }}
        </router-link>
        <router-link to="/customer/order-history" class="block text-white hover:bg-green-700 px-3 py-2 rounded-md">
          {{ t('orderHistory') }}
        </router-link>
        <router-link to="/customer/cart" class="flex items-center text-white hover:bg-green-700 px-3 py-2 rounded-md">
          <span>{{ t('cart') }}</span>
          <span v-if="cartItemCount > 0" class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {{ cartItemCount }}
          </span>
        </router-link>
        <router-link to="/logout" class="block text-white hover:bg-green-700 px-3 py-2 rounded-md">
          {{ t('logout') }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { ref, onMounted, computed } from 'vue';

const { t } = useI18n();
const mobileMenuOpen = ref(false);
const cartItemCount = computed(() => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  return cart.length;
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

onMounted(() => {
  // Listen for storage events to update cart count when it changes
  window.addEventListener('storage', () => {
    cartItemCount.value = (JSON.parse(localStorage.getItem('cart')) || []).length;
  });
});
</script>

<style scoped>
/* Add any additional custom styles here */
</style>
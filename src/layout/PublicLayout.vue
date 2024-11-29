<!-- src/layout/PublicLayout.vue -->
<template>
  <div class="min-h-screen h-screen flex flex-col bg-gray-100">
    <PublicNavbar />
    <div class="flex-grow flex items-center justify-center">
      <!-- Language Switcher -->
      <div class="absolute top-4 right-4">
        <select @change="changeLanguage" v-model="currentLocale" class="custom-select">
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
      </div>
      <div class="w-full h-full">
        <!-- Main Content -->
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 h-full">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PublicNavbar from "./Public-Navbar.vue";
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { locale } = useI18n();
const currentLocale = ref(locale.value);

const changeLanguage = (event) => {
  locale.value = event.target.value;
};
</script>

<style scoped>
.custom-select {
  color: #4D7C0F; /* Change this to your desired color */
}
</style>
<!-- src/layout/CustomerLayout.vue -->
<template>
  <div class="min-h-screen h-screen flex flex-col bg-gray-100">
    <CustomerNavbar />
    <div class="flex-grow flex items-center justify-center">
      <!-- Language Switcher -->
      <div class="absolute top-4 right-4">
        <select @change="changeLanguage" v-model="currentLocale">
          <option value="en">English</option>
          <option value="vi">Tiếng Việt</option>
        </select>
      </div>
      <!-- Make content full screen by removing max width constraint -->
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
import CustomerNavbar from "./Customer-Navbar.vue";
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { locale } = useI18n();
const currentLocale = ref(locale.value);

const changeLanguage = (event) => {
  locale.value = event.target.value;
};
</script>
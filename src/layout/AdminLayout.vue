<!-- src/layout/AdminLayout.vue -->
<template>
  <div class="min-h-screen h-screen flex flex-col bg-gray-100">
    <AdminNavbar />
    <div class="flex-grow flex items-center justify-center">
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
import AdminNavbar from "./Admin-Navbar.vue";
</script>

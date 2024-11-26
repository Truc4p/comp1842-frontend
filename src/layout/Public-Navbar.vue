<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-blue-400 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/public-page" class="text-white font-bold text-xl">MyApp</router-link>
      </div>
      <div>
        <router-link to="/login" class="text-white mr-4">Login</router-link>
        <router-link to="/register" class="text-white mr-4">Register</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
// No additional setup required
</script>

<style scoped>
/* Add your styles here */
</style>

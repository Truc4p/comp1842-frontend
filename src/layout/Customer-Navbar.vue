<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-blue-400 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/customer/customer-page" class="text-white font-bold text-xl">MyApp</router-link>
      </div>
      <div>
        <router-link to="/profile" class="text-white mr-4">Profile</router-link>
        <router-link to="/logout" class="text-white mr-4">Logout</router-link>
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

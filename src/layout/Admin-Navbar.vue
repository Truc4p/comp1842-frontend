<!-- src/components/Navbar.vue -->
<template>
  <nav class="bg-blue-400 p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div>
        <router-link to="/admin" class="text-white font-bold text-xl">MyApp</router-link>
      </div>
      <div>
        <router-link to="/admin/products" class="text-white mr-4">Products</router-link>
        <router-link to="/admin/categories" class="text-white mr-4">Categories</router-link>
        <router-link to="/admin/orders" class="text-white mr-4">Orders</router-link>
        <router-link to="/admin/users" class="text-white mr-4">Users</router-link>
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

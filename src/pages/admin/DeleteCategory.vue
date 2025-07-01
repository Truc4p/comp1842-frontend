<template>
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Delete Category</h2>
      <p>Are you sure you want to delete this category?</p>
      <div class="flex items-center justify-between mt-4">
        <button
          class="bg-red-400 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          @click="deleteCategory"
        >
          Delete
        </button>
        <router-link to="../">
          <button
            class="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
          >
            Cancel
          </button>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import { API_URL } from '../../utils/config';
  
  const route = useRoute();
  const router = useRouter();
  const categoryId = ref(route.params.id);
  
  const deleteCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/categories/${categoryId.value}`, {
        headers: {
          'x-auth-token': token,
        },
      });
      console.log('Category deleted successfully');
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
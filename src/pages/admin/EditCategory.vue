<template>
    <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Edit Category</h2>
      <div v-if="category">
        <form @submit.prevent="updateCategory">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
              Name
            </label>
            <input
              v-model="category.name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Category Name"
            />
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save
            </button>
            <router-link to="/categories">
              <button
                class="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Cancel
              </button>
            </router-link>
          </div>
        </form>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  
  const category = ref(null);
  const route = useRoute();
  const router = useRouter();
  
  onMounted(async () => {
    const categoryId = route.params.id;
    console.log('Fetching category with ID:', categoryId); // Debugging log
    try {
      const response = await axios.get(`http://localhost:3000/categories/${categoryId}`, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      console.log('API response:', response.data); // Debugging log
      category.value = response.data;
    } catch (error) {
      console.error('Error fetching category details:', error);
    }
  });
  
  const updateCategory = async () => {
    const categoryId = route.params.id;
    console.log('Updating category with ID:', categoryId); // Debugging log
    try {
      await axios.put(`http://localhost:3000/categories/${categoryId}`, category.value, {
        headers: {
          'x-auth-token': localStorage.getItem('token'),
        },
      });
      console.log('Category updated successfully'); // Debugging log
      router.push('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
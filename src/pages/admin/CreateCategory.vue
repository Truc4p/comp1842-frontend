<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Create New Category</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Category Name:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>
      <button
        type="submit"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Category
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const name = ref('');
const router = useRouter();

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post('http://localhost:3000/categories', { name: name.value }, {
      headers: {
        'x-auth-token': token,
      },
    });
    console.log('Category created:', response.data);
    router.push('/admin/categories');
  } catch (error) {
    console.error('Error creating category:', error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
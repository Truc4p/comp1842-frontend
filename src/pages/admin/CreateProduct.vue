<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Create New Product</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
        <input
          type="text"
          id="name"
          v-model="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div class="mb-4">
        <label for="category" class="block text-gray-700 text-sm font-bold mb-2">Product Category:</label>
        <select
          id="category"
          v-model="category"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        >
          <option value="" disabled>Select a category</option>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="price" class="block text-gray-700 text-sm font-bold mb-2">Product Price:</label>
        <input
          type="number"
          id="price"
          v-model="price"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <div class="mb-4">
        <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Product Description:</label>
        <textarea
          id="description"
          v-model="description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        ></textarea>
      </div>

      <div class="mb-4">
        <label for="image" class="block text-gray-700 text-sm font-bold mb-2">Product Image:</label>
        <input
          type="file"
          id="image"
          @change="handleImageUpload"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
      </div>

      <button
        type="submit"
        class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create Product
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const name = ref('');
const category = ref('');
const price = ref('');
const description = ref('');
const image = ref(null);
const categories = ref([]);
const router = useRouter();

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/categories', {
      headers: {
        'x-auth-token': token,
      },
    });
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

onMounted(() => {
  fetchCategories();
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  image.value = file;
};

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('categoryId', category.value);
    formData.append('price', price.value);
    formData.append('description', description.value);
    formData.append('image', image.value);

    const response = await axios.post('http://localhost:3000/products', formData, {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Product created:', response.data);
    router.push('/admin/products');
  } catch (error) {
    console.error('Error creating product:', error);
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
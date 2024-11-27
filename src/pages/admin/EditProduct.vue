<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Edit Product</h2>
    <div v-if="product">
      <form @submit.prevent="updateProduct">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input
            v-model="product.name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Product Name"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
            Category
          </label>
          <select
            v-model="product.categoryId"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category"
          >
            <option :value="product.categoryId" selected>{{ product.category ? product.category.name : 'No Category' }}</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
            Price
          </label>
          <input
            v-model="product.price"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price"
            type="number"
            placeholder="Product Price"
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
            Description
          </label>
          <textarea
            v-model="product.description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            placeholder="Product Description"
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
            Image
          </label>
          <input
            type="file"
            id="image"
            @change="handleImageUpload"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <div v-if="product.image" class="mt-2">
            <img :src="getImageUrl(product.image)" alt="Product Image" class="w-64 h-64 object-cover" />
            <p class="text-gray-600 mt-2">Current Image</p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </button>
          <router-link to="/admin/products">
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const product = ref(null);
const categories = ref([]);
const route = useRoute();
const router = useRouter();
const image = ref(null);

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

onMounted(async () => {
  const productId = route.params.id;
  console.log('Fetching product with ID:', productId); // Debugging log
  try {
    const response = await axios.get(`http://localhost:3000/products/${productId}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    console.log('API response:', response.data); // Debugging log
    product.value = response.data;
    await fetchCategories();
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
});

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  image.value = file;
};

const updateProduct = async () => {
  const productId = route.params.id;
  console.log('Updating product with ID:', productId); // Debugging log
  try {
    const formData = new FormData();
    formData.append('name', product.value.name);
    formData.append('categoryId', product.value.categoryId);
    formData.append('price', product.value.price);
    formData.append('description', product.value.description);
    if (image.value) {
      formData.append('image', image.value);
    }

    // Log FormData entries
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await axios.put(`http://localhost:3000/products/${productId}`, formData, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Product updated successfully:', response.data); // Debugging log
    router.push('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data); // Debugging log
    }
  }
};

const getImageUrl = (relativePath) => {
  return `http://localhost:3000/${relativePath}`; // Adjust the base URL as needed
};
</script>

<style scoped>
/* Add your styles here */
</style>
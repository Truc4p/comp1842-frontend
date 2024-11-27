<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Product Details</h2>
    <div v-if="product">
      <p><strong>ID:</strong> {{ product._id }}</p>
      <p><strong>Name:</strong> {{ product.name }}</p>
      <p><strong>Category:</strong> {{ product.category ? product.category.name : 'No Category' }}</p>
      <p><strong>Description:</strong> {{ product.description }}</p>
      <p><strong>Price:</strong> ${{ product.price }}</p>
      <div>
        <img :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" alt="Product Image" class="w-64 h-64 object-cover" @error="onImageError" />
      </div>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
    <router-link to="/customer">
      <button class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Back to products
      </button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const product = ref(null);
const route = useRoute();

const getImageUrl = (relativePath) => {
  return `http://localhost:3000/${relativePath}`; // Adjust the base URL as needed
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
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
    console.log('Product image URL:', getImageUrl(product.value.image)); // Log the full image URL
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
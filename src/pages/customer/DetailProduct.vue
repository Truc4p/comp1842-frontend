<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t, locale } = useI18n();
const product = ref(null);
const route = useRoute();

const getImageUrl = (relativePath) => {
  return `${API_URL}/${relativePath}`; // Adjust the base URL as needed
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
};

onMounted(async () => {
  const productId = route.params.id;
  console.log('Fetching product with ID:', productId); // Debugging log
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`, {
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

<template>
  <div class="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg border border-gray-200">
    <!-- Title -->
    <h2 class="text-3xl font-bold text-gray-800 mb-6">{{ t('details') }}</h2>

    <!-- Product Details -->
    <div v-if="product" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Text Details -->
      <div>
        <p class="text-lg text-gray-700 mb-2">
          <strong class="font-semibold">ID:</strong> {{ product._id }}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong class="font-semibold">{{ t('productName') }}:</strong> {{ product.name }}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong class="font-semibold">{{ t('productCategory') }}:</strong>
          {{ product.category ? product.category.name : t('noCategory') }}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong class="font-semibold">{{ t('productDescription') }}:</strong>
          {{ product.description }}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong class="font-semibold">{{ t('productPrice') }}:</strong> ${{ product.price }}
        </p>
        <p class="text-lg text-gray-700 mb-2">
          <strong class="font-semibold">{{ t('productStockQuantity') }}:</strong>
          {{ product.stockQuantity }}
        </p>
      </div>
      <!-- Product Image -->
      <div class="flex justify-center items-center">
        <img :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" alt="Product Image"
          class="w-100 h-100 object-cover rounded-lg shadow-md border border-gray-300 md:w-96 md:h-96"
          @error="onImageError" />
      </div>

    </div>
    <!-- Loading State -->
    <div v-else class="text-center">
      <p class="text-gray-500 text-lg">{{ t('loading') }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const products = ref([]);

const fetchProducts = async () => {
  try {
    const res = await axios.get("http://localhost:3000/products");
    console.log("Products response:", res.data);
    products.value = res.data;
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const getImageUrl = (relativePath) => {
  return `http://localhost:3000/${relativePath}`; // Adjust the base URL as needed
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
};

onMounted(() => {
  fetchProducts();
});

</script>

<template>
  <div class="container mx-auto p-4">
    <h1>{{ t('welcomeMessage') }}</h1>
    <br />
    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product._id"
        class="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <img :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" alt="Product Image"
          class="w-full h-48 object-cover" @error="onImageError" />
        <div class="p-4">
          <h2 class="font-bold mb-2">{{ product.name }}</h2>
          <p class="text-gray-700 mb-2">{{ product.category ? product.category.name : 'No Category' }}</p>
          <p class="text-green-600 font-bold mb-4">${{ product.price }}</p>
          <div class="flex justify-between items-center">
            <router-link :to="`/login`">
              <button class="btn-details">
                {{ t('details') }}
              </button>
            </router-link>
            <router-link :to="`/login`">
              <button class="btn-primary">
                {{ t('addToCart') }}
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-primary {
  @apply bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500;
}

.btn-edit {
  @apply bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 mx-1;
}

.btn-delete {
  @apply bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 mx-1;
}

.btn-details {
  @apply bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500 mx-1;
}
</style>
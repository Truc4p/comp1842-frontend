<script setup>
import axios from "axios";
import { ref, onMounted, computed } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const products = ref([]);
const isLoading = ref(true);
const error = ref(null);
const categories = ref([]);
const selectedCategory = ref('all');

const fetchProducts = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const res = await axios.get("http://localhost:3000/products");
    products.value = res.data;
    
    // Extract unique categories
    const uniqueCategories = [...new Set(res.data
      .filter(product => product.category)
      .map(product => product.category.name))];
    
    categories.value = uniqueCategories;
  } catch (err) {
    console.error("Error fetching products:", err);
    error.value = "Failed to load products. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const getImageUrl = (relativePath) => {
  return `http://localhost:3000/${relativePath}`;
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg';
};

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value;
  }
  return products.value.filter(product => 
    product.category && product.category.name === selectedCategory.value
  );
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ t('welcomeToWrenCos') }}</h1>
        <p class="text-xl mb-8 max-w-2xl mx-auto">{{ t('heroSubtitle') }}</p>
        <router-link to="/login" class="bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-md font-medium text-lg transition-colors duration-200">
          {{ t('shopNow') }}
        </router-link>
      </div>
    </section>
    
    <!-- Category Filter -->
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-wrap items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-neutral-800">{{ t('featuredProducts') }}</h2>
        
        <div class="flex flex-wrap gap-2 mt-4 sm:mt-0">
          <button 
            @click="selectedCategory = 'all'" 
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              selectedCategory === 'all' 
                ? 'bg-primary-600 text-white' 
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            ]"
          >
            {{ t('allCategories') }}
          </button>
          
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
              selectedCategory === category 
                ? 'bg-primary-600 text-white' 
                : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {{ error }}
      </div>
      
      <!-- Products Grid -->
      <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="product in filteredProducts" :key="product._id" class="card group">
          <div class="relative overflow-hidden h-56">
            <img 
              :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" 
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              @error="onImageError" 
            />
          </div>
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-neutral-800">{{ product.name }}</h3>
              <span class="text-primary-600 font-bold">${{ product.price }}</span>
            </div>
            <p class="text-neutral-600 text-sm mb-4">{{ product.category ? product.category.name : t('noCategory') }}</p>
            <div class="flex justify-between items-center">
              <router-link :to="`/login`" class="text-primary-600 hover:text-primary-800 text-sm font-medium">
                {{ t('details') }} →
              </router-link>
              <router-link :to="`/login`" class="btn btn-primary btn-sm">
                {{ t('addToCart') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-neutral-900">{{ t('noProductsFound') }}</h3>
        <p class="mt-1 text-neutral-500">{{ t('tryDifferentCategory') }}</p>
      </div>
    </div>
    
    <!-- Features Section -->
    <section class="bg-neutral-50 py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">{{ t('whyChooseUs') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <div class="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ t('qualityProducts') }}</h3>
            <p class="text-neutral-600">{{ t('qualityProductsDesc') }}</p>
          </div>
          
          <!-- Feature 2 -->
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <div class="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ t('fastDelivery') }}</h3>
            <p class="text-neutral-600">{{ t('fastDeliveryDesc') }}</p>
          </div>
          
          <!-- Feature 3 -->
          <div class="bg-white p-6 rounded-lg shadow-sm text-center">
            <div class="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full text-primary-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ t('securePayments') }}</h3>
            <p class="text-neutral-600">{{ t('securePaymentsDesc') }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Additional custom styles can be added here */
</style>
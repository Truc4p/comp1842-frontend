<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t, locale } = useI18n();
const router = useRouter();
const products = ref([]);
const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
const searchQuery = ref('');
const isLoading = ref(true);
const error = ref(null);
const categories = ref([]);
const selectedCategory = ref('all');

const fetchProducts = async () => {
  isLoading.value = true;
  error.value = null;
  
  const token = localStorage.getItem("token");
  if (!token) {
    alert(t('login'));
    router.push("/login");
    return;
  }

  try {
    // Make the api request with axios with token in header
    const res = await axios.get(`${API_URL}/products`, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });

    console.log("Products response:", res.data);
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
  return `${API_URL}/${relativePath}`; // Adjust the base URL as needed
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
};

const updateCart = (product, quantity) => {
  const cartItem = cart.value.find(item => item._id === product._id);
  if (cartItem) {
    if (cartItem.quantity + quantity > product.stockQuantity) {
      alert('You have reached the maximum stock quantity for this product.');
      return;
    }
    cartItem.quantity += quantity;
  } else {
    if (quantity > product.stockQuantity) {
      alert('You have reached the maximum stock quantity for this product.');
      return;
    }
    cart.value.push({ ...product, quantity });
  }
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const validateQuantity = (product) => {
  if (product.quantity > product.stockQuantity) {
    product.quantity = product.stockQuantity;
  }
};

const filteredProducts = computed(() => {
  let filtered = products.value;
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(product => 
      product.category && product.category.name === selectedCategory.value
    );
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    filtered = filtered.filter(product => {
      return product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (product.category && product.category.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
    });
  }
  
  return filtered;
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="w-full">
    <!-- Products Section - Full Width Background -->
    <div class="w-full py-16 bg-white">
      <div class="container mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-secondary-900 mb-4">{{ t('products') || 'Products' }}</h2>
          <p class="text-lg text-secondary-600 max-w-2xl mx-auto">
            {{ t('featuredProductsDesc') || 'Explore our carefully curated collection of premium products' }}
          </p>
        </div>
        
        <!-- Search and Cart Section -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <!-- Search -->
          <div class="w-full md:w-1/2">
            <input 
              type="text" 
              v-model="searchQuery" 
              :placeholder="t('searchProducts') || 'Search products or categories'" 
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <!-- Cart Link -->
          <router-link to="/customer/cart" class="flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 6H2m5 7v4a2 2 0 002 2h4a2 2 0 002-2v-4m-6 2a1 1 0 100 2 1 1 0 000-2zm4 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            {{ t('cart') }} ({{ cart.length }})
          </router-link>
        </div>
        
        <!-- Category Filter -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button 
            @click="selectedCategory = 'all'" 
            :class="[
              'category-filter',
              selectedCategory === 'all' ? 'active' : ''
            ]"
          >
            {{ t('allCategories') || 'All Categories' }}
          </button>
          
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'category-filter',
              selectedCategory === category ? 'active' : ''
            ]"
          >
            {{ category }}
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="text-center">
            <svg class="loading-spinner mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-secondary-600">{{ t('loading') || 'Loading products...' }}</p>
          </div>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p class="font-medium">{{ error }}</p>
        </div>
        
        <!-- Products Grid -->
        <div v-else-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div v-for="product in filteredProducts" :key="product._id" class="product-card group animate-fade-in cursor-pointer" @click="$router.push(`/customer/products/${product._id}`)">
            <div class="relative overflow-hidden rounded-t-2xl">
              <img 
                :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" 
                :alt="product.name"
                class="product-image"
                @error="onImageError" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="card-body">
              <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-lg text-secondary-900 group-hover:text-primary-600 transition-colors duration-200">
                  {{ product.name }}
                </h3>
                <span class="text-2xl font-bold text-primary-600">${{ product.price }}</span>
              </div>
              
              <div class="flex items-center mb-4">
                <span class="badge badge-info">{{ product.category ? product.category.name : t('noCategory') || 'No Category' }}</span>
              </div>
              
              <!-- Quantity and Add to Cart -->
              <div class="flex items-center gap-3 pt-4 border-t border-secondary-100" @click.stop>
                <input 
                  type="number" 
                  v-model.number="product.quantity" 
                  min="1" 
                  :max="product.stockQuantity"
                  class="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent" 
                  @input="validateQuantity(product)"
                  @click.stop
                />
                <button 
                  class="btn btn-primary flex-1" 
                  @click.stop="updateCart(product, product.quantity || 1)"
                >
                  {{ t('addToCart') }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <svg class="mx-auto h-16 w-16 text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <h3 class="text-2xl font-medium text-secondary-900 mb-2">{{ t('noProductsFound') || 'No Products Found' }}</h3>
          <p class="text-secondary-500 mb-6">{{ t('tryDifferentCategory') || 'Try selecting a different category or search term' }}</p>
          <button @click="selectedCategory = 'all'; searchQuery = ''" class="btn btn-primary">
            {{ t('viewAllProducts') || 'View All Products' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations - same as PublicPage.vue */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Loading spinner */
.loading-spinner {
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
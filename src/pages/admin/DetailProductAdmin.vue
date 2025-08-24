<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t, locale } = useI18n();
const product = ref(null);
const route = useRoute();
const isLoading = ref(true);
const error = ref(null);
const quantity = ref(1);
const buttonState = ref('default'); // 'default', 'loading', 'success'

const getImageUrl = (relativePath) => {
  return `${API_URL}/${relativePath}`;
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg';
};

onMounted(async () => {
  const productId = route.params.id;
  console.log('Fetching product with ID:', productId);
  try {
    const response = await axios.get(`${API_URL}/products/${productId}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    console.log('API response:', response.data);
    product.value = response.data;
    console.log('Product image URL:', getImageUrl(product.value.image));
  } catch (error) {
    console.error('Error fetching product details:', error);
    error.value = 'Failed to load product details. Please try again.';
  } finally {
    isLoading.value = false;
  }
});

// Format description to preserve formatting and convert common patterns to HTML
const formatDescription = (text) => {
  if (!text) return '';
  
  return text
    // Convert line breaks to <br> tags
    .replace(/\n/g, '<br>')
    // Convert bullet points (• or -) to HTML list items
    .replace(/^[•\-]\s+(.+)$/gm, '<li>$1</li>')
    // Wrap consecutive list items in <ul> tags
    .replace(/(<li>.*<\/li>)(?:\s*<br>\s*(<li>.*<\/li>))+/g, function(match) {
      return '<ul class="list-disc ml-6 my-2">' + match.replace(/<br>/g, '') + '</ul>';
    })
    // Convert **bold** or strong text patterns
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert section headers (lines ending with :)
    .replace(/^(.+):$/gm, '<h4 class="font-semibold text-secondary-800 mt-4 mb-2">$1:</h4>')
    // Convert emojis and special characters (preserve them)
    // Convert numbered sections
    .replace(/^(\d+\.\s+.+)$/gm, '<div class="mt-2"><strong>$1</strong></div>')
    // Convert lines that start with 🌟, 💧, 🔬, 🌿, ✨ as highlighted points
    .replace(/^([🌟💧🔬🌿✨]\s*.+)$/gm, '<div class="flex items-start gap-2 my-2"><span class="text-xl">$1</span></div>')
    // Clean up any double <br> tags
    .replace(/<br><br>/g, '<br>')
    // Add spacing between sections
    .replace(/(<\/h4>)/g, '$1<br>');
};
</script>

<template>
  <div class="page-background">
    <div class="container mx-auto px-6 max-w-6xl">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="text-center">
          <svg class="loading-spinner mx-auto mb-4 h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-lg text-secondary-600 font-medium">{{ t('loading') || 'Loading product details...' }}</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <p class="font-medium">{{ error }}</p>
      </div>

      <!-- Product Details -->
      <div v-else-if="product" class="animate-fade-in">
        <!-- Header Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-secondary-900 mb-4 gradient-text">
            {{ t('productDetails') || 'Product Details' }}
          </h1>
          <div class="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
        </div>

        <!-- Main Product Card -->
        <div class="bg-white rounded-2xl overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <!-- Product Image Section -->
            <div class="relative white p-4 flex items-center justify-center">
              <div class="relative group w-full">
                <img 
                  :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" 
                  :alt="product.name"
                  class="relative w-full h-auto max-h-none object-contain transform group-hover:scale-105 transition-transform duration-300"
                  @error="onImageError" 
                />
              </div>
            </div>

            <!-- Product Information Section -->
            <div class="p-8 lg:p-12">
              <!-- Product Name & Category -->
              <div class="mb-8">
                <div class="flex items-center gap-3 mb-4">
                  <span class="badge badge-info text-sm px-3 py-1">
                    {{ product.category ? product.category.name : t('noCategory') || 'No Category' }}
                  </span>
                  <span v-if="product.stockQuantity <= 0" class="badge badge-error text-sm px-3 py-1">
                    {{ t('outOfStock') || 'Out of Stock' }}
                  </span>
                </div>
                <h2 class="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4 leading-tight">
                  {{ product.name }}
                </h2>
                <div class="flex items-center gap-4">
                  <span class="text-4xl font-bold text-primary-600">${{ product.price }}</span>
                </div>
              </div>

              <!-- Admin Actions -->
              <div class="flex gap-4 pt-6 border-t border-secondary-200">
                <router-link :to="`/admin/products/edit/${product._id}`" class="btn btn-primary">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  {{ t('editProduct') || 'Edit Product' }}
                </router-link>
                <router-link :to="`/admin/products/delete/${product._id}`" class="btn btn-danger">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                  </svg>
                  {{ t('deleteProduct') || 'Delete Product' }}
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Product Description -->
          <div class="mb-8">
            <h3 class="text-xl font-semibold text-secondary-800 mb-3">
              {{ t('description') || 'Description' }}
            </h3>
                            <div 
                  class="text-secondary-600 leading-relaxed text-lg formatted-description"
                  v-html="formatDescription(product.description || t('noDescription') || 'No description available.')"
                ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom animations for this component */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 50%, var(--secondary-800) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.formatted-description {
  white-space: normal;
}

.formatted-description h4 {
  color: var(--secondary-800);
}

.formatted-description ul {
  padding-left: 1.5rem;
}

.formatted-description li {
  margin-bottom: 0.5rem;
}

.formatted-description strong {
  font-weight: 600;
  color: var(--secondary-800);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 50%, var(--primary-700) 100%);
}

/* Hide number input arrows */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
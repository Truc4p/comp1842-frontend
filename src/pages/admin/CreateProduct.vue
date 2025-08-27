<template>
  <div class="page-background min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-2xl md:text-3xl font-bold gradient-text mb-4">
          {{ t('createProduct') }}
        </h1>
        <p class="text-secondary-600 text-lg">
          {{ t('addNewProductToInventory') || 'Add a new product to your inventory' }}
        </p>
      </div>

      <!-- Main Form Card -->
      <div class="card animate-fade-in">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-primary-600 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            {{ t('productDetails') || 'Product Details' }}
          </h2>
        </div>

        <form @submit.prevent="handleSubmit" class="card-body space-y-6">
          <!-- Product Name -->
          <div class="form-group">
            <label for="name" class="form-label">
              {{ t('productName') }}
              <span class="text-error">*</span>
            </label>
            <input 
              type="text" 
              id="name" 
              v-model="name"
              class="form-control"
              :placeholder="t('enterProductName') || 'Enter product name'"
              required 
            />
          </div>

          <!-- Category and Price Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="form-group">
              <label for="category" class="form-label">
                {{ t('productCategory') }}
                <span class="text-error">*</span>
              </label>
              <div class="relative">
                <select 
                  id="category" 
                  v-model="category"
                  class="form-control appearance-none"
                  required
                >
                  <option value="" disabled>{{ t('selectCategory') }}</option>
                  <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                    {{ cat.name }}
                  </option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="price" class="form-label">
                {{ t('productPrice') }}
                <span class="text-error">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                <input 
                  type="number" 
                  id="price" 
                  v-model="price"
                  class="form-control pl-8"
                  :placeholder="t('enterPrice') || '0.00'"
                  step="0.01"
                  min="0"
                  required 
                />
              </div>
            </div>
          </div>

          <!-- Stock Quantity -->
          <div class="form-group">
            <label for="stockQuantity" class="form-label">
              {{ t('stockQuantity') }}
              <span class="text-error">*</span>
            </label>
            <input 
              type="number" 
              id="stockQuantity" 
              v-model="stockQuantity"
              class="form-control"
              :placeholder="t('enterStockQuantity') || 'Enter stock quantity'"
              min="0"
              required 
            />
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description" class="form-label">
              {{ t('productDescription') }}
            </label>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <!-- Description Input -->
              <div>
                <textarea 
                  id="description" 
                  v-model="description"
                  class="form-control min-h-[120px] resize-y"
                  :placeholder="t('enterProductDescription') || 'Enter a detailed description of the product'"
                  rows="4"
                ></textarea>
                <div class="text-sm text-secondary-500 mt-1 space-y-1">
                  <p>{{ t('descriptionNote') || 'Line breaks and formatting will be preserved as you type them.' }}</p>
                  <div class="text-xs bg-secondary-50 p-2 rounded border">
                    <strong>Formatting tips:</strong><br>
                    • Use **text** for <strong>bold</strong><br>
                    • Start lines with • or - for bullet points<br>
                    • Use emojis like 🌟 💧 🔬 🌿 ✨ for highlights<br>
                    • End lines with : for section headers
                  </div>
                </div>
              </div>
              <!-- Description Preview -->
              <div v-if="description.trim()" class="lg:block hidden">
                <label class="form-label text-sm text-secondary-600">
                  {{ t('preview') || 'Preview' }}
                </label>
                <div class="border border-secondary-300 rounded-md p-3 min-h-[120px] bg-secondary-50">
                  <div 
                    class="text-secondary-700 text-sm leading-relaxed formatted-description"
                    v-html="formatDescription(description)"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Image Upload -->
          <div class="form-group">
            <label for="image" class="form-label">
              {{ t('productImage') }}
            </label>
            <div class="relative">
              <input 
                type="file" 
                id="image" 
                @change="handleImageUpload"
                accept="image/*"
                class="hidden"
                ref="fileInput"
              />
              <div 
                @click="$refs.fileInput.click()"
                class="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer bg-secondary-50 hover:bg-primary-50"
              >
                <div v-if="!image" class="space-y-2">
                  <svg class="w-12 h-12 mx-auto text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <p class="text-secondary-600">{{ t('clickToUploadImage') || 'Click to upload product image' }}</p>
                  <p class="text-sm text-secondary-400">{{ t('imageFormats') || 'PNG, JPG, GIF up to 10MB' }}</p>
                </div>
                <div v-else class="space-y-2">
                  <svg class="w-12 h-12 mx-auto text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p class="text-success font-medium">{{ image.name }}</p>
                  <p class="text-sm text-secondary-500">{{ t('clickToChangeImage') || 'Click to change image' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-secondary-200">
            <button 
              type="button"
              @click="$router.push('/admin/products')"
              class="btn btn-secondary flex-1 sm:flex-none"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              {{ t('cancel') || 'Cancel' }}
            </button>
            
            <button 
              type="submit"
              class="btn btn-primary flex-1"
              :disabled="isSubmitting"
            >
              <svg v-if="isSubmitting" class="w-4 h-4 mr-2 loading-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              {{ isSubmitting ? (t('creating') || 'Creating...') : t('createProduct') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t } = useI18n();

const name = ref('');
const category = ref('');
const price = ref('');
const stockQuantity = ref('');
const description = ref('');
const image = ref(null);
const categories = ref([]);
const isSubmitting = ref(false);
const router = useRouter();

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/categories`, {
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
  console.log('Image was uploaded:', file);
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;
  
  try {
    isSubmitting.value = true;
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', name.value);
    formData.append('categoryId', category.value);
    formData.append('price', price.value);
    formData.append('stockQuantity', stockQuantity.value);
    formData.append('description', description.value);
    if (image.value) {
      formData.append('image', image.value);
    }

    // Log the contents of formData
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Product created:', response.data);
    router.push('/admin/products');
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    } else if (error.request) {
      console.error('Network error:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  } finally {
    isSubmitting.value = false;
  }
};

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
    // Clean up any double <br> tags
    .replace(/<br><br>/g, '<br>')
    // Add spacing between sections
    .replace(/(<\/h4>)/g, '$1<br>');
};
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure the file input styling matches the design system */
input[type="file"] {
  @apply hidden;
}

/* Custom dropdown arrow positioning for select elements */
select.form-control {
  background-image: none;
  padding-right: 2.5rem;
}

/* Price input with dollar sign positioning */
.price-input {
  padding-left: 2rem;
}

/* Enhanced upload area hover effects */
.upload-area {
  transition: all 0.3s ease;
}

.upload-area:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
}

/* Formatted description styles */
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
</style>
<template>
  <div class="page-background min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-2xl">
      <!-- Header Section -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold gradient-text mb-4">
          {{ t('createProduct') }}
        </h1>
        <p class="text-secondary-600 text-lg">
          {{ t('addNewProductToInventory') || 'Add a new product to your inventory' }}
        </p>
      </div>

      <!-- Main Form Card -->
      <div class="card animate-fade-in">
        <div class="card-header">
          <h2 class="text-xl font-semibold text-secondary-800 flex items-center gap-2">
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
            <textarea 
              id="description" 
              v-model="description"
              class="form-control min-h-[120px] resize-y"
              :placeholder="t('enterProductDescription') || 'Enter a detailed description of the product'"
              rows="4"
            ></textarea>
          </div>

          <!-- Multiple Image Upload -->
          <div class="form-group">
            <label for="images" class="form-label">
              {{ t('productImages') || 'Product Images' }}
              <span class="text-sm text-secondary-500 ml-2">({{ t('multipleImagesAllowed') || 'Multiple images allowed' }})</span>
            </label>
            
            <!-- Upload Area -->
            <div class="relative">
              <input 
                type="file" 
                id="images" 
                @change="handleImageUpload"
                accept="image/*"
                multiple
                class="hidden"
                ref="fileInput"
              />
              <div 
                @click="$refs.fileInput.click()"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="handleDrop"
                :class="[
                  'border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer',
                  isDragOver 
                    ? 'border-primary-400 bg-primary-50' 
                    : 'border-secondary-300 bg-secondary-50 hover:border-primary-400 hover:bg-primary-50'
                ]"
              >
                <div class="space-y-2">
                  <svg class="w-12 h-12 mx-auto text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  <p class="text-secondary-600">
                    {{ isDragOver ? (t('dropImagesHere') || 'Drop images here') : (t('clickToUploadImages') || 'Click to upload product images') }}
                  </p>
                  <p class="text-sm text-secondary-400">{{ t('imageFormats') || 'PNG, JPG, GIF up to 10MB each' }}</p>
                  <p class="text-xs text-secondary-400">{{ t('dragDropHint') || 'Drag & drop files here or click to browse' }}</p>
                </div>
              </div>
            </div>

            <!-- Image Preview Grid -->
            <div v-if="images.length > 0" class="mt-4">
              <h4 class="text-sm font-medium text-secondary-700 mb-3">
                {{ t('selectedImages') || 'Selected Images' }} ({{ images.length }})
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div 
                  v-for="(image, index) in images" 
                  :key="index"
                  class="relative group"
                  draggable="true"
                  @dragstart="handleDragStart(index)"
                  @dragover.prevent
                  @drop.prevent="handleImageDrop(index)"
                >
                  <!-- Image Preview -->
                  <div class="aspect-square bg-secondary-100 rounded-lg overflow-hidden border-2 border-secondary-200 hover:border-primary-300 transition-colors cursor-move">
                    <img 
                      :src="image.preview" 
                      :alt="`Preview ${index + 1}`"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  
                  <!-- Remove Button -->
                  <button 
                    type="button"
                    @click="removeImage(index)"
                    class="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-error-dark transition-colors opacity-0 group-hover:opacity-100"
                    :title="t('removeImage') || 'Remove image'"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>

                  <!-- Reorder Controls -->
                  <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      v-if="index > 0"
                      type="button"
                      @click="moveImageLeft(index)"
                      class="bg-secondary-800 bg-opacity-75 text-white rounded p-1 text-xs hover:bg-opacity-100 transition-all"
                      :title="t('moveLeft') || 'Move left'"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                      </svg>
                    </button>
                    <button 
                      v-if="index < images.length - 1"
                      type="button"
                      @click="moveImageRight(index)"
                      class="bg-secondary-800 bg-opacity-75 text-white rounded p-1 text-xs hover:bg-opacity-100 transition-all"
                      :title="t('moveRight') || 'Move right'"
                    >
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Image Name -->
                  <p class="mt-1 text-xs text-secondary-600 truncate">{{ image.file.name }}</p>
                  
                  <!-- Primary Image Badge -->
                  <div v-if="index === 0" class="absolute top-1 left-1">
                    <span class="bg-primary text-white text-xs px-2 py-1 rounded">
                      {{ t('primary') || 'Primary' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Reorder Instructions -->
              <div class="mt-3 space-y-1">
                <p class="text-xs text-secondary-500">
                  {{ t('firstImagePrimary') || 'The first image will be used as the primary product image' }}
                </p>
                <p class="text-xs text-secondary-400">
                  {{ t('reorderInstructions') || 'Drag images to reorder, or use the arrow buttons' }}
                </p>
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
const images = ref([]);
const categories = ref([]);
const isSubmitting = ref(false);
const isDragOver = ref(false);
const draggedIndex = ref(null);
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
  const files = Array.from(event.target.files);
  processFiles(files);
  console.log('Images uploaded:', files.length);
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

// Drag and drop functionality
const handleDrop = (event) => {
  isDragOver.value = false;
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

const processFiles = (files) => {
  files.forEach(file => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.error(`File ${file.name} is not an image`);
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      console.error(`File ${file.name} is too large (max 10MB)`);
      return;
    }
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      images.value.push({
        file: file,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });
};

// Image reordering functions
const handleDragStart = (index) => {
  draggedIndex.value = index;
};

const handleImageDrop = (dropIndex) => {
  if (draggedIndex.value !== null && draggedIndex.value !== dropIndex) {
    const draggedItem = images.value[draggedIndex.value];
    images.value.splice(draggedIndex.value, 1);
    images.value.splice(dropIndex, 0, draggedItem);
  }
  draggedIndex.value = null;
};

const moveImageLeft = (index) => {
  if (index > 0) {
    const temp = images.value[index];
    images.value[index] = images.value[index - 1];
    images.value[index - 1] = temp;
  }
};

const moveImageRight = (index) => {
  if (index < images.value.length - 1) {
    const temp = images.value[index];
    images.value[index] = images.value[index + 1];
    images.value[index + 1] = temp;
  }
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
    
    // Append multiple images
    images.value.forEach((imageData, index) => {
      formData.append('images', imageData.file);
    });

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
</style>
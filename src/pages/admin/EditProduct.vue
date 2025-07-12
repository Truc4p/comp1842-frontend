<template>
  <div class="page-background min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold gradient-text mb-2">Edit Product</h1>
        <p class="text-secondary-600 text-lg">Update product information and settings</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-4xl mx-auto">
        <div class="card p-8 text-center">
          <div class="mb-6">
            <svg class="w-20 h-20 mx-auto text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-secondary-700 mb-2">Error Loading Product</h3>
          <p class="text-secondary-500 mb-6">{{ error }}</p>
          <div class="flex justify-center gap-4">
            <button @click="fetchProduct" class="btn btn-primary">
              Try Again
            </button>
            <button @click="router.push('/admin/products')" class="btn btn-secondary">
              Back to Products
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Product Form -->
      <div v-else-if="product" class="max-w-4xl mx-auto">
        <form @submit.prevent="updateProduct" class="space-y-6">
          <!-- Product Information Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="text-xl font-semibold text-secondary-900 flex items-center gap-2">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                Product Information
              </h2>
            </div>
            
            <div class="card-body">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Product Name -->
                <div class="lg:col-span-2">
                  <label for="name" class="form-label">
                    Product Name <span class="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    v-model="name"
                    class="form-control"
                    :class="{ 'border-error focus:border-error focus:ring-error': nameError }"
                    placeholder="Enter product name"
                    required
                    @input="validateName"
                  />
                  <div v-if="nameError" class="form-error">
                    {{ nameError }}
                  </div>
                </div>

                <!-- Category -->
                <div>
                  <label for="category" class="form-label">
                    Category <span class="text-error">*</span>
                  </label>
                  <select
                    id="category"
                    v-model="category"
                    class="form-control"
                    :class="{ 'border-error focus:border-error focus:ring-error': categoryError }"
                    required
                    @change="validateCategory"
                  >
                    <option value="">Select a category</option>
                    <option v-for="cat in categories" :key="cat._id" :value="cat._id">
                      {{ cat.name }}
                    </option>
                  </select>
                  <div v-if="categoryError" class="form-error">
                    {{ categoryError }}
                  </div>
                </div>

                <!-- Price -->
                <div>
                  <label for="price" class="form-label">
                    Price <span class="text-error">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">$</span>
                    <input
                      type="number"
                      id="price"
                      v-model="price"
                      class="form-control pl-8"
                      :class="{ 'border-error focus:border-error focus:ring-error': priceError }"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                      @input="validatePrice"
                    />
                  </div>
                  <div v-if="priceError" class="form-error">
                    {{ priceError }}
                  </div>
                </div>

                <!-- Stock Quantity -->
                <div>
                  <label for="stockQuantity" class="form-label">
                    Stock Quantity <span class="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    id="stockQuantity"
                    v-model="stockQuantity"
                    class="form-control"
                    :class="{ 'border-error focus:border-error focus:ring-error': stockError }"
                    placeholder="0"
                    min="0"
                    required
                    @input="validateStock"
                  />
                  <div v-if="stockError" class="form-error">
                    {{ stockError }}
                  </div>
                </div>

                <!-- Description -->
                <div class="lg:col-span-2">
                  <label for="description" class="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    v-model="description"
                    class="form-control"
                    rows="4"
                    placeholder="Enter product description..."
                  ></textarea>
                  <p class="text-secondary-500 text-sm mt-1">
                    Provide a detailed description of your product
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Product Image Card -->
          <div class="card">
            <div class="card-header">
              <h2 class="text-xl font-semibold text-secondary-900 flex items-center gap-2">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Product Image
              </h2>
            </div>
            
            <div class="card-body">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Image Upload -->
                <div>
                  <label for="image" class="form-label">
                    Upload New Image
                  </label>
                  <label for="image" class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-secondary-300 border-dashed rounded-lg hover:border-primary-400 transition-colors duration-200 cursor-pointer">
                    <div class="space-y-1 text-center">
                      <svg class="mx-auto h-12 w-12 text-secondary-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                      <div class="flex text-sm text-secondary-600">
                        <span class="font-medium text-primary-600 hover:text-primary-500">Upload a file</span>
                        <p class="pl-1">or drag and drop</p>
                      </div>
                      <p class="text-xs text-secondary-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      id="image"
                      type="file"
                      class="sr-only"
                      accept="image/*"
                      @change="handleImageUpload"
                    />
                  </label>
                </div>

                <!-- Current Image Preview -->
                <div>
                  <label class="form-label">Current Image</label>
                  <div class="mt-1">
                    <div v-if="product.image || imagePreview" class="relative">
                      <img 
                        :src="imagePreview || getImageUrl(product.image)" 
                        alt="Product Image" 
                        class="w-full h-64 object-cover rounded-lg border border-secondary-200 shadow-sm"
                      />
                      <div v-if="imagePreview" class="absolute top-2 right-2">
                        <button
                          type="button"
                          @click="removeNewImage"
                          class="bg-error text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div v-else class="w-full h-64 bg-secondary-100 rounded-lg border border-secondary-200 flex items-center justify-center">
                      <div class="text-center">
                        <svg class="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p class="text-secondary-500 text-sm mt-2">No image available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              @click="router.push('/admin/products')"
              class="btn btn-secondary"
              :disabled="updating"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="updating || !isFormValid"
            >
              <svg v-if="updating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
              </svg>
              {{ updating ? 'Updating...' : 'Update Product' }}
            </button>
          </div>
        </form>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-6 p-4 bg-success bg-opacity-10 border border-success border-opacity-20 rounded-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-success font-medium">{{ successMessage }}</span>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="updateError" class="mt-6 p-4 bg-error bg-opacity-10 border border-error border-opacity-20 rounded-lg">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-error font-medium">{{ updateError }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { API_URL } from '../../utils/config';

const route = useRoute();
const router = useRouter();

// Reactive state
const product = ref(null);
const loading = ref(true);
const error = ref('');
const updating = ref(false);
const successMessage = ref('');
const updateError = ref('');

// Form fields
const name = ref('');
const category = ref('');
const price = ref('');
const stockQuantity = ref('');
const description = ref('');
const image = ref(null);
const imagePreview = ref('');

// Categories
const categories = ref([]);

// Form validation
const nameError = ref('');
const categoryError = ref('');
const priceError = ref('');
const stockError = ref('');

// Computed properties
const isFormValid = computed(() => {
  return name.value.trim() && 
         category.value && 
         price.value && 
         stockQuantity.value >= 0 && 
         !nameError.value && 
         !categoryError.value && 
         !priceError.value && 
         !stockError.value;
});

// Validation functions
const validateName = () => {
  nameError.value = '';
  if (!name.value.trim()) {
    nameError.value = 'Product name is required';
  } else if (name.value.trim().length < 2) {
    nameError.value = 'Product name must be at least 2 characters long';
  } else if (name.value.trim().length > 100) {
    nameError.value = 'Product name must be less than 100 characters';
  }
};

const validateCategory = () => {
  categoryError.value = '';
  if (!category.value) {
    categoryError.value = 'Please select a category';
  }
};

const validatePrice = () => {
  priceError.value = '';
  if (!price.value) {
    priceError.value = 'Price is required';
  } else if (parseFloat(price.value) <= 0) {
    priceError.value = 'Price must be greater than 0';
  } else if (parseFloat(price.value) > 999999) {
    priceError.value = 'Price cannot exceed $999,999';
  }
};

const validateStock = () => {
  stockError.value = '';
  if (stockQuantity.value === '' || stockQuantity.value === null) {
    stockError.value = 'Stock quantity is required';
  } else if (parseInt(stockQuantity.value) < 0) {
    stockError.value = 'Stock quantity cannot be negative';
  } else if (parseInt(stockQuantity.value) > 999999) {
    stockError.value = 'Stock quantity cannot exceed 999,999';
  }
};

// Fetch functions
const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please log in again.';
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const response = await axios.get(`${API_URL}/categories`, {
      headers: {
        'x-auth-token': token,
      },
    });
    categories.value = response.data;
  } catch (err) {
    console.error('Error fetching categories:', err);
    // Don't set error here as it's not critical for loading
  }
};

const fetchProduct = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'Authentication required. Please log in again.';
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const productId = route.params.id;
    const response = await axios.get(`${API_URL}/products/${productId}`, {
      headers: {
        'x-auth-token': token,
      },
    });
    
    product.value = response.data;
    
    // Populate form fields
    name.value = product.value.name;
    category.value = product.value.category?._id || '';
    price.value = product.value.price;
    stockQuantity.value = product.value.stockQuantity;
    description.value = product.value.description || '';
    
  } catch (err) {
    console.error('Error fetching product details:', err);
    if (err.response?.status === 404) {
      error.value = 'Product not found. It may have been deleted.';
    } else if (err.response?.status === 401) {
      error.value = 'Authentication failed. Please log in again.';
      setTimeout(() => router.push('/login'), 2000);
    } else {
      error.value = 'Failed to load product details. Please try again.';
    }
  } finally {
    loading.value = false;
  }
};

// Image handling
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      updateError.value = 'Please select a valid image file';
      return;
    }
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      updateError.value = 'Image size must be less than 10MB';
      return;
    }
    
    image.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // Clear any previous error
    updateError.value = '';
  }
};

const removeNewImage = () => {
  image.value = null;
  imagePreview.value = '';
};

// Update product
const updateProduct = async () => {
  // Clear previous messages
  successMessage.value = '';
  updateError.value = '';
  
  // Validate all fields
  validateName();
  validateCategory();
  validatePrice();
  validateStock();
  
  if (!isFormValid.value) {
    updateError.value = 'Please fix the errors above before submitting';
    return;
  }
  
  updating.value = true;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      updateError.value = 'Authentication required. Please log in again.';
      router.push('/login');
      return;
    }

    const productId = route.params.id;
    const formData = new FormData();
    
    formData.append('name', name.value.trim());
    formData.append('categoryId', category.value);
    formData.append('price', price.value);
    formData.append('stockQuantity', stockQuantity.value);
    formData.append('description', description.value.trim());
    
    if (image.value) {
      formData.append('image', image.value);
    }

    const response = await axios.put(`${API_URL}/products/${productId}`, formData, {
      headers: {
        'x-auth-token': token,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Product updated successfully:', response.data);
    successMessage.value = 'Product updated successfully!';
    
    // Redirect after a short delay to show success message
    setTimeout(() => {
      router.push('/admin/products');
    }, 1500);
    
  } catch (err) {
    console.error('Error updating product:', err);
    
    if (err.response?.status === 401) {
      updateError.value = 'Authentication failed. Please log in again.';
      router.push('/login');
    } else if (err.response?.status === 404) {
      updateError.value = 'Product not found. It may have been deleted.';
    } else if (err.response?.status === 400) {
      updateError.value = err.response.data?.message || 'Invalid product data. Please check your inputs.';
    } else if (err.response?.data?.message) {
      updateError.value = err.response.data.message;
    } else {
      updateError.value = 'Failed to update product. Please try again.';
    }
  } finally {
    updating.value = false;
  }
};

// Utility functions
const getImageUrl = (relativePath) => {
  return `${API_URL}/${relativePath}`;
};

// Initialize component
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchProduct()]);
});
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card {
  animation: fadeIn 0.3s ease-out;
}

/* Enhanced form focus states */
.form-control:focus {
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft), 0 0 0 3px rgba(20, 184, 166, 0.1);
}

/* Button hover effects */
.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

/* Loading state for form */
.form-control:disabled {
  background-color: var(--secondary-100);
  cursor: not-allowed;
}

/* Image upload area hover effect */
.border-dashed:hover {
  background-color: var(--primary-50);
}

/* File input styling */
input[type="file"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

/* Enhanced select styling */
select.form-control {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

/* Grid responsive adjustments */
@media (max-width: 1024px) {
  .grid.lg\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
  
  .lg\\:col-span-2 {
    grid-column: span 1;
  }
}
</style>
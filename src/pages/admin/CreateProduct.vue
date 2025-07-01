<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ t('createProduct') }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productName') }}:</label>
        <input type="text" id="name" v-model="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required />
      </div>

      <div class="mb-4">
        <label for="category" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productCategory') }}:</label>
        <select id="category" v-model="category"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required>
          <option value="" disabled>{{ t('selectCategory') }}</option>
          <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="mb-4">
        <label for="price" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productPrice') }}:</label>
        <input type="number" id="price" v-model="price"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required />
      </div>

      <div class="mb-4">
        <label for="stockQuantity" class="block text-gray-700 text-sm font-bold mb-2">{{ t('stockQuantity') }}:</label>
        <input type="number" id="stockQuantity" v-model="stockQuantity"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required />
      </div>

      <div class="mb-4">
        <label for="description" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productDescription')
          }}:</label>
        <textarea id="description" v-model="description"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
      </div>

      <div class="mb-4">
        <label for="image" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productImage') }}:</label>
        <input type="file" id="image" @change="handleImageUpload"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         />
      </div>

      <button type="submit"
        class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {{ t('createProduct') }}
      </button>
    </form>
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
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('name', name.value);
    formData.append('categoryId', category.value);
    formData.append('price', price.value);
    formData.append('stockQuantity', stockQuantity.value);
    formData.append('description', description.value);
    formData.append('image', image.value);

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
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
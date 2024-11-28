<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ t('createProduct') }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="name-en" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productNameEn') }}:</label>
        <input type="text" id="name-en" v-model="name.en"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required />
      </div>
      <div class="mb-4">
        <label for="name-vi" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productNameVi') }}:</label>
        <input type="text" id="name-vi" v-model="name.vi"
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
        <label for="description-en" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productDescriptionEn')
          }}:</label>
        <textarea id="description-en" v-model="description.en"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required></textarea>
      </div>
      <div class="mb-4">
        <label for="description-vi" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productDescriptionVi')
          }}:</label>
        <textarea id="description-vi" v-model="description.vi"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required></textarea>
      </div>

      <div class="mb-4">
        <label for="image" class="block text-gray-700 text-sm font-bold mb-2">{{ t('productImage') }}:</label>
        <input type="file" id="image" @change="handleImageUpload"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required />
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

const { t } = useI18n();

const name = ref({ en: '', vi: '' });
const category = ref('');
const price = ref('');
const stockQuantity = ref('');
const description = ref({ en: '', vi: '' });
const image = ref(null);
const categories = ref([]);
const router = useRouter();

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/categories', {
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
};

const handleSubmit = async () => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    // Log the values of name.en and name.vi
    console.log('name.en:', name.value.en);
    console.log('name.vi:', name.value.vi);

    formData.append('name[en]', name.value.en);
    formData.append('name[vi]', name.value.vi);
    formData.append('categoryId', category.value);
    formData.append('price', price.value);
    formData.append('stockQuantity', stockQuantity.value);
    formData.append('description[en]', description.value.en);
    formData.append('description[vi]', description.value.vi);
    formData.append('image', image.value);

    // Log the contents of formData
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    const response = await axios.post('http://localhost:3000/products', formData, {
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
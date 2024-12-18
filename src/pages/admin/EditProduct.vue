<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Edit Product</h2>
    <div v-if="product">
      <form @submit.prevent="updateProduct">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input type="text" id="name" v-model="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="category">
            Category
          </label>
          <select v-model="category"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="category">
            <option :value="product.categoryId" selected>{{ product.category ? product.category.name : 'No Category' }}</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
            Price
          </label>
          <input v-model="price"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="price" type="number" placeholder="Product Price" />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="stockQuantity">
            Stock Quantity
          </label>
          <input v-model="stockQuantity"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="stockQuantity" type="number" placeholder="Stock Quantity" />
        </div>

        <div class="mb-4">
          <label for="description" class="block text-gray-700 text-sm font-bold mb-2">Description:</label>
          <textarea id="description" v-model="description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="image">
            Image
          </label>
          <input type="file" id="image" @change="handleImageUpload"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <div v-if="product.image" class="mt-2">
            <img :src="getImageUrl(product.image)" alt="Product Image" class="w-64 h-64 object-cover" />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Save
          </button>
          <router-link to="../">
            <button
              class="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button">
              Cancel
            </button>
          </router-link>
        </div>
      </form>
    </div>
    <div v-else>
      <p>Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const product = ref(null);
const name = ref('');
const category = ref('');
const price = ref('');
const stockQuantity = ref('');
const description = ref('');
const image = ref(null);
const categories = ref([]);
const route = useRoute();
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

const fetchProduct = async () => {
  const productId = route.params.id;
  try {
    const response = await axios.get(`http://localhost:3000/products/${productId}`);
    product.value = response.data;
    name.value = product.value.name;
    category.value = product.value.category._id;
    price.value = product.value.price;
    stockQuantity.value = product.value.stockQuantity;
    description.value = product.value.description;
  } catch (error) {
    console.error('Error fetching product details:', error);
  }
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  image.value = file;
};

const updateProduct = async () => {
  const productId = route.params.id;
  try {
    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('categoryId', category.value);
    formData.append('price', price.value);
    formData.append('stockQuantity', stockQuantity.value);
    formData.append('description', description.value);
    if (image.value) {
      formData.append('image', image.value);
    }

    const response = await axios.put(`http://localhost:3000/products/${productId}`, formData, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Product updated successfully:', response.data);
    router.push('/admin/products');
  } catch (error) {
    console.error('Error updating product:', error);
  }
};

onMounted(() => {
  fetchCategories();
  fetchProduct();
});

const getImageUrl = (relativePath) => {
  return `http://localhost:3000/${relativePath}`; // Adjust the base URL as needed
};
</script>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();

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

onMounted(() => {
  fetchProducts();
});

const changeLanguage = (event) => {
  locale.value = event.target.value;
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1>{{ t('welcomeMessage') }}</h1>
    <select @change="changeLanguage">
      <option value="en">English</option>
      <option value="vi">Vietnamese</option>
    </select>
    <!-- Products Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td class="py-2 px-4 border-b">{{ product._id }}</td>
            <td class="py-2 px-4 border-b">{{ product.name }}</td>
            <td class="py-2 px-4 border-b">{{ product.category ? product.category.name : 'No Category' }}</td>
          </tr>
        </tbody>
      </table>
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
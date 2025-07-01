<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t } = useI18n();
const router = useRouter();

const products = ref([]);

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first");
    router.push("/login");
  }

  // Make the api request with axios with token in header
  const res = await axios.get(`${API_URL}/products`, {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  console.log("Products response:", res.data);
  products.value = res.data;
});

const getImageUrl = (relativePath) => {
  const url = `${API_URL}/${relativePath}`; // Adjust the base URL as needed
  console.log('Image URL:', url); // Log the image URL
  return url;
};

const onImageError = (event) => {
  console.log('Image failed to load, using fallback image.');
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
};

</script>

<template>
  <div class="container mx-auto p-4">
    <!-- Create Product Button -->
    <div class="flex mb-4">
      <router-link to="/admin/create-product">
        <button class="btn-primary" @click="createProduct">
          Create Product
        </button>
      </router-link>  
    </div>

    <!-- Products Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <!-- <th class="py-2 px-4 border-b">ID</th> -->
            <th class="py-2 px-4 border-b">{{ t('productName') }}</th>
            <th class="py-2 px-4 border-b">Image</th>
            <th class="py-2 px-4 border-b">{{ t('productCategory') }}</th>
            <th class="py-2 px-4 border-b">Stock Quantity</th>
            <th class="py-2 px-4 border-b">Price</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <!-- <td class="py-2 px-4 border-b">{{ product._id }}</td> -->
            <td class="py-2 px-4 border-b">{{ product.name }}</td>
            <td class="py-2 px-4 border-b">
              <img :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" alt="Product Image" class="w-32 h-32 object-cover" @error="onImageError" />
            </td>
            <td class="py-2 px-4 border-b">{{ product.category ? product.category.name : 'No Category' }}</td>
            <td class="py-2 px-4 border-b">{{ product.stockQuantity }}</td>
            <td class="py-2 px-4 border-b">${{ product.price }}</td>
            <td class="py-2 px-4 border-b">
              
                <router-link :to="`/admin/products/edit/${product._id}`">
                    <button class="btn-edit">
                    Edit
                    </button>
                </router-link>    

                <router-link :to="`/admin/products/delete/${product._id}`">
                    <button class="btn-delete">
                        Delete
                    </button>
                </router-link>

                <router-link :to="`/admin/products/${product._id}`">
                    <button class="btn-details">
                    Details
                    </button>
                </router-link>

            </td>
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
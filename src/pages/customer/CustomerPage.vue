<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const products = ref([]);
const cart = ref([]);
const premium = ref(true);

const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first");
    router.push("/login");
    return;
  }

  // Make the api request with axios with token in header
  const res = await axios.get("http://localhost:3000/products", {
    headers: {
      "x-auth-token": `${token}`,
    },
  });

  console.log("Products response:", res.data);
  products.value = res.data;
};

const getImageUrl = (relativePath) => {
  return `http://localhost:3000/${relativePath}`; // Adjust the base URL as needed
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
};

const updateCart = (id) => {
  cart.value.push(id);
};

const viewDetails = (id) => {
  console.log("View details");
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1>Customer Page</h1>
    <!-- Products Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th class="py-2 px-4 border-b">Name</th>
            <th class="py-2 px-4 border-b">Image</th>
            <th class="py-2 px-4 border-b">Category</th>
            <th class="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td class="py-2 px-4 border-b">{{ product.name }}</td>
            <td class="py-2 px-4 border-b">
              <img :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" alt="Product Image" class="w-64 h-64 object-cover" @error="onImageError" />
            </td>
            <td class="py-2 px-4 border-b">{{ product.category ? product.category.name : 'No Category' }}</td>
            <td class="py-2 px-4 border-b">
            <router-link :to="`/products/${product._id}`">
              <button class="btn-details" @click="viewDetails(product._id)">
                Details
              </button>
            </router-link>

            <button class="btn-primary" @click="updateCart(product._id)">Add to Cart</button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>

    <!-- Cart -->
    <div>
      <h2>Cart</h2>
      <ul>
        <li v-for="item in cart" :key="item">{{ item }}</li>
      </ul>
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
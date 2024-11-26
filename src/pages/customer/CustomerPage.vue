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

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Customer Page</h1>
    <!-- Cart -->
    <div class="cart">Cart({{ cart.length }})</div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product._id"
        class="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <img :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" alt="Product Image"
          class="w-full h-48 object-cover" @error="onImageError" />
        <div class="p-4">
          <h2 class="text-lg font-bold mb-2">{{ product.name }}</h2>
          <p class="text-gray-700 mb-2">{{ product.category ? product.category.name : 'No Category' }}</p>
          <p class="text-gray-900 font-bold mb-4">${{ product.price }}</p>
          <div class="flex justify-between">
            <router-link :to="`/customer/products/${product._id}`">
              <button class="btn-details">
                Details
              </button>
            </router-link>
            <button class="btn-primary" @click="updateCart(product._id)">Add to Cart</button>
          </div>
        </div>
      </div>
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
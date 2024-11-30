<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const router = useRouter();
const products = ref([]);
const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);
const searchQuery = ref('');

const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert(t('login'));
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

const updateCart = (product, quantity) => {
  const cartItem = cart.value.find(item => item._id === product._id);
  if (cartItem) {
    if (cartItem.quantity + quantity > product.stockQuantity) {
      alert(t('registerFail') + 'You have reached the maximum stock quantity for this product.');
      return;
    }
    cartItem.quantity += quantity;
  } else {
    if (quantity > product.stockQuantity) {
      alert(t('registerFail') + 'You have reached the maximum stock quantity for this product.');
      return;
    }
    cart.value.push({ ...product, quantity });
  }
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const validateQuantity = (product) => {
  if (product.quantity > product.stockQuantity) {
    product.quantity = product.stockQuantity;
  }
};

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    return product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (product.category && product.category.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  });
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('customerPage') }}</h1>
    <!-- Search -->
    <input type="text" v-model="searchQuery" placeholder="Search products or categories" class="search-input mb-4" />

    <!-- Cart -->
    <router-link to="/customer/cart" class="cart-link mb-4">
      <i class="fas fa-shopping-cart"></i> {{ t('cart') }} ({{ cart.length }})
    </router-link>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="product in filteredProducts" :key="product._id"
        class="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md">
        <router-link :to="`/customer/products/${product._id}`" class="block">
          <img :src="product.image ? getImageUrl(product.image) : '/images/fallback-image.jpg'" alt="Product Image"
            class="w-full h-48 object-cover" @error="onImageError" />
          <div class="p-4">
            <h2 class="text-lg font-bold mb-2">{{ product.name }}</h2>
            <p class="text-gray-700 mb-2">{{ product.category ? product.category.name : 'No Category' }}</p>
            <p class="text-gray-900 font-bold mb-4">${{ product.price }}</p>
          </div>
        </router-link>
        <div class="flex p-4 ml-12">
          <input type="number" v-model.number="product.quantity" min="1" :max="product.stockQuantity"
            class="quantity-input" @input="validateQuantity(product)" />
          <button class="btn-primary" @click="updateCart(product, product.quantity || 1)">{{ t('addToCart') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.quantity-input {
  @apply border border-gray-300 rounded px-2 py-1 w-16 text-center;
}

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

.search-input {
  @apply border border-gray-300 rounded px-4 py-2 w-full;
}

.cart-link {
  display: flex;
  align-items: center;
  font-size: 1.2em;
  color: #333;
  text-decoration: none;
  padding: 0.5em 1em;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.cart-link:hover {
  background-color: #dff8c5;
}

.cart-link i {
  margin-right: 0.5em;
}
</style>
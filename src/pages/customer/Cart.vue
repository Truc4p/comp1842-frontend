<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const cart = ref(JSON.parse(localStorage.getItem('cart')) || []);

const getImageUrl = (relativePath) => {
  return `http://localhost:3000/${relativePath}`; // Adjust the base URL as needed
};

const onImageError = (event) => {
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
};

const removeFromCart = (productId) => {
  cart.value = cart.value.filter(item => item._id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const fetchCartDetails = async () => {
  for (const item of cart.value) {
    try {
      const response = await axios.get(`http://localhost:3000/products/${item._id}`);
      const product = response.data;
      item.name = product.name;
      item.category = product.category;
      item.price = product.price;
      item.image = product.image;
      item.stockQuantity = product.stockQuantity;
      console.log('Fetched item details:', item);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  }
  localStorage.setItem('cart', JSON.stringify(cart.value));
};

const validateQuantity = (item) => {
  if (item.quantity > item.stockQuantity) {
    item.quantity = item.stockQuantity;
  }
};

const handleSubmitItem = async (event) => {
  event.preventDefault();

  // Validate cart items
  for (const item of cart.value) {
    if (item.quantity < 1) {
      alert(`Quantity for ${item.name} must be at least 1.`);
      return;
    }
    if (item.quantity > item.stockQuantity) {
      alert(`Quantity for ${item.name} exceeds available stock.`);
      return;
    }
  }

  // Transform cart items to match ProductSchema
  const transformedCartItems = cart.value.map(item => ({
    productId: item._id,
    quantity: item.quantity
  }));

  try {
    // Submit transformed cart items to the checkout endpoint
    console.log('Cart items submitted successfully:', { items: transformedCartItems });

    // Navigate to the checkout page with query parameters
    router.push({ 
      path: '/customer/checkout',
      query: { items: JSON.stringify(transformedCartItems) }
    });
  } catch (error) {
    console.error('Error submitting cart items:', error);
    alert('There was an error submitting your cart. Please try again.');
  }
};

const totalCost = computed(() => {
  return cart.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

onMounted(() => {
  fetchCartDetails();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Your Cart</h1>
    <div v-if="cart.length === 0">
      <p>Your cart is empty.</p>
    </div>
    <div v-else>
      <div v-for="item in cart" :key="item._id" class="cart-item mb-4 p-4 border border-gray-300 rounded-lg">
        <img :src="item.image ? getImageUrl(item.image) : '/images/fallback-image.jpg'" alt="Product Image"
          class="w-24 h-24 object-cover mr-4" @error="onImageError" />
        <div class="flex-1">
          <h2 class="text-lg font-bold">{{ item.name }}</h2>
          <p class="text-gray-700">{{ item.category ? item.category.name : 'No Category' }}</p>
          <p class="text-gray-900 font-bold">${{ item.price }}</p>
          <input type="number" v-model.number="item.quantity" min="1" :max="item.stockQuantity" class="quantity-input"
            @input="validateQuantity(item)" />
          <button class="btn-delete" @click="removeFromCart(item._id)">Remove</button>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <p class="text-lg font-bold">Total Cost: ${{ totalCost }}</p>
      </div>
      <router-link :to="`/customer/checkout`">
        <div class="flex justify-end mt-4">
          <button class="btn-primary" @click="handleSubmitItem">Checkout</button>
        </div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.cart-item {
  @apply flex items-center;
}

.quantity-input {
  @apply border border-gray-300 rounded px-2 py-1 w-16 text-center;
}

.btn-primary {
  @apply bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500;
}

.btn-delete {
  @apply bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 mx-1;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);

const fetchOrders = async () => {
  try {
    const response = await axios.get('http://localhost:3000/orders');
    orders.value = response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Your Orders</h1>
    <div v-if="orders.length === 0">
      <p>You have no orders.</p>
    </div>
    <div v-else>
      <div v-for="order in orders" :key="order._id" class="order-item mb-4 p-4 border border-gray-300 rounded-lg">
        <h2 class="text-lg font-bold">Order #{{ order._id }}</h2>
        <p class="text-gray-700">Date: {{ new Date(order.date).toLocaleDateString() }}</p>
        <p class="text-gray-900 font-bold">Total: ${{ order.total }}</p>
        <div v-for="item in order.items" :key="item._id" class="order-product flex items-center mt-2">
          <img :src="item.image" alt="Product Image" class="w-16 h-16 object-cover mr-4" />
          <div>
            <h3 class="text-md font-bold">{{ item.name }}</h3>
            <p class="text-gray-700">Quantity: {{ item.quantity }}</p>
            <p class="text-gray-900 font-bold">Price: ${{ item.price }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-item {
  @apply flex flex-col;
}

.order-product {
  @apply flex items-center;
}
</style>
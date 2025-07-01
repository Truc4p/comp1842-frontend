<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const router = useRouter();
const { t } = useI18n();

const orders = ref([]);

// Get userId from localStorage
const userId = localStorage.getItem('userId');
if (!userId) {
  console.error('userId is not found in localStorage');
  // Handle the case where userId is not found, e.g., redirect to login page
  router.push('/login');
} else {
  console.log('userId:', userId); // Add this line to check the value of userId
}

const fetchOrders = async () => {
  try {
    console.log('Getting customer with ID:', userId); // Log userId
    const token = localStorage.getItem("token");
    if (!token) {
      alert(t('login'));
      return;
    }
    const response = await axios.get(`${API_URL}/orders/user/${userId}`, {
      headers: {
        "x-auth-token": token,
      },
    });
    orders.value = response.data;
    console.log('Orders response:', response.data);
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
        <router-link :to="`/customer/orders/order/${order._id}`" class="block">
          <h2 class="text-lg font-bold">Order #{{ order._id }}</h2>
          <p class="text-gray-700">Date: {{ new Date(order.orderDate).toLocaleDateString() }}</p>
          <p class="text-gray-900 font-bold">Total: ${{ order.totalPrice }}</p>
          <div v-for="item in order.items" :key="item._id" class="order-product flex items-center mt-2">
            <img :src="item.image" alt="Product Image" class="w-16 h-16 object-cover mr-4" />
            <div>
              <h3 class="text-md font-bold">{{ item.name }}</h3>
              <p class="text-gray-700">Quantity: {{ item.quantity }}</p>
              <p class="text-gray-900 font-bold">Price: ${{ item.price }}</p>
            </div>
          </div>
        </router-link>
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
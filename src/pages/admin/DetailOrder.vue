<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ t('orderDetails') }}</h2>
    <div v-if="order">
      <p><strong>{{ t('orderId') }}:</strong> {{ order._id }}</p>
      <p><strong>{{ t('orderUser') }}:</strong> {{ order.user.name }}</p>
      <p><strong>{{ t('orderDate') }}:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>
      <p><strong>{{ t('paymentMethod') }}:</strong> {{ t(order.paymentMethod) }}</p>
      <div>
        <h3 class="text-xl font-bold mb-2">{{ t('orderProducts') }}</h3>
        <ul>
          <li v-for="product in order.products" :key="product.productId">
            <p><strong>{{ t('productId') }}:</strong> {{ product.productId }}</p>
            <p><strong>{{ t('quantity') }}:</strong> {{ product.quantity }}</p>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>{{ t('loading') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const order = ref(null);
const route = useRoute();

onMounted(async () => {
  const orderId = route.params.id;
  console.log('Fetching order with ID:', orderId); // Debugging log
  try {
    const response = await axios.get(`http://localhost:3000/orders/order/${orderId}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    console.log('API response:', response.data); // Debugging log
    order.value = response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
  }
});
</script>

<style scoped>
/* Add your styles here */
</style>
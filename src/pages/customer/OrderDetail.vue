<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ t('orderDetails') }}</h2>
    <div v-if="order">
      <div class="mb-4">
        <p><strong>{{ t('orderId') }}:</strong> {{ order._id }}</p>
        <!-- <p><strong>{{ t('orderUser') }}:</strong> {{ username }}</p> -->
        <p><strong>{{ t('orderUser') }}:</strong> {{ order.user }}</p>
        <p><strong>{{ t('orderDate') }}:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>
        <p><strong>{{ t('paymentMethod') }}:</strong> {{ t(order.paymentMethod) }}</p>
        <p><strong>{{ t('totalPrice') }}:</strong> ${{ t(order.totalPrice) }}</p>
        <router-link :to="`/customer/orders/delete/${order._id}`">
          <button class="btn-delete">
            {{ t('deleteOrder') }}
          </button>
        </router-link>
      </div>
      <br>
      <div>
        <h3 class="text-xl font-bold mb-2">{{ t('orderProducts') }}</h3>
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2">{{ t('productId') }}</th>
              <th class="py-2">{{ t('name') }}</th>
              <th class="py-2">{{ t('image') }}</th>
              <th class="py-2">{{ t('price') }}</th>
              <th class="py-2">{{ t('quantity') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in order.products" :key="product.productId" class="border-t">
              <td class="py-2">{{ product.productId._id }}</td>
              <td class="py-2">{{ product.productId.name }} </td>
              <td class="py-2">
                <img
                  :src="product.productId.image ? getImageUrl(product.productId.image) : '/images/fallback-image.jpg'"
                  alt="Product Image" class="w-32 h-32 object-cover" @error="onImageError" />
              </td>
              <td class="py-2">${{ product.productId.price }}</td>
              <td class="py-2">{{ product.quantity }}</td>
            </tr>
          </tbody>
        </table>
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
import { API_URL } from '../../utils/config';

const { t } = useI18n();
const order = ref(null);
const route = useRoute();
const username = ref('');

const getImageUrl = (relativePath) => {
  const url = `${API_URL}/${relativePath}`; // Adjust the base URL as needed
  console.log('Image URL:', url); // Log the image URL
  return url;
};

const onImageError = (event) => {
  console.log('Image failed to load, using fallback image.');
  event.target.src = '/images/fallback-image.jpg'; // Provide a fallback image URL
};

onMounted(async () => {
  const orderId = route.params.id;
  console.log('Fetching order with ID:', orderId); // Debugging log
  try {
    const response = await axios.get(`${API_URL}/orders/order/${orderId}`, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    console.log('API response:', response.data); // Debugging log
    order.value = response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
  }

  username.value = localStorage.getItem('username');
  console.log('Username:', username.value);
});
</script>

<style scoped>
.btn-delete {
  @apply bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500 mx-1;
}</style>
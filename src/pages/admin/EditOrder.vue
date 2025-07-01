<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">{{ t('orderDetails') }}</h2>
    <div v-if="order">
      <div class="mb-4">
        <p><strong>{{ t('orderId') }}:</strong> {{ order._id }}</p>
        <p><strong>{{ t('orderUser') }}:</strong> {{ order.user }}</p>
        <p><strong>{{ t('orderDate') }}:</strong> {{ new Date(order.orderDate).toLocaleString() }}</p>
        <p><strong>{{ t('paymentMethod') }}:</strong> {{ t(order.paymentMethod) }}</p>
        <p><strong>{{ t('totalPrice') }}:</strong> ${{ t(order.totalPrice) }}</p>

        <form @submit.prevent="updateOrder">
          <p><strong>{{ t('orderStatus') }}:</strong> {{ t(order.status) }}</p>

          <div class="mb-4">
            <!-- <label class="block text-gray-700 text-sm font-bold mb-2" for="status">
              {{ t('orderStatus') }}
            </label> -->
            <select v-model="selectedStatus"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="status">
              <option v-for="statusOption in statusOptions" :key="statusOption" :value="statusOption">
                {{ t(statusOption) }}
              </option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <button
              class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
      <br>
      <div>
        <h3 class="text-xl font-bold mb-2">{{ t('orderProducts') }}</h3>
        <table class="min-w-full bg-white">
          <thead>
            <tr>
              <th class="py-2">{{ t('productId') }}</th>
              <th class="py-2">{{ t('name') }}</th>
              <th class="py-2">{{ t('category') }}</th>
              <th class="py-2">{{ t('image') }}</th>
              <th class="py-2">{{ t('price') }}</th>
              <th class="py-2">{{ t('stockQuantity') }}</th>
              <th class="py-2">{{ t('quantity') }}</th>


            </tr>
          </thead>
          <tbody>
            <tr v-for="product in order.products" :key="product.productId" class="border-t">
              <td class="py-2">{{ product.productId._id }}</td>
              <td class="py-2">{{ product.productId.name }} </td>
              <td class="py-2">{{ product.productId.category }}</td>
              <td class="py-2">
                <img
                  :src="product.productId.image ? getImageUrl(product.productId.image) : '/images/fallback-image.jpg'"
                  alt="Product Image" class="w-32 h-32 object-cover" @error="onImageError" />
              </td>
              <td class="py-2">${{ product.productId.price }}</td>
              <td class="py-2">{{ product.productId.stockQuantity }}</td>
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
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t } = useI18n();
const order = ref(null);
const route = useRoute();
const router = useRouter(); // Create a router instance

const selectedStatus = ref('');
const statusOptions = ['pending', 'processing', 'shipped', 'delivered'];

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
});

const updateOrder = async () => {
  const orderId = route.params.id;
  console.log('Updating order status:', selectedStatus.value);

  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}`, { status: selectedStatus.value }, {
      headers: {
        'x-auth-token': localStorage.getItem('token'),
      },
    });
    console.log("Order status updated successfully:", response.data);
    router.push('/admin/orders');
  } catch (error) {
    console.error("Error updating order status:", error);
  }
};

</script>

<style scoped>
/* Add your styles here */
</style>
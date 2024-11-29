<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const orderDetails = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchOrderDetails = async () => {
    // const orderId = router.currentRoute.value.params.id;
    // try {
    //     const response = await axios.get(`http://localhost:3000/orders/${orderId}`);
    //     orderDetails.value = response.data;
    // } catch (error) {
    //     console.error('Error fetching order details:', error);
    //     error.value = 'Error fetching order details. Please try again later.';
    // } finally {
    //     loading.value = false;
    // }
};

onMounted(() => {
    fetchOrderDetails();
});
</script>

<template>
    <div class="container mx-auto p-4">
        <h1>Order Success</h1>
        <div v-if="loading">Loading...</div>
        <div v-else>
            <p v-if="error">{{ error }}</p>
            <div v-else>
                <p>Order placed successfully!</p>
                <p>Order ID: {{ orderDetails._id }}</p>
                <p>Order Date: {{ orderDetails.createdAt }}</p>
                <p>Order Total: ${{ orderDetails.totalPrice }}</p>
            </div>
        </div>
    </div>
  </template>
  
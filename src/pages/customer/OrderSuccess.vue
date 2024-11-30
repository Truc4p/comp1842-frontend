<script setup>

</script>

<template>
    <div class="container mx-auto p-4">
        <h1>Order placed successfully!</h1>
    </div>
    const orderId = response.data._id; // Assuming the response contains the order ID
    router.push(`/customer/orders/${orderId}`);
    <router-link :to="`/customer/orders/order/${order._id}`">
        <button class="btn-details">
            View Order
        </button>
    </router-link>
</template>
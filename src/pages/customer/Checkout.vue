<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const customerDetails = ref({
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'cash',
});

// Parse the cart items from the query parameters
const cartItems = ref([]);
if (route.query.items) {
    try {
        cartItems.value = JSON.parse(route.query.items);
    } catch (error) {
        console.error('Error parsing cart items:', error);
    }
}

// Get userId from localStorage
const userId = localStorage.getItem('userId');
if (!userId) {
    console.error('userId is not found in localStorage');
    // Handle the case where userId is not found, e.g., redirect to login page
    router.push('/login');
} else {
    console.log('userId:', userId); // Add this line to check the value of userId
}

const updateUser = async () => {
    try {
        const formData = {
            phone: customerDetails.value.phone,
            email: customerDetails.value.email,
            address: customerDetails.value.address,
        };

        console.log('Updating customer with phone:', customerDetails.value.phone); // Log userId
        console.log('Updating customer with email:', customerDetails.value.email); // Log userId
        console.log('Updating customer with address:', customerDetails.value.address); // Log userId
        console.log('Updating customer with ID:', userId); // Log userId

        const response = await axios.put(`http://localhost:3000/users/${userId}`, formData, {
            headers: {
                'x-auth-token': localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });
        console.log('Customer updated successfully:', response.data);
    } catch (error) {
        console.error('Error updating customer:', error);
        console.error('Error response:', error.response); // Log the error response
    }
};

// const updateUser = async (userId, updateData) => {
//   try {
//     console.log('Updating customer with username:', updateData.username);

//     console.log('Updating customer with phone:', updateData.phone);
//     console.log('Updating customer with email:', updateData.email);
//     console.log('Updating customer with address:', updateData.address);
//     console.log('Updating customer with ID:', userId);

//     const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
//     const response = await axios.put(`http://localhost:3000/users/${userId}`, updateData, {
//       headers: {
//         'x-auth-token': token,
//         'Content-Type': 'application/json',
//       },
//     });
//     console.log('Customer updated successfully:', response.data);
//   } catch (error) {
//     console.error('Error updating customer:', error);
//   }
// };

// // Example usage
// const updateData = {
//     username: 'newusername',
//   email: 'newemail@example.com',
//   phone: '123-456-7890',
//   address: '123 Main St, Anytown, USA'
// };
// updateUser(userId, updateData);

const getCustomer = async () => {
    try {
        console.log('Getting customer with ID:', userId); // Log userId
        const response = await axios.get(`http://localhost:3000/users/${userId}`, {
            headers: {
                'x-auth-token': localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });
        console.log('Customer retrieved successfully:', response.data);
    } catch (error) {
        console.error('Error retrieving customer:', error);
    }
};

const placeOrder = async () => {
    try {
        const orderData = {
            user: userId,
            products: cartItems.value,
            paymentMethod: customerDetails.value.paymentMethod,
            orderDate: new Date(),
        };

        console.log('Order data:', orderData); // Log order data

        const response = await axios.post('http://localhost:3000/orders', orderData, {
            headers: {
                'x-auth-token': localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });

        console.log('Order placed successfully:', response.data);
        alert("Order placed successfully!");

        // Remove the cart items in cart
        console.log('localStorage:', localStorage.getItem('cart'));
        localStorage.removeItem('cart');

        // Redirect to the order details page
        const orderId = response.data._id; // Assuming the response contains the order ID
        router.push(`/customer/orders/order/${orderId}`);
        //router.push(`/customer/order-success`);
    } catch (error) {
        console.error('Error placing order:', error);
        if (error.response) {
            console.error('Error response data:', error.response.data); // Log error response data
            console.error('Error response status:', error.response.status); // Log error response status
            console.error('Error response headers:', error.response.headers); // Log error response headers
        }
        alert('There was an error placing your order. Please try again.');
    }
};

const handleSubmit = async () => {
    await updateUser();
    await getCustomer();
    await placeOrder();
};

</script>

<template>
    <div class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">Checkout</h1>
        <div class="mb-4">
            <h2 class="text-xl font-bold mb-2">Customer Details</h2>
            <form @submit.prevent="handleSubmit">
                <div class="mb-2">
                    <label class="block mb-1">Phone</label>
                    <input v-model="customerDetails.phone" type="tel" class="input" />
                </div>
                <div class="mb-2">
                    <label class="block mb-1">Email</label>
                    <input v-model="customerDetails.email" type="text" class="input" />
                </div>
                <div class="mb-2">
                    <label class="block mb-1">Address</label>
                    <input v-model="customerDetails.address" type="text" class="input" />
                </div>
                <div class="mb-2">
                    <label class="block mb-1">Payment Method</label>
                    <select v-model="customerDetails.paymentMethod" class="input">
                        <option value="cash">Cash</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>
                <button type="submit" class="btn-primary">Place Order</button>
            </form>
        </div>
    </div>
</template>

<style scoped>
.input {
    @apply border border-gray-300 rounded px-2 py-1 w-full;
}

.btn-primary {
    @apply bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500;
}
</style>
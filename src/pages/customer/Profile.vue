<template>
    <div class="container mx-auto p-4">
        <h2 class="text-2xl font-bold mb-4">{{ t('profile') }}</h2>
        <div v-if="user">
            <p><strong>ID:</strong> {{ user._id }}</p>
            <p><strong>{{ t('username') }}:</strong> {{ user.username }}</p>
            <p><strong>Email:</strong> {{ user.email ? user.email : 'No Email' }}</p>
            <p><strong>{{ t('phone') }}:</strong> {{ user.phone ? user.phone : t('noPhone') }}</p>
            <p><strong>{{ t('address') }}:</strong> {{ user.address ? user.address : t('noAddress') }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const router = useRouter();
const { t } = useI18n();
const user = ref(null);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const phoneNumber = ref('');
const address = ref('');

// Get userId from localStorage
const userId = localStorage.getItem('userId');
if (!userId) {
    console.error('userId is not found in localStorage');
    router.push('/login');
} else {
    console.log('userId:', userId);
}

const getCustomer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert(t('login'));
        router.push("/login");
        return;
    }

    try {
        const res = await axios.get(`${API_URL}/users/${userId}`, {
            headers: {
                "x-auth-token": token,
            },
        });
        console.log("User response:", res.data);
        user.value = res.data;
        
        // Populate form fields with existing data
        firstName.value = user.value.firstName || '';
        lastName.value = user.value.lastName || '';
        email.value = user.value.email || '';
        phoneNumber.value = user.value.phoneNumber || '';
        address.value = user.value.address || '';
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
};

onMounted(async () => {
    getCustomer();
});
</script>

<style scoped>
.profile {
    max-width: 600px;
    margin: 0 auto;
}
</style>
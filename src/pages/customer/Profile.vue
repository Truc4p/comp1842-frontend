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

const router = useRouter();
const { t } = useI18n();
const user = ref(null);

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
        const res = await axios.get(`http://localhost:3000/users/${userId}`, {
            headers: {
                "x-auth-token": token,
            },
        });
        console.log("User response:", res.data);
        user.value = res.data;
    } catch (error) {
        console.error('Error retrieving customer:', error);
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
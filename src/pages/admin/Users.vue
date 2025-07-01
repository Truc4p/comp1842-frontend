<template>
    <div class="container mx-auto p-4">
        <h2 class="text-2xl font-bold mb-4">Users</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th class="py-2 px-4 border-b">Username</th>
                        <th class="py-2 px-4 border-b">Email</th>
                        <th class="py-2 px-4 border-b">Phone</th>
                        <th class="py-2 px-4 border-b">Address</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id">
                        <td class="py-2 px-4 border-b">{{ user.username }}</td>
                        <td class="py-2 px-4 border-b">{{ user.email }}</td>
                        <td class="py-2 px-4 border-b">{{ user.phone }}</td>
                        <td class="py-2 px-4 border-b">{{ user.address }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t } = useI18n();
const router = useRouter();

const users = ref([]);

onMounted(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You need to login first");
        router.push("/login");
    }

    // Make the api request with axios with token in header
    const res = await axios.get(`${API_URL}/users`, {
        headers: {
            "x-auth-token": `${token}`,
        },
    });

    console.log("Users response:", res.data);
    users.value = res.data;
});
</script>

<style scoped>
/* Add your styles here */
</style>
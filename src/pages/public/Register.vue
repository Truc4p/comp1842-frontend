<script setup>
import axios from "axios";
import { ref } from "vue";
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const username = ref("");
const password = ref("");
const role = ref("customer"); // Default role is customer
const adminKey = ref(""); // Admin key for admin registration

const register = async () => {
  try {
    const data = {
      username: username.value,
      password: password.value,
      role: role.value,
    };

    // Include adminKey if the role is admin
    if (role.value === "admin") {
      data.adminKey = adminKey.value;
    }

    const response = await axios.post("http://localhost:3000/auth/register", data);
    console.log("Registration successful:", response.data);
    alert(t('registerSuccess'));
  } catch (error) {
    console.error("Error during registration:", error.response.data.msg);
    alert(`${t('registerFail')}${error.response.data.msg}`);
  }
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">{{ t('register') }}</h1>
    <form>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
          {{ t('username') }}
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="username"
          id="email"
          placeholder="Username"
        />
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >
          {{ t('password') }}
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="password"
          id="password"
          type="password"
          placeholder="Password"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="role">
          {{ t('role') }}
        </label>
        <select
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="role"
          id="role"
        >
          <option value="admin">{{ t('admin') }}</option>
          <option value="customer">{{ t('customer') }}</option>
        </select>
      </div>
      <!-- Conditionally render the adminKey input field -->
      <div v-if="role === 'admin'" class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="adminKey">
          {{ t('adminKey') }}
        </label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          v-model="adminKey"
          id="adminKey"
          type="text"
          placeholder="Admin Key"
        />
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click.prevent="register"
        >
          {{ t('register') }}
        </button>
        <router-link
          to="/login"
          class="inline-block align-baseline font-bold text-sm text-blue-400 hover:text-blue-800"
        >
          {{ t('login') }}
        </router-link>
      </div>
    </form>
  </div>
</template>
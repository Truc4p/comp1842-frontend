<!-- src/pages/Login.vue -->

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t } = useI18n();
const username = ref("");
const password = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const router = useRouter();

const handleLogin = async () => {
  // Reset error message
  errorMessage.value = "";
  
  // Validate form
  if (!username.value || !password.value) {
    errorMessage.value = t('pleaseEnterCredentials');
    return;
  }
  
  isLoading.value = true;
  
  const data = {
    username: username.value,
    password: password.value,
  };

  try {
    const res = await axios.post(`${API_URL}/auth/login`, data);
    console.log("Login response:", res.data);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("username", username.value);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.userId);

    // Check if the user is an admin
    if (res.data.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/customer");
    }

  } catch (error) {
    console.error("Error during login:", error);
    errorMessage.value = t('loginFailed');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto">
    <div class="text-center mb-8 mt-12">
      <h1 class="text-3xl font-bold text-green-700">{{ t('login') }}</h1>
      <p class="text-gray-600 mt-2">{{ t('welcomeBack') }}</p>
    </div>
    
    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-start">
      <svg class="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ errorMessage }}</span>
    </div>
    
    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label class="form-label" for="username">{{ t('username') }}</label>
        <input
          id="username"
          v-model="username"
          type="text"
          class="form-control"
          :placeholder="t('enterUsername')"
          required
        />
      </div>
      
      <div>
        <label class="form-label" for="password">{{ t('password') }}</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          :placeholder="t('enterPassword')"
          required
        />
      </div>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input id="remember-me" type="checkbox" class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
          <label for="remember-me" class="ml-2 block text-sm text-gray-700">{{ t('rememberMe') }}</label>
        </div>
        
        <div class="text-sm">
          <a href="#" class="text-green-600 hover:text-green-500">{{ t('forgotPassword') }}</a>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          class="w-full btn btn-primary py-3 flex justify-center"
          :disabled="isLoading"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? t('signingIn') : t('signIn') }}
        </button>
      </div>
    </form>
    
    <div class="mt-12 mb-8 text-center">
      <p class="text-gray-600">
        {{ t('dontHaveAccount') }} 
        <router-link to="/register" class="text-green-600 hover:text-green-500 font-medium">
          {{ t('registerNow') }}
        </router-link>
      </p>
    </div>
  </div>
</template>

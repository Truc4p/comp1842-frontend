<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">🔍 Token Debug Tool</h1>
        <div class="text-sm text-gray-500">
          Dev Tool - Admin Only
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-lg font-semibold mb-4">Current Token Status</h2>
        <div class="space-y-3">
          <div>
            <label class="font-medium">Token Exists:</label>
            <span :class="tokenExists ? 'text-green-600' : 'text-red-600'" class="ml-2">
              {{ tokenExists ? 'Yes' : 'No' }}
            </span>
          </div>
          
          <div v-if="tokenExists">
            <label class="font-medium">Token Preview:</label>
            <div class="mt-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
              {{ tokenPreview }}
            </div>
          </div>
          
          <div v-if="tokenInfo">
            <label class="font-medium">Token Info:</label>
            <pre class="mt-1 p-2 bg-gray-100 rounded text-sm">{{ JSON.stringify(tokenInfo, null, 2) }}</pre>
          </div>
          
          <div v-if="tokenError">
            <label class="font-medium text-red-600">Token Error:</label>
            <div class="mt-1 p-2 bg-red-100 rounded text-sm text-red-800">
              {{ tokenError }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-lg font-semibold mb-4">Quick Actions</h2>
        <div class="space-x-3">
          <button @click="testLogin" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Test Login
          </button>
          <button @click="testAPI" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Test API Call
          </button>
          <button @click="clearToken" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Clear Token
          </button>
          <button @click="refreshToken" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Refresh Data
          </button>
        </div>
      </div>
      
      <div v-if="results.length" class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Test Results</h2>
        <div class="space-y-2">
          <div v-for="(result, index) in results" :key="index" 
               :class="result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
               class="p-3 rounded">
            <div class="font-medium">{{ result.action }}</div>
            <div class="text-sm">{{ result.message }}</div>
            <div v-if="result.data" class="text-xs mt-1 font-mono">
              {{ JSON.stringify(result.data, null, 2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { API_URL } from '../../utils/config';

const tokenExists = ref(false);
const tokenPreview = ref('');
const tokenInfo = ref(null);
const tokenError = ref('');
const results = ref([]);

const analyzeToken = () => {
  const token = localStorage.getItem('token');
  tokenExists.value = !!token;
  
  if (token) {
    tokenPreview.value = token.substring(0, 50) + '...';
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      tokenInfo.value = {
        userId: payload.id,
        username: payload.username,
        role: payload.role,
        issuedAt: new Date(payload.iat * 1000).toISOString(),
        expiresAt: new Date(payload.exp * 1000).toISOString(),
        isExpired: payload.exp < currentTime,
        timeLeft: payload.exp - currentTime > 0 ? `${Math.floor((payload.exp - currentTime) / 3600)}h ${Math.floor(((payload.exp - currentTime) % 3600) / 60)}m` : 'Expired'
      };
      tokenError.value = '';
    } catch (e) {
      tokenError.value = `Invalid token format: ${e.message}`;
      tokenInfo.value = null;
    }
  }
};

const testLogin = async () => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'ad',
      password: '123'
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      results.value.unshift({
        action: 'Login Test',
        success: true,
        message: 'Login successful, new token saved',
        data: { 
          user: response.data.user,
          tokenLength: response.data.token.length 
        }
      });
      analyzeToken();
    }
  } catch (error) {
    results.value.unshift({
      action: 'Login Test',
      success: false,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
  }
};

const testAPI = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    results.value.unshift({
      action: 'API Test',
      success: false,
      message: 'No token available'
    });
    return;
  }
  
  try {
    const response = await axios.get(`${API_URL}/cashflow/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    results.value.unshift({
      action: 'API Test',
      success: true,
      message: 'API call successful',
      data: { 
        balance: response.data.currentBalance,
        status: response.status 
      }
    });
  } catch (error) {
    results.value.unshift({
      action: 'API Test',
      success: false,
      message: `${error.response?.status} ${error.response?.statusText}: ${error.response?.data?.message || error.message}`,
      data: error.response?.data
    });
  }
};

const clearToken = () => {
  localStorage.removeItem('token');
  results.value.unshift({
    action: 'Clear Token',
    success: true,
    message: 'Token cleared from localStorage'
  });
  analyzeToken();
};

const refreshToken = () => {
  analyzeToken();
  results.value.unshift({
    action: 'Refresh Data',
    success: true,
    message: 'Token analysis refreshed'
  });
};

onMounted(() => {
  analyzeToken();
});
</script>

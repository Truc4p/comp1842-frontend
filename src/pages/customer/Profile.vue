<template>
  <div class="page-background">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Page Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">{{ t('profile') }}</h1>
        <p class="text-gray-600">{{ t('manageYourAccountInformation') || 'Manage your account information and preferences' }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="!user" class="flex justify-center items-center py-20">
        <div class="text-center">
          <svg class="loading-spinner mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">{{ t('loading') || 'Loading profile...' }}</p>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Profile Card -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
            <!-- Profile Header -->
            <div class="px-6 py-8 text-gray-900" style="background: white; border-bottom: 1px solid #e5e7eb;">
              <div class="flex items-center space-x-4">
                <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-900">{{ user.username }}</h2>
                  <p class="text-gray-500">{{ t('customerAccount') || 'Customer Account' }}</p>
                </div>
              </div>
            </div>

            <!-- Profile Information -->
            <div class="p-6">
              <h3 class="text-xl font-semibold text-gray-900 mb-6">{{ t('personalInformation') || 'Personal Information' }}</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <!-- User ID -->
                <div class="info-item">
                  <div class="flex items-center text-gray-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0V5a2 2 0 014 0v1" />
                    </svg>
                    <span class="text-sm font-medium">{{ t('userID') || 'User ID' }}</span>
                  </div>
                  <p class="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded-lg">{{ user._id }}</p>
                </div>

                <!-- Username -->
                <div class="info-item">
                  <div class="flex items-center text-gray-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-sm font-medium">{{ t('username') }}</span>
                  </div>
                  <p class="text-gray-900 font-semibold">{{ user.username }}</p>
                </div>

                <!-- Email -->
                <div class="info-item">
                  <div class="flex items-center text-gray-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <span class="text-sm font-medium">{{ t('email') || 'Email' }}</span>
                  </div>
                  <p class="text-gray-900" :class="!user.email ? 'text-gray-400 italic' : ''">
                    {{ user.email || (t('noEmailProvided') || 'No email provided') }}
                  </p>
                </div>

                <!-- Phone -->
                <div class="info-item">
                  <div class="flex items-center text-gray-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span class="text-sm font-medium">{{ t('phone') }}</span>
                  </div>
                  <p class="text-gray-900" :class="!user.phone ? 'text-gray-400 italic' : ''">
                    {{ user.phone || (t('noPhone') || 'No phone number provided') }}
                  </p>
                </div>

              </div>

              <!-- Address (Full Width) -->
              <div class="info-item mt-6">
                <div class="flex items-center text-gray-500 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-sm font-medium">{{ t('address') }}</span>
                </div>
                <p class="text-gray-900" :class="!user.address ? 'text-gray-400 italic' : ''">
                  {{ user.address || (t('noAddress') || 'No address provided') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">{{ t('quickActions') || 'Quick Actions' }}</h3>
            
            <div class="space-y-4">
              <router-link to="/customer/order-history" class="quick-action-btn group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{{ t('orderHistory') }}</span>
              </router-link>

              <router-link to="/customer/cart" class="quick-action-btn group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>{{ t('viewCart') || 'View Cart' }}</span>
              </router-link>

              <router-link to="/customer" class="quick-action-btn group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span>{{ t('continueShopping') || 'Continue Shopping' }}</span>
              </router-link>
            </div>
          </div>

          <!-- Account Stats -->
          <div class="bg-white rounded-2xl shadow-lg p-6 mt-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-6">{{ t('accountStats') || 'Account Stats' }}</h3>
            
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">{{ t('memberSince') || 'Member Since' }}</span>
                <span class="font-semibold text-gray-900">{{ formatDate(user.createdAt) || '2024' }}</span>
              </div>
              
              <div class="flex items-center justify-between">
                <span class="text-gray-600">{{ t('accountStatus') || 'Account Status' }}</span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {{ t('active') || 'Active' }}
                </span>
              </div>
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
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

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

const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    return new Date(dateString).getFullYear();
  } catch {
    return null;
  }
};

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
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
};

onMounted(async () => {
    getCustomer();
});
</script>

<style scoped>
/* Loading spinner */
.loading-spinner {
  width: 3rem;
  height: 3rem;
  color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Info item styling */
.info-item {
  @apply transition-all duration-200;
}

.info-item:hover {
  @apply transform translate-y-0.5;
}

/* Quick action buttons */
.quick-action-btn {
  @apply flex items-center space-x-3 w-full p-4 text-left bg-gray-50 hover:bg-teal-50 rounded-xl transition-all duration-200 text-gray-700 hover:text-teal-700;
}

.quick-action-btn:hover {
  @apply transform translate-y-0.5 shadow-md;
}

.quick-action-btn svg {
  @apply transition-transform duration-200 group-hover:scale-110;
}

/* Responsive improvements */
@media (max-width: 768px) {
  .container {
    @apply px-4;
  }
}
</style>
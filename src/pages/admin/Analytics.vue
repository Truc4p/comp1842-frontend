<!-- src/pages/admin/Analytics.vue -->
<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';

const { t } = useI18n();
const router = useRouter();

// Data refs
const dashboardStats = ref({});
const salesData = ref([]);
const productAnalytics = ref({});
const userAnalytics = ref({});
const orderAnalytics = ref({});
const loading = ref(true);
const error = ref(null);

// Period selection
const selectedPeriod = ref(15);
const periods = [
  { value: 7, label: '7 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' }
];

// Computed properties for formatting
const formattedTotalRevenue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(dashboardStats.value.totalRevenue || 0);
});

const formattedAverageOrderValue = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(dashboardStats.value.averageOrderValue || 0);
});



// Fetch dashboard statistics
const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/analytics/dashboard`, {
      headers: { "x-auth-token": token }
    });
    dashboardStats.value = response.data;
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
  }
};

// Fetch sales analytics
const fetchSalesAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await axios.get(`${API_URL}/analytics/sales?period=${selectedPeriod.value}`, {
      headers: { "x-auth-token": token }
    });
    
    if (response.data.salesData && Array.isArray(response.data.salesData) && response.data.salesData.length > 0) {
      salesData.value = response.data.salesData;
    } else {
      console.warn("No sales data returned from API");
      salesData.value = [];
    }
  } catch (err) {
    console.error("Error fetching sales analytics:", err);
    salesData.value = [];
  }
};

// Fetch product analytics
const fetchProductAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/analytics/products`, {
      headers: { "x-auth-token": token }
    });
    productAnalytics.value = response.data;
  } catch (err) {
    console.error("Error fetching product analytics:", err);
  }
};

// Fetch user analytics
const fetchUserAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/analytics/users?period=${selectedPeriod.value}`, {
      headers: { "x-auth-token": token }
    });
    userAnalytics.value = response.data;
  } catch (err) {
    console.error("Error fetching user analytics:", err);
  }
};

// Fetch order analytics
const fetchOrderAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/analytics/orders`, {
      headers: { "x-auth-token": token }
    });
    orderAnalytics.value = response.data;
  } catch (err) {
    console.error("Error fetching order analytics:", err);
  }
};

// Handle period change
const handlePeriodChange = () => {
  fetchSalesAnalytics();
  fetchUserAnalytics();
};

// Fetch all data
const fetchAllData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchDashboardStats(),
      fetchSalesAnalytics(),
      fetchProductAnalytics(),
      fetchUserAnalytics(),
      fetchOrderAnalytics()
    ]);
  } catch (err) {
    error.value = "Failed to load analytics data";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You need to login first");
    router.push("/login");
    return;
  }
  
  await fetchAllData();
});
</script>

<template>
  <div class="page-background min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary-700 mb-2">Analytics Dashboard</h1>
        <p class="text-secondary-600 text-lg">Monitor your business performance and insights</p>
      </div>

      <!-- Period Selector -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-secondary-700 mb-2">Analysis Period</label>
        <select 
          v-model="selectedPeriod" 
          @change="handlePeriodChange"
          class="form-select w-48"
        >
          <option v-for="period in periods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="card p-8 text-center">
        <div class="text-error text-lg font-medium mb-2">{{ error }}</div>
        <p class="text-secondary-500">Please try refreshing the page</p>
      </div>

      <!-- Analytics Content -->
      <div v-else class="space-y-8">
        <!-- Key Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Revenue -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-100 text-green-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Total Revenue</p>
                <p class="text-2xl font-bold text-secondary-900">{{ formattedTotalRevenue }}</p>
              </div>
            </div>
          </div>

          <!-- Total Orders -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Total Orders</p>
                <p class="text-2xl font-bold text-secondary-900">{{ dashboardStats.totalOrders || 0 }}</p>
              </div>
            </div>
          </div>

          <!-- Average Order Value -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Avg Order Value</p>
                <p class="text-2xl font-bold text-secondary-900">{{ formattedAverageOrderValue }}</p>
              </div>
            </div>
          </div>

          <!-- Total Users -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Total Users</p>
                <p class="text-2xl font-bold text-secondary-900">{{ dashboardStats.totalUsers || 0 }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Detailed Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Sales Chart -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Sales Trend ({{ selectedPeriod }} Days)</h3>
            
            <div v-if="salesData.length === 0" class="text-center py-8 text-gray-500">
              <p>No sales data available for the selected period</p>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="day in [...salesData].reverse()" :key="day.date" class="flex items-center justify-between">
                <span class="text-sm text-secondary-600">{{ new Date(day.date).toLocaleDateString() }}</span>
                <div class="flex items-center space-x-4">
                  <span class="text-sm font-medium text-secondary-900">{{ day.orders }} orders</span>
                  <span class="text-sm font-medium text-green-600">${{ day.revenue }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Top Products -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Top Selling Products</h3>
            <div class="space-y-3">
              <div v-for="(product, index) in productAnalytics.topProducts" :key="product.productId" class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="w-6 h-6 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold mr-3">
                    {{ index + 1 }}
                  </span>
                  <span class="text-sm font-medium text-secondary-900">{{ product.name }}</span>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-secondary-900">{{ product.totalSold }} sold</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Analytics -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Category Distribution -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Products by Category</h3>
            <div class="space-y-3">
              <div v-for="category in productAnalytics.categoryDistribution" :key="category.categoryId" class="flex items-center justify-between">
                <span class="text-sm font-medium text-secondary-900">{{ category.name }}</span>
                <span class="text-sm text-secondary-600">{{ category.count }} products</span>
              </div>
            </div>
          </div>

          <!-- Low Stock Alert -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Low Stock Alert</h3>
            <div class="space-y-3">
              <div v-for="product in productAnalytics.lowStockProducts" :key="product._id" class="flex items-center justify-between">
                <span class="text-sm font-medium text-secondary-900">{{ product.name }}</span>
                <div class="text-right">
                  <span class="text-sm text-error">{{ product.stockQuantity }} left</span>
                  <div class="text-xs text-secondary-600">${{ product.price }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-secondary-900 mb-4">Recent Orders</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-secondary-200">
              <thead class="bg-secondary-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Order ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Customer</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Products</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Total</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-secondary-100">
                <tr v-for="order in orderAnalytics.recentOrders" :key="order._id" class="hover:bg-secondary-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                    {{ order._id.slice(-8) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                    {{ order.user?.username || 'Unknown' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-secondary-900">
                    <div class="space-y-1">
                      <div v-for="item in order.products" :key="item.productId._id" class="text-xs">
                        {{ item.productId?.name || 'Unknown Product' }} (x{{ item.quantity }})
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${{ order.totalPrice }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="{
                      'px-2 py-1 text-xs font-medium rounded-full': true,
                      'bg-yellow-100 text-yellow-800': order.status === 'processing',
                      'bg-blue-100 text-blue-800': order.status === 'shipping',
                      'bg-green-100 text-green-800': order.status === 'completed'
                    }">
                      {{ order.status }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  @apply bg-white rounded-xl shadow-sm;
}

.form-select {
  @apply block w-full px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>

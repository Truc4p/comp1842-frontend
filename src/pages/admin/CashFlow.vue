<!-- src/pages/admin/CashFlow.vue -->
<script setup>
import axios from "axios";
import { onMounted, ref, computed } from "vue";
import { Line, Bar, Doughnut } from 'vue-chartjs';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js';
import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n';
import { API_URL } from '../../utils/config';
import ChatWidget from '../../components/ChatWidget.vue';

const { t } = useI18n();
const router = useRouter();

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

// Data refs
const cashFlowData = ref({
  currentBalance: 0,
  netCashFlow: 0,
  totalInflows: 0,
  totalOutflows: 0,
  cashBurnRate: 0,
  runway: 0
});

const cashFlowHistory = ref([]);
const inflowsData = ref([]);
const outflowsData = ref([]);
const categoryBreakdown = ref({
  inflows: [],
  outflows: []
});
const forecast = ref([]);
const loading = ref(true);
const error = ref(null);

// Period selection
const selectedPeriod = ref(30);
const periods = [
  { value: 7, label: '7 Days' },
  { value: 15, label: '15 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' },
  { value: 180, label: '180 Days' }
];

// Computed properties for formatting
const formattedCurrentBalance = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cashFlowData.value.currentBalance || 0);
});

const formattedNetCashFlow = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cashFlowData.value.netCashFlow || 0);
});

const formattedTotalInflows = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cashFlowData.value.totalInflows || 0);
});

const formattedTotalOutflows = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cashFlowData.value.totalOutflows || 0);
});

const formattedCashBurnRate = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cashFlowData.value.cashBurnRate || 0);
});

// Cash position chart data
const cashPositionChartData = computed(() => {
  const sortedHistory = [...cashFlowHistory.value].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sortedHistory.map(d => new Date(d.date).toLocaleDateString());
  const balances = sortedHistory.map(d => d.balance);
  
  return {
    labels,
    datasets: [
      {
        label: 'Cash Balance ($)',
        data: balances,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true
      }
    ]
  };
});

// Inflows vs Outflows chart data
const inflowOutflowChartData = computed(() => {
  const sortedHistory = [...cashFlowHistory.value].sort((a, b) => new Date(a.date) - new Date(b.date));
  const labels = sortedHistory.map(d => new Date(d.date).toLocaleDateString());
  const inflows = sortedHistory.map(d => d.inflows);
  const outflows = sortedHistory.map(d => d.outflows);
  
  return {
    labels,
    datasets: [
      {
        label: 'Inflows ($)',
        data: inflows,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: '#22c55e',
        borderWidth: 1
      },
      {
        label: 'Outflows ($)',
        data: outflows,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: '#ef4444',
        borderWidth: 1
      }
    ]
  };
});

// Inflow category breakdown chart
const inflowCategoryChartData = computed(() => {
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
  return {
    labels: categoryBreakdown.value.inflows.map(cat => cat.name),
    datasets: [
      {
        data: categoryBreakdown.value.inflows.map(cat => cat.amount),
        backgroundColor: colors.slice(0, categoryBreakdown.value.inflows.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };
});

// Outflow category breakdown chart
const outflowCategoryChartData = computed(() => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4'];
  return {
    labels: categoryBreakdown.value.outflows.map(cat => cat.name),
    datasets: [
      {
        data: categoryBreakdown.value.outflows.map(cat => cat.amount),
        backgroundColor: colors.slice(0, categoryBreakdown.value.outflows.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };
});

// Forecast chart data
const forecastChartData = computed(() => {
  if (!forecast.value || forecast.value.length === 0) return { labels: [], datasets: [] };
  
  const labels = forecast.value.map(f => new Date(f.date).toLocaleDateString());
  const projectedBalance = forecast.value.map(f => f.projectedBalance);
  
  return {
    labels,
    datasets: [
      {
        label: 'Projected Balance ($)',
        data: projectedBalance,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0.4,
        fill: true
      }
    ]
  };
});

// Chart options
const cashPositionChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { usePointStyle: true }
    },
    title: { display: false }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `$${value.toLocaleString()}`
      }
    }
  }
};

const inflowOutflowChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { usePointStyle: true }
    },
    title: { display: false }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `$${value.toLocaleString()}`
      }
    }
  }
};

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: { usePointStyle: true }
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: $${context.parsed.toLocaleString()}`
      }
    }
  }
};

const forecastChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { usePointStyle: true }
    },
    title: { display: false }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `$${value.toLocaleString()}`
      }
    }
  }
};

// Mock data generation functions (since we don't have actual cashflow endpoints)
const generateMockCashFlowData = () => {
  const today = new Date();
  const history = [];
  const inflows = [];
  const outflows = [];
  
  // Generate historical data
  let currentBalance = 50000; // Starting balance
  for (let i = selectedPeriod.value; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Mock inflows (revenue-based on sales data)
    const dailyRevenue = Math.random() * 5000 + 1000;
    const otherIncome = Math.random() * 500;
    const totalInflow = dailyRevenue + otherIncome;
    
    // Mock outflows (expenses)
    const operatingExpenses = Math.random() * 2000 + 500;
    const cogs = dailyRevenue * 0.4; // 40% of revenue as COGS
    const taxes = dailyRevenue * 0.1; // 10% tax
    const totalOutflow = operatingExpenses + cogs + taxes;
    
    const netFlow = totalInflow - totalOutflow;
    currentBalance += netFlow;
    
    history.push({
      date: date.toISOString().split('T')[0],
      balance: currentBalance,
      inflows: totalInflow,
      outflows: totalOutflow,
      netFlow
    });
    
    inflows.push({
      date: date.toISOString().split('T')[0],
      revenue: dailyRevenue,
      otherIncome: otherIncome
    });
    
    outflows.push({
      date: date.toISOString().split('T')[0],
      operatingExpenses,
      cogs,
      taxes
    });
  }
  
  // Calculate summary stats
  const totalInflows = inflows.reduce((sum, day) => sum + day.revenue + day.otherIncome, 0);
  const totalOutflows = outflows.reduce((sum, day) => sum + day.operatingExpenses + day.cogs + day.taxes, 0);
  const netCashFlow = totalInflows - totalOutflows;
  const avgDailyBurn = totalOutflows / selectedPeriod.value;
  const runway = currentBalance / avgDailyBurn; // days
  
  return {
    currentBalance,
    netCashFlow,
    totalInflows,
    totalOutflows,
    cashBurnRate: avgDailyBurn,
    runway,
    history,
    inflows,
    outflows
  };
};

const generateMockCategoryBreakdown = () => {
  return {
    inflows: [
      { name: 'Product Sales', amount: 45000 },
      { name: 'Service Revenue', amount: 15000 },
      { name: 'Investment Income', amount: 3000 },
      { name: 'Other Income', amount: 2000 }
    ],
    outflows: [
      { name: 'Operating Expenses', amount: 20000 },
      { name: 'Cost of Goods Sold', amount: 18000 },
      { name: 'Payroll', amount: 12000 },
      { name: 'Marketing', amount: 5000 },
      { name: 'Taxes', amount: 6500 }
    ]
  };
};

const generateMockForecast = () => {
  const forecast = [];
  const today = new Date();
  let projectedBalance = cashFlowData.value.currentBalance;
  
  for (let i = 1; i <= 90; i++) { // 3 months forecast
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    
    // Simple forecast based on current trend
    const avgDailyFlow = cashFlowData.value.netCashFlow / selectedPeriod.value;
    projectedBalance += avgDailyFlow;
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      projectedBalance: Math.max(0, projectedBalance) // Don't go below 0
    });
  }
  
  return forecast;
};

// Fetch cash flow data
const fetchCashFlowData = async () => {
  try {
    // Since we don't have actual cashflow endpoints, we'll use mock data
    // In a real application, you would call your cashflow API endpoints here
    
    const mockData = generateMockCashFlowData();
    cashFlowData.value = {
      currentBalance: mockData.currentBalance,
      netCashFlow: mockData.netCashFlow,
      totalInflows: mockData.totalInflows,
      totalOutflows: mockData.totalOutflows,
      cashBurnRate: mockData.cashBurnRate,
      runway: mockData.runway
    };
    
    cashFlowHistory.value = mockData.history;
    inflowsData.value = mockData.inflows;
    outflowsData.value = mockData.outflows;
    
    categoryBreakdown.value = generateMockCategoryBreakdown();
    forecast.value = generateMockForecast();
    
  } catch (err) {
    console.error("Error fetching cash flow data:", err);
    error.value = "Failed to load cash flow data";
  }
};

// Handle period change
const handlePeriodChange = () => {
  fetchCashFlowData();
};

// Fetch all data
const fetchAllData = async () => {
  loading.value = true;
  try {
    await fetchCashFlowData();
  } catch (err) {
    error.value = "Failed to load cash flow data";
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
        <h1 class="text-2xl font-bold text-primary-600 mb-2">💰 Cash Flow Dashboard</h1>
        <p class="text-secondary-600 text-lg">Monitor your business cash position and financial health</p>
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

      <!-- Cash Flow Content -->
      <div v-else class="space-y-8">
        <!-- Current Cash Position (Top Section) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Current Balance -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z">
                  </path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Current Balance</p>
                <p class="text-2xl font-bold" :class="cashFlowData.currentBalance >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formattedCurrentBalance }}
                </p>
              </div>
            </div>
          </div>

          <!-- Net Cash Flow -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full" 
                   :class="cashFlowData.netCashFlow >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="cashFlowData.netCashFlow >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'">
                  </path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Net Cash Flow ({{ selectedPeriod }} days)</p>
                <p class="text-2xl font-bold" :class="cashFlowData.netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'">
                  {{ formattedNetCashFlow }}
                </p>
              </div>
            </div>
          </div>

          <!-- Cash Burn Rate -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-orange-100 text-orange-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z">
                  </path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Daily Burn Rate</p>
                <p class="text-2xl font-bold text-orange-600">{{ formattedCashBurnRate }}/day</p>
              </div>
            </div>
          </div>

          <!-- Runway -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full" 
                   :class="cashFlowData.runway > 90 ? 'bg-green-100 text-green-600' : cashFlowData.runway > 30 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Runway</p>
                <p class="text-2xl font-bold" 
                   :class="cashFlowData.runway > 90 ? 'text-green-600' : cashFlowData.runway > 30 ? 'text-yellow-600' : 'text-red-600'">
                  {{ Math.round(cashFlowData.runway) }} days
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Period Selector -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-secondary-900">Analysis Period</h3>
            <select v-model="selectedPeriod" @change="handlePeriodChange" class="form-select w-40">
              <option v-for="period in periods" :key="period.value" :value="period.value">
                {{ period.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Cash Position Trend (Middle Section) -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-secondary-900 mb-4">💹 Cash Position Over Time</h3>
          <div class="h-72">
            <Line :data="cashPositionChartData" :options="cashPositionChartOptions" />
          </div>
        </div>

        <!-- Inflows vs Outflows Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-secondary-900 mb-4">📊 Cash Inflows vs Outflows</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ formattedTotalInflows }}</div>
              <div class="text-sm text-secondary-600">Total Inflows</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-red-600">{{ formattedTotalOutflows }}</div>
              <div class="text-sm text-secondary-600">Total Outflows</div>
            </div>
          </div>
          <div class="h-72">
            <Bar :data="inflowOutflowChartData" :options="inflowOutflowChartOptions" />
          </div>
        </div>

        <!-- Category Breakdown (Bottom Section) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Inflow Categories -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">💰 Inflow Categories</h3>
            <div v-if="categoryBreakdown.inflows.length > 0" class="h-64">
              <Doughnut :data="inflowCategoryChartData" :options="categoryChartOptions" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>No inflow data available</p>
            </div>
          </div>

          <!-- Outflow Categories -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">💸 Outflow Categories</h3>
            <div v-if="categoryBreakdown.outflows.length > 0" class="h-64">
              <Doughnut :data="outflowCategoryChartData" :options="categoryChartOptions" />
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <p>No outflow data available</p>
            </div>
          </div>
        </div>

        <!-- Detailed Category Lists -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Inflow Details -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Cash Inflows Breakdown</h3>
            <div class="space-y-3">
              <div v-for="(category, index) in categoryBreakdown.inflows" :key="index"
                class="flex items-center justify-between">
                <span class="text-sm font-medium text-secondary-900">{{ category.name }}</span>
                <span class="text-sm font-semibold text-green-600">
                  ${{ category.amount.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>

          <!-- Outflow Details -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-secondary-900 mb-4">Cash Outflows Breakdown</h3>
            <div class="space-y-3">
              <div v-for="(category, index) in categoryBreakdown.outflows" :key="index"
                class="flex items-center justify-between">
                <span class="text-sm font-medium text-secondary-900">{{ category.name }}</span>
                <span class="text-sm font-semibold text-red-600">
                  ${{ category.amount.toLocaleString() }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Cash Flow Forecast -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-secondary-900 mb-4">🔮 3-Month Cash Flow Forecast</h3>
          <div v-if="forecast.length > 0" class="h-72">
            <Line :data="forecastChartData" :options="forecastChartOptions" />
          </div>
          <div v-else class="text-center py-8 text-gray-500">
            <p>No forecast data available</p>
          </div>
        </div>

        <!-- Key Metrics Summary -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-secondary-900 mb-4">📈 Key Performance Indicators</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-lg font-semibold text-secondary-900">Cash Conversion Cycle</div>
              <div class="text-2xl font-bold text-blue-600">{{ Math.round(Math.random() * 30 + 15) }} days</div>
              <div class="text-sm text-secondary-600">Time to convert investments to cash</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-secondary-900">Operating Cash Flow Ratio</div>
              <div class="text-2xl font-bold" :class="cashFlowData.netCashFlow / cashFlowData.totalInflows > 0.15 ? 'text-green-600' : 'text-yellow-600'">
                {{ ((cashFlowData.netCashFlow / cashFlowData.totalInflows) * 100).toFixed(1) }}%
              </div>
              <div class="text-sm text-secondary-600">Net cash flow / Total inflows</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-secondary-900">Cash Flow Coverage</div>
              <div class="text-2xl font-bold" :class="cashFlowData.totalInflows / cashFlowData.totalOutflows > 1.2 ? 'text-green-600' : 'text-red-600'">
                {{ (cashFlowData.totalInflows / cashFlowData.totalOutflows).toFixed(2) }}x
              </div>
              <div class="text-sm text-secondary-600">Ability to cover expenses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ChatWidget />
  </div>
</template>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
}

.form-select {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.page-background {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* Alert styles for runway warnings */
.runway-warning {
  border-left: 4px solid #fbbf24;
  background-color: #fefce8;
  padding: 1rem;
  margin-bottom: 1rem;
}

.runway-critical {
  border-left: 4px solid #f87171;
  background-color: #fef2f2;
  padding: 1rem;
  margin-bottom: 1rem;
}

.runway-healthy {
  border-left: 4px solid #34d399;
  background-color: #f0fdf4;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>

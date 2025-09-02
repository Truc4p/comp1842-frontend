<!-- src/pages/admin/AdvancedFinance.vue -->
<script setup>
import axios from "axios";
import { onMounted, ref, computed, watch } from "vue";
import { Line, Bar, Doughnut, Pie } from 'vue-chartjs';
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
  Legend,
  Filler
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
  Legend,
  Filler
);

// Data refs
const financialOverview = ref({});
const businessExpenses = ref([]);
const expenseCategories = ref([]);
const recurringExpenses = ref([]);
const vendorAnalysis = ref([]);
const performanceMetrics = ref({});
const expenseTrends = ref([]);
const loading = ref(true);
const error = ref(null);

// UI state
const activeTab = ref('overview');
const selectedPeriod = ref(30);
const showExpenseModal = ref(false);
const editingExpense = ref(null);

// Form data for new/edit expense
const expenseForm = ref({
  category: 'operating_expenses',
  amount: '',
  description: '',
  vendor: '',
  invoiceNumber: '',
  paymentMethod: 'other',
  status: 'pending',
  isRecurring: false,
  frequency: 'monthly',
  dueDate: '',
  notes: ''
});

// Period options
const periods = [
  { value: 7, label: '7 Days' },
  { value: 15, label: '15 Days' },
  { value: 30, label: '30 Days' },
  { value: 90, label: '90 Days' },
  { value: 180, label: '6 Months' },
  { value: 365, label: '1 Year' }
];

// Expense categories
const expenseCategories_options = [
  { value: 'rent', label: 'Rent' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'shipping', label: 'Shipping' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'software', label: 'Software' },
  { value: 'other', label: 'Other' }
];

// Payment methods
const paymentMethods = [
  { value: 'cash', label: 'Cash' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' }
];

// Status options
const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' }
];

// Frequency options
const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

// Computed properties
const formattedCurrentBalance = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(financialOverview.value.cashFlow?.currentBalance || 0);
});

const formattedGrossProfit = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(financialOverview.value.profitability?.grossProfit || 0);
});

const profitMarginClass = computed(() => {
  const margin = financialOverview.value.profitability?.profitMargin || 0;
  if (margin >= 20) return 'text-green-600';
  if (margin >= 10) return 'text-yellow-600';
  return 'text-red-600';
});

// Chart data
const expenseCategoryChartData = computed(() => {
  if (!expenseCategories.value?.breakdown) return { labels: [], datasets: [] };
  
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4', '#8b5cf6', '#ec4899', '#6b7280'];
  
  return {
    labels: expenseCategories.value.breakdown.map(cat => 
      expenseCategories_options.find(opt => opt.value === cat._id)?.label || cat._id
    ),
    datasets: [
      {
        data: expenseCategories.value.breakdown.map(cat => cat.totalAmount),
        backgroundColor: colors.slice(0, expenseCategories.value.breakdown.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };
});

const expenseTrendsChartData = computed(() => {
  if (!expenseTrends.value?.dailyTrends) return { labels: [], datasets: [] };
  
  const labels = expenseTrends.value.dailyTrends.map(day => 
    new Date(day._id).toLocaleDateString()
  );
  const amounts = expenseTrends.value.dailyTrends.map(day => day.dailyTotal);
  
  return {
    labels,
    datasets: [
      {
        label: 'Daily Expenses ($)',
        data: amounts,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };
});

const vendorSpendingChartData = computed(() => {
  if (!vendorAnalysis.value?.vendorAnalysis) return { labels: [], datasets: [] };
  
  const topVendors = vendorAnalysis.value.vendorAnalysis.slice(0, 10);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6b7280'];
  
  return {
    labels: topVendors.map(vendor => vendor._id),
    datasets: [
      {
        data: topVendors.map(vendor => vendor.totalSpent),
        backgroundColor: colors.slice(0, topVendors.length),
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true }
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: $${context.parsed.toLocaleString()}`
      }
    }
  }
};

const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'top',
      labels: { usePointStyle: true }
    }
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `$${value.toLocaleString()}`
      }
    }
  }
};

// API functions
const fetchFinancialOverview = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/advanced-finance/overview?period=${selectedPeriod.value}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    financialOverview.value = response.data;
  } catch (err) {
    console.error("Error fetching financial overview:", err);
    handleAuthError(err);
  }
};

const fetchBusinessExpenses = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/advanced-finance/expenses?limit=50`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    businessExpenses.value = response.data.expenses;
  } catch (err) {
    console.error("Error fetching business expenses:", err);
    handleAuthError(err);
  }
};

const fetchExpenseCategories = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/advanced-finance/expense-categories?period=${selectedPeriod.value}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    expenseCategories.value = response.data;
  } catch (err) {
    console.error("Error fetching expense categories:", err);
    handleAuthError(err);
  }
};

const fetchRecurringExpenses = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/advanced-finance/recurring-expenses`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    recurringExpenses.value = response.data;
  } catch (err) {
    console.error("Error fetching recurring expenses:", err);
    handleAuthError(err);
  }
};

const fetchVendorAnalysis = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/advanced-finance/vendor-analysis?period=${selectedPeriod.value}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    vendorAnalysis.value = response.data;
  } catch (err) {
    console.error("Error fetching vendor analysis:", err);
    handleAuthError(err);
  }
};

const fetchPerformanceMetrics = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/advanced-finance/performance?period=${selectedPeriod.value}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    performanceMetrics.value = response.data;
  } catch (err) {
    console.error("Error fetching performance metrics:", err);
    handleAuthError(err);
  }
};

const fetchExpenseTrends = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/advanced-finance/expense-trends?period=${selectedPeriod.value}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    expenseTrends.value = response.data;
  } catch (err) {
    console.error("Error fetching expense trends:", err);
    handleAuthError(err);
  }
};

// Handle authentication errors
const handleAuthError = (err) => {
  if (err.response?.status === 401 || err.response?.status === 403) {
    localStorage.removeItem('token');
    router.push('/login');
  }
};

// Form handling
const openExpenseModal = (expense = null) => {
  if (expense) {
    editingExpense.value = expense;
    expenseForm.value = {
      category: expense.category,
      amount: expense.amount,
      description: expense.description,
      vendor: expense.vendor || '',
      invoiceNumber: expense.invoiceNumber || '',
      paymentMethod: expense.paymentMethod,
      status: expense.status,
      isRecurring: expense.isRecurring,
      frequency: expense.frequency || 'monthly',
      dueDate: expense.dueDate ? new Date(expense.dueDate).toISOString().split('T')[0] : '',
      notes: expense.notes || ''
    };
  } else {
    editingExpense.value = null;
    expenseForm.value = {
      category: 'other',
      amount: '',
      description: '',
      vendor: '',
      invoiceNumber: '',
      paymentMethod: 'other',
      status: 'pending',
      isRecurring: false,
      frequency: 'monthly',
      dueDate: '',
      notes: ''
    };
  }
  showExpenseModal.value = true;
};

const closeExpenseModal = () => {
  showExpenseModal.value = false;
  editingExpense.value = null;
};

const saveExpense = async () => {
  try {
    const token = localStorage.getItem("token");
    const expenseData = {
      ...expenseForm.value,
      amount: parseFloat(expenseForm.value.amount),
      dueDate: expenseForm.value.dueDate || null
    };

    if (editingExpense.value) {
      // Update existing expense
      await axios.put(`${API_URL}/advanced-finance/expenses/${editingExpense.value._id}`, expenseData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
    } else {
      // Create new expense
      await axios.post(`${API_URL}/advanced-finance/expenses`, expenseData, {
        headers: { "Authorization": `Bearer ${token}` }
      });
    }

    closeExpenseModal();
    await fetchAllData();
  } catch (err) {
    console.error("Error saving expense:", err);
    error.value = err.response?.data?.message || "Failed to save expense";
  }
};

const deleteExpense = async (expenseId) => {
  if (!confirm('Are you sure you want to delete this expense?')) return;
  
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/advanced-finance/expenses/${expenseId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    await fetchAllData();
  } catch (err) {
    console.error("Error deleting expense:", err);
    error.value = err.response?.data?.message || "Failed to delete expense";
  }
};

// Handle period change
const handlePeriodChange = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchFinancialOverview(),
      fetchExpenseCategories(),
      fetchVendorAnalysis(),
      fetchPerformanceMetrics(),
      fetchExpenseTrends()
    ]);
  } finally {
    loading.value = false;
  }
};

// Fetch all data
const fetchAllData = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchFinancialOverview(),
      fetchBusinessExpenses(),
      fetchExpenseCategories(),
      fetchRecurringExpenses(),
      fetchVendorAnalysis(),
      fetchPerformanceMetrics(),
      fetchExpenseTrends()
    ]);
  } catch (err) {
    error.value = "Failed to load financial data";
    console.error("Error loading financial data:", err);
  } finally {
    loading.value = false;
  }
};

// Utility functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status) => {
  const statusClasses = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'paid': 'bg-green-100 text-green-800',
    'overdue': 'bg-red-100 text-red-800',
    'cancelled': 'bg-gray-100 text-gray-800'
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getCategoryIcon = (category) => {
  const icons = {
    'rent': '🏢',
    'utilities': '⚡',
    'payroll': '👥',
    'marketing': '📢',
    'shipping': '📦',
    'equipment': '🔧',
    'software': '💻',
    'other': '📋'
  };
  return icons[category] || '📋';
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

// Watch period changes
watch(selectedPeriod, handlePeriodChange);
</script>

<template>
  <div class="page-background min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-primary-600 mb-2">💼 Advanced Finance Management</h1>
        <p class="text-secondary-600 text-lg">Comprehensive financial oversight, expense tracking, and business analytics</p>
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

      <!-- Finance Content -->
      <div v-else class="space-y-8">
        <!-- Period Selector -->
        <div class="card p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-secondary-900">Analysis Period</h3>
            <select v-model="selectedPeriod" class="form-select w-40">
              <option v-for="period in periods" :key="period.value" :value="period.value">
                {{ period.label }}
              </option>
            </select>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="card">
          <div class="border-b border-gray-200">
            <nav class="flex space-x-8 px-6" aria-label="Tabs">
              <button
                v-for="tab in [
                  { id: 'overview', name: 'Financial Overview', icon: '📊' },
                  { id: 'expenses', name: 'Business Expenses', icon: '💸' },
                  { id: 'recurring', name: 'Recurring Payments', icon: '🔄' },
                  { id: 'vendors', name: 'Vendor Analysis', icon: '🏪' },
                  { id: 'performance', name: 'Performance', icon: '📈' }
                ]"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2',
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                <span>{{ tab.icon }}</span>
                {{ tab.name }}
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'" class="space-y-8">
              <!-- Key Financial Metrics -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <!-- Current Balance -->
                <div class="card p-6 border-l-4 border-blue-500">
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
                      <p class="text-2xl font-bold text-blue-600">{{ formattedCurrentBalance }}</p>
                    </div>
                  </div>
                </div>

                <!-- Gross Profit -->
                <div class="card p-6 border-l-4" :class="financialOverview.profitability?.grossProfit >= 0 ? 'border-green-500' : 'border-red-500'">
                  <div class="flex items-center">
                    <div class="p-3 rounded-full" :class="financialOverview.profitability?.grossProfit >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6">
                        </path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-secondary-600">Gross Profit</p>
                      <p class="text-2xl font-bold" :class="financialOverview.profitability?.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ formattedGrossProfit }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Profit Margin -->
                <div class="card p-6 border-l-4 border-purple-500">
                  <div class="flex items-center">
                    <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                        </path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-secondary-600">Profit Margin</p>
                      <p class="text-2xl font-bold" :class="profitMarginClass">
                        {{ (financialOverview.profitability?.profitMargin || 0).toFixed(1) }}%
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Cash Runway -->
                <div class="card p-6 border-l-4 border-orange-500">
                  <div class="flex items-center">
                    <div class="p-3 rounded-full bg-orange-100 text-orange-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                        </path>
                      </svg>
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-secondary-600">Cash Runway</p>
                      <p class="text-2xl font-bold text-orange-600">
                        {{ Math.round(financialOverview.cashFlow?.runway || 0) }} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Financial Health Indicators -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">💪 Financial Health</h4>
                  <div class="space-y-4">
                    <div class="flex justify-between">
                      <span class="text-sm text-secondary-600">Current Ratio</span>
                      <span class="font-semibold" :class="financialOverview.healthIndicators?.currentRatio >= 1.2 ? 'text-green-600' : 'text-red-600'">
                        {{ (financialOverview.healthIndicators?.currentRatio || 0).toFixed(2) }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-secondary-600">Working Capital</span>
                      <span class="font-semibold" :class="financialOverview.healthIndicators?.workingCapital >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ formatCurrency(financialOverview.healthIndicators?.workingCapital) }}
                      </span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-secondary-600">Pending Expenses</span>
                      <span class="font-semibold text-yellow-600">
                        {{ formatCurrency(financialOverview.healthIndicators?.totalPendingExpenses) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Expense Categories Chart -->
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">💸 Expense Breakdown</h4>
                  <div v-if="expenseCategories.breakdown?.length > 0" class="h-64">
                    <Doughnut :data="expenseCategoryChartData" :options="chartOptions" />
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    <p>No expense data available</p>
                  </div>
                </div>

                <!-- Expense Trends -->
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">📈 Expense Trends</h4>
                  <div v-if="expenseTrends.dailyTrends?.length > 0" class="h-64">
                    <Line :data="expenseTrendsChartData" :options="lineChartOptions" />
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    <p>No trend data available</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Expenses Tab -->
            <div v-if="activeTab === 'expenses'" class="space-y-6">
              <!-- Expense Management Header -->
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-secondary-900">Business Expenses Management</h3>
                <button @click="openExpenseModal()" class="btn btn-primary flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add New Expense
                </button>
              </div>

              <!-- Expenses Table -->
              <div class="card overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="expense in businessExpenses" :key="expense._id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <span class="text-lg mr-2">{{ getCategoryIcon(expense.category) }}</span>
                            <span class="text-sm font-medium text-gray-900">
                              {{ expenseCategories_options.find(cat => cat.value === expense.category)?.label || expense.category }}
                            </span>
                          </div>
                          <div v-if="expense.isRecurring" class="text-xs text-purple-600 flex items-center gap-1">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            {{ expense.frequency }}
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <div class="text-sm text-gray-900">{{ expense.description }}</div>
                          <div v-if="expense.invoiceNumber" class="text-xs text-gray-500">Invoice: {{ expense.invoiceNumber }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm font-semibold text-gray-900">{{ formatCurrency(expense.amount) }}</div>
                          <div class="text-xs text-gray-500">{{ expense.paymentMethod.replace('_', ' ') }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ expense.vendor || 'N/A' }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(expense.status)]">
                            {{ expense.status }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">{{ formatDate(expense.date) }}</div>
                          <div v-if="expense.dueDate" class="text-xs text-gray-500">Due: {{ formatDate(expense.dueDate) }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button @click="openExpenseModal(expense)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </button>
                          <button @click="deleteExpense(expense._id)" class="text-red-600 hover:text-red-900">
                            Delete
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Recurring Expenses Tab -->
            <div v-if="activeTab === 'recurring'" class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Recurring Expenses List -->
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">🔄 Active Recurring Expenses</h4>
                  <div class="space-y-3">
                    <div v-for="expense in recurringExpenses.recurringExpenses" :key="expense._id" 
                         class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900">{{ expense.description }}</span>
                        <span class="text-lg font-bold text-gray-900">{{ formatCurrency(expense.amount) }}</span>
                      </div>
                      <div class="flex items-center justify-between text-sm text-gray-600">
                        <span>{{ expense.frequency }} • {{ expense.category }}</span>
                        <span v-if="expense.nextOccurrence">Next: {{ formatDate(expense.nextOccurrence) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Upcoming Payments -->
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">📅 Upcoming Payments (90 days)</h4>
                  <div class="space-y-3">
                    <div v-for="expense in recurringExpenses.upcomingExpenses" :key="expense._id" 
                         class="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900">{{ expense.description }}</span>
                        <span class="text-lg font-bold text-orange-600">{{ formatCurrency(expense.amount) }}</span>
                      </div>
                      <div class="flex items-center justify-between text-sm">
                        <span class="text-gray-600">{{ expense.vendor || 'No vendor' }}</span>
                        <span :class="[
                          'font-semibold',
                          expense.daysUntilDue <= 7 ? 'text-red-600' : 
                          expense.daysUntilDue <= 30 ? 'text-yellow-600' : 'text-gray-600'
                        ]">
                          {{ expense.daysUntilDue }} days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Monthly Recurring Total -->
              <div class="card p-6">
                <div class="text-center">
                  <div class="text-3xl font-bold text-purple-600 mb-2">
                    {{ formatCurrency(recurringExpenses.totalRecurringMonthly) }}
                  </div>
                  <div class="text-lg text-secondary-600">Total Monthly Recurring Expenses</div>
                </div>
              </div>
            </div>

            <!-- Vendor Analysis Tab -->
            <div v-if="activeTab === 'vendors'" class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Vendor Spending Chart -->
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">🏪 Top Vendors by Spending</h4>
                  <div v-if="vendorAnalysis.vendorAnalysis?.length > 0" class="h-80">
                    <Pie :data="vendorSpendingChartData" :options="chartOptions" />
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    <p>No vendor data available</p>
                  </div>
                </div>

                <!-- Vendor Details -->
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">📊 Vendor Details</h4>
                  <div class="space-y-3 max-h-80 overflow-y-auto">
                    <div v-for="vendor in vendorAnalysis.vendorAnalysis" :key="vendor._id" 
                         class="border border-gray-200 rounded-lg p-4">
                      <div class="flex items-center justify-between mb-2">
                        <span class="font-medium text-gray-900">{{ vendor._id }}</span>
                        <span class="text-lg font-bold text-gray-900">{{ formatCurrency(vendor.totalSpent) }}</span>
                      </div>
                      <div class="flex items-center justify-between text-sm text-gray-600">
                        <span>{{ vendor.transactionCount }} transactions</span>
                        <span>Avg: {{ formatCurrency(vendor.averageTransaction) }}</span>
                      </div>
                      <div class="text-xs text-gray-500 mt-1">
                        Categories: {{ vendor.categories.join(', ') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vendor Summary -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="card p-6 text-center">
                  <div class="text-2xl font-bold text-blue-600 mb-2">{{ vendorAnalysis.totalVendors || 0 }}</div>
                  <div class="text-sm text-secondary-600">Active Vendors</div>
                </div>
                <div class="card p-6 text-center">
                  <div class="text-2xl font-bold text-red-600 mb-2">{{ formatCurrency(vendorAnalysis.totalVendorSpending) }}</div>
                  <div class="text-sm text-secondary-600">Total Vendor Spending</div>
                </div>
                <div class="card p-6 text-center">
                  <div class="text-2xl font-bold text-purple-600 mb-2">
                    {{ vendorAnalysis.totalVendors > 0 ? formatCurrency(vendorAnalysis.totalVendorSpending / vendorAnalysis.totalVendors) : '$0' }}
                  </div>
                  <div class="text-sm text-secondary-600">Average per Vendor</div>
                </div>
              </div>
            </div>

            <!-- Performance Tab -->
            <div v-if="activeTab === 'performance'" class="space-y-6">
              <!-- Performance Metrics Comparison -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">📈 Revenue Growth</h4>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2" :class="performanceMetrics.growth?.revenue >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ performanceMetrics.growth?.revenue >= 0 ? '+' : '' }}{{ (performanceMetrics.growth?.revenue || 0).toFixed(1) }}%
                    </div>
                    <div class="text-sm text-gray-600">vs Previous Period</div>
                    <div class="mt-4 text-sm">
                      <div class="flex justify-between">
                        <span>Current:</span>
                        <span class="font-semibold">{{ formatCurrency(performanceMetrics.current?.revenue) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>Previous:</span>
                        <span class="font-semibold">{{ formatCurrency(performanceMetrics.previous?.revenue) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">💸 Expense Growth</h4>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2" :class="performanceMetrics.growth?.expenses <= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ performanceMetrics.growth?.expenses >= 0 ? '+' : '' }}{{ (performanceMetrics.growth?.expenses || 0).toFixed(1) }}%
                    </div>
                    <div class="text-sm text-gray-600">vs Previous Period</div>
                    <div class="mt-4 text-sm">
                      <div class="flex justify-between">
                        <span>Current:</span>
                        <span class="font-semibold">{{ formatCurrency(performanceMetrics.current?.totalExpenses) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>Previous:</span>
                        <span class="font-semibold">{{ formatCurrency(performanceMetrics.previous?.totalExpenses) }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="card p-6">
                  <h4 class="text-lg font-semibold text-secondary-900 mb-4">💰 Profit Growth</h4>
                  <div class="text-center">
                    <div class="text-3xl font-bold mb-2" :class="performanceMetrics.growth?.profit >= 0 ? 'text-green-600' : 'text-red-600'">
                      {{ performanceMetrics.growth?.profit >= 0 ? '+' : '' }}{{ (performanceMetrics.growth?.profit || 0).toFixed(1) }}%
                    </div>
                    <div class="text-sm text-gray-600">vs Previous Period</div>
                    <div class="mt-4 text-sm">
                      <div class="flex justify-between">
                        <span>Current:</span>
                        <span class="font-semibold">{{ formatCurrency(performanceMetrics.current?.grossProfit) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span>Previous:</span>
                        <span class="font-semibold">{{ formatCurrency(performanceMetrics.previous?.grossProfit) }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Detailed Performance Breakdown -->
              <div class="card p-6">
                <h4 class="text-lg font-semibold text-secondary-900 mb-6">📋 Detailed Performance Analysis</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <!-- Current Period -->
                  <div>
                    <h5 class="text-md font-semibold text-gray-700 mb-4">Current Period ({{ selectedPeriod }} days)</h5>
                    <div class="space-y-3">
                      <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-600">Revenue</span>
                        <span class="font-semibold text-green-600">{{ formatCurrency(performanceMetrics.current?.revenue) }}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-600">Business Expenses</span>
                        <span class="font-semibold text-red-600">{{ formatCurrency(performanceMetrics.current?.businessExpenses) }}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-600">Other Expenses</span>
                        <span class="font-semibold text-red-600">{{ formatCurrency(performanceMetrics.current?.otherExpenses) }}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b-2 border-gray-300">
                        <span class="font-semibold text-gray-800">Gross Profit</span>
                        <span class="font-bold text-lg" :class="performanceMetrics.current?.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                          {{ formatCurrency(performanceMetrics.current?.grossProfit) }}
                        </span>
                      </div>
                      <div class="flex justify-between py-2">
                        <span class="text-gray-600">Orders Count</span>
                        <span class="font-semibold">{{ performanceMetrics.current?.orderCount || 0 }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Previous Period -->
                  <div>
                    <h5 class="text-md font-semibold text-gray-700 mb-4">Previous Period ({{ selectedPeriod }} days)</h5>
                    <div class="space-y-3">
                      <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-600">Revenue</span>
                        <span class="font-semibold text-green-600">{{ formatCurrency(performanceMetrics.previous?.revenue) }}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-600">Business Expenses</span>
                        <span class="font-semibold text-red-600">{{ formatCurrency(performanceMetrics.previous?.businessExpenses) }}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b border-gray-100">
                        <span class="text-gray-600">Other Expenses</span>
                        <span class="font-semibold text-red-600">{{ formatCurrency(performanceMetrics.previous?.otherExpenses) }}</span>
                      </div>
                      <div class="flex justify-between py-2 border-b-2 border-gray-300">
                        <span class="font-semibold text-gray-800">Gross Profit</span>
                        <span class="font-bold text-lg" :class="performanceMetrics.previous?.grossProfit >= 0 ? 'text-green-600' : 'text-red-600'">
                          {{ formatCurrency(performanceMetrics.previous?.grossProfit) }}
                        </span>
                      </div>
                      <div class="flex justify-between py-2">
                        <span class="text-gray-600">Orders Count</span>
                        <span class="font-semibold">{{ performanceMetrics.previous?.orderCount || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Expense Modal -->
    <div v-if="showExpenseModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeExpenseModal">
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">
            {{ editingExpense ? 'Edit Business Expense' : 'Add New Business Expense' }}
          </h3>
          <button @click="closeExpenseModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveExpense" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select v-model="expenseForm.category" class="form-input w-full" required>
                <option v-for="cat in expenseCategories_options" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>

            <!-- Amount -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input v-model="expenseForm.amount" type="number" step="0.01" min="0" class="form-input w-full" required>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <input v-model="expenseForm.description" type="text" class="form-input w-full" required>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Vendor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
              <input v-model="expenseForm.vendor" type="text" class="form-input w-full">
            </div>

            <!-- Invoice Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input v-model="expenseForm.invoiceNumber" type="text" class="form-input w-full">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select v-model="expenseForm.paymentMethod" class="form-input w-full">
                <option v-for="method in paymentMethods" :key="method.value" :value="method.value">
                  {{ method.label }}
                </option>
              </select>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select v-model="expenseForm.status" class="form-input w-full">
                <option v-for="status in statusOptions" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Due Date -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input v-model="expenseForm.dueDate" type="date" class="form-input w-full">
            </div>
          </div>

          <!-- Recurring Expense Options -->
          <div class="border border-gray-200 rounded-lg p-4">
            <div class="flex items-center mb-4">
              <input v-model="expenseForm.isRecurring" type="checkbox" class="mr-2">
              <label class="text-sm font-medium text-gray-700">This is a recurring expense</label>
            </div>
            
            <div v-if="expenseForm.isRecurring" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select v-model="expenseForm.frequency" class="form-input w-full">
                  <option v-for="freq in frequencyOptions" :key="freq.value" :value="freq.value">
                    {{ freq.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea v-model="expenseForm.notes" rows="3" class="form-input w-full"></textarea>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-4 border-t">
            <button type="button" @click="closeExpenseModal" class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              {{ editingExpense ? 'Update Expense' : 'Create Expense' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ChatWidget />
  </div>
</template>

<style scoped>
.page-background {
  background: linear-gradient(to bottom right, var(--primary-50), var(--secondary-50));
}

.card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.form-input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
}

.btn-primary:hover {
  background-color: #2563eb;
  border-color: #2563eb;
}

.form-select {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  background-color: white;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>

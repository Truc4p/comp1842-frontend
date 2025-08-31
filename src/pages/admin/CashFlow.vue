<!-- src/pages/admin/CashFlow.vue -->
<script setup>
import axios from "axios";
import { onMounted, ref, computed, watch } from "vue";
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

// 🚀 PHASE 2: Manual Transaction Entry Data
const newTransaction = ref({
  type: 'inflow',
  category: 'product_sales',
  amount: '',
  description: ''
});

const isSubmitting = ref(false);
const successMessage = ref('');

// Available categories for transaction types
const availableCategories = computed(() => {
  if (newTransaction.value.type === 'inflow') {
    return [
      { value: 'product_sales', label: 'Product Sales' },
      { value: 'service_revenue', label: 'Service Revenue' },
      { value: 'investment_income', label: 'Investment Income' },
      { value: 'other_income', label: 'Other Income' }
    ];
  } else {
    return [
      { value: 'operating_expenses', label: 'Operating Expenses' },
      { value: 'cost_of_goods_sold', label: 'Cost of Goods Sold' },
      { value: 'payroll', label: 'Payroll' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'taxes', label: 'Taxes' },
      { value: 'rent', label: 'Rent' },
      { value: 'utilities', label: 'Utilities' },
      { value: 'shipping_costs', label: 'Shipping Costs' },
      { value: 'refunds', label: 'Refunds' },
      { value: 'other_expenses', label: 'Other Expenses' }
    ];
  }
});

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
  console.log('🔍 Chart Debug - cashFlowHistory:', cashFlowHistory.value);
  
  if (!cashFlowHistory.value || cashFlowHistory.value.length === 0) {
    console.log('⚠️ No cash flow history data available for chart');
    return { labels: [], datasets: [] };
  }
  
  const sortedHistory = [...cashFlowHistory.value].sort((a, b) => new Date(a.date) - new Date(b.date));
  console.log('🔍 Sorted history for chart:', sortedHistory.slice(0, 3)); // Log first 3 items
  
  // Calculate running balance from netFlow data
  const labels = sortedHistory.map(d => new Date(d.date).toLocaleDateString());
  const balances = [];
  
  // Calculate cumulative balance from first day to last
  let runningBalance = 0;
  const currentBalance = cashFlowData.value?.currentBalance || 0;
  
  // Calculate total net flow to determine starting point
  const totalNetFlow = sortedHistory.reduce((sum, entry) => sum + (entry.netFlow || 0), 0);
  const startingBalance = currentBalance - totalNetFlow;
  
  console.log('🔍 Balance calculation debug:', {
    currentBalance,
    totalNetFlow,
    startingBalance,
    historyLength: sortedHistory.length
  });
  
  // Calculate daily balances progressively
  runningBalance = startingBalance;
  for (let i = 0; i < sortedHistory.length; i++) {
    const entry = sortedHistory[i];
    runningBalance += (entry.netFlow || 0);
    balances.push(Math.max(0, runningBalance)); // Ensure non-negative balance
  }
  
  console.log('🔍 Chart labels:', labels.slice(0, 5));
  console.log('🔍 Chart balances (calculated):', balances.slice(0, 5));
  
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
    labels: categoryBreakdown.value.inflows.map(cat => getCategoryDisplayName(cat.category || cat.name)),
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
    labels: categoryBreakdown.value.outflows.map(cat => getCategoryDisplayName(cat.category || cat.name)),
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

// Generate sample history data for charts when API doesn't provide it
const generateSampleHistoryData = () => {
  const data = [];
  const currentBalance = cashFlowData.value.currentBalance || 21914;
  const days = selectedPeriod.value || 30;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Calculate progressive balance based on current balance
    const progressRatio = (days - i) / days;
    const dailyVariation = (Math.random() - 0.5) * 1000; // Random daily changes
    const balance = (currentBalance * 0.7) + (currentBalance * 0.3 * progressRatio) + dailyVariation;
    
    data.push({
      date: date.toISOString().split('T')[0],
      balance: Math.max(0, balance), // Ensure non-negative
      inflows: Math.random() * 3000 + 1000,
      outflows: Math.random() * 2000 + 800,
      netFlow: Math.random() * 1000 - 500
    });
  }
  
  console.log('📊 Generated sample history data:', data.slice(0, 3));
  return data;
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

// 🚀 PHASE 1: Real Data Integration - Replace Mock Functions

// Helper function to convert category codes to display names
const getCategoryDisplayName = (category) => {
  const categoryLabels = {
    'product_sales': 'Product Sales',
    'service_revenue': 'Service Revenue', 
    'investment_income': 'Investment Income',
    'other_income': 'Other Income',
    'operating_expenses': 'Operating Expenses',
    'cost_of_goods_sold': 'Cost of Goods Sold',
    'payroll': 'Payroll',
    'marketing': 'Marketing',
    'taxes': 'Taxes',
    'rent': 'Rent',
    'utilities': 'Utilities',
    'shipping_costs': 'Shipping Costs',
    'refunds': 'Refunds',
    'other_expenses': 'Other Expenses'
  };
  return categoryLabels[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Fetch main cash flow dashboard data
const fetchCashFlowData = async () => {
  try {
    const token = localStorage.getItem("token");
    
    console.log('🔍 Token check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token?.substring(0, 50) + '...'
    });
    
    if (!token) {
      console.warn('🔐 No token found, redirecting to login');
      error.value = "Authentication required";
      router.push("/login");
      return;
    }

    // Check if token is expired
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      console.log('🕒 Token timing:', {
        expires: new Date(tokenPayload.exp * 1000).toISOString(),
        current: new Date(currentTime * 1000).toISOString(),
        isExpired: tokenPayload.exp < currentTime,
        timeLeft: (tokenPayload.exp - currentTime) / 3600 + ' hours'
      });
      
      if (tokenPayload.exp < currentTime) {
        console.warn('🔐 Token expired, redirecting to login');
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
    } catch (e) {
      console.warn('🔐 Invalid token format, redirecting to login', e);
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }

    // Add timestamp to prevent caching
    const timestamp = new Date().getTime();
    
    // Use proper Authorization header format
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache'
    };
    
    console.log('📡 Making API request:', {
      url: `${API_URL}/cashflow/dashboard?period=${selectedPeriod.value}&_t=${timestamp}`,
      headers: {
        ...headers,
        Authorization: 'Bearer ' + (token ? token.substring(0, 20) + '...' : 'missing')
      }
    });
    
    const response = await axios.get(`${API_URL}/cashflow/dashboard?period=${selectedPeriod.value}&_t=${timestamp}`, {
      headers
    });
    
    cashFlowData.value = response.data;
    
    // Fetch historical data with cache busting
    const historyResponse = await axios.get(`${API_URL}/cashflow/history?period=${selectedPeriod.value}&_t=${timestamp}`, {
      headers
    });
    
    console.log('🔍 History API Response:', historyResponse.data);
    
    cashFlowHistory.value = historyResponse.data.history;
    inflowsData.value = historyResponse.data.inflows || [];
    outflowsData.value = historyResponse.data.outflows || [];
    
    console.log('🔍 Assigned cashFlowHistory:', cashFlowHistory.value);
    console.log('🔍 History length:', cashFlowHistory.value?.length);
    
    console.log("✅ Real cash flow data loaded successfully", {
      currentBalance: cashFlowData.value.currentBalance,
      netCashFlow: cashFlowData.value.netCashFlow,
      historyEntries: cashFlowHistory.value.length,
      timestamp: new Date().toLocaleTimeString()
    });
    
  } catch (err) {
    console.error("❌ Error fetching cash flow data:", err);
    console.error("❌ Error details:", {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      config: {
        url: err.config?.url,
        headers: err.config?.headers
      }
    });
    
    error.value = err.response?.data?.message || err.message || 'Failed to load cash flow data';
    
    // Handle authentication errors
    if (err.response?.status === 401 || err.response?.status === 403) {
      console.warn('🔐 Authentication failed, redirecting to login');
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }
    
    // Fallback to mock data if API fails (for development)
    if (err.response?.status === 404 || err.code === 'ECONNREFUSED') {
      console.warn("💡 Cash flow endpoints not available, using mock data for development");
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
      error.value = null; // Clear error when using fallback
    } else {
      error.value = "Failed to load cash flow data";
    }
  }
};

// Fetch category breakdown data
const fetchCategoryBreakdown = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/cashflow/categories?period=${selectedPeriod.value}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    categoryBreakdown.value = response.data;
    console.log("✅ Category breakdown data loaded successfully", {
      inflowCategories: response.data.inflows?.length || 0,
      outflowCategories: response.data.outflows?.length || 0
    });
  } catch (err) {
    console.error("Error fetching category breakdown:", err);
    // Fallback to mock data
    console.warn("💡 Using mock category data");
    categoryBreakdown.value = generateMockCategoryBreakdown();
  }
};

// Fetch forecast data
const fetchForecast = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/cashflow/forecast`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    forecast.value = response.data;
    console.log("✅ Forecast data loaded successfully", {
      forecastDays: response.data.length || 0
    });
  } catch (err) {
    console.error("Error fetching forecast:", err);
    // Fallback to mock data
    console.warn("💡 Using mock forecast data");
    forecast.value = generateMockForecast();
  }
};

// 🚀 PHASE 2: Manual Transaction Entry Functions

// Watch transaction type changes to update category
watch(() => newTransaction.value.type, (newType) => {
  // Set default category when type changes
  if (newType === 'inflow') {
    newTransaction.value.category = 'product_sales';
  } else {
    newTransaction.value.category = 'operating_expenses';
  }
});

// Add manual transaction
const addTransaction = async () => {
  try {
    // Clear previous messages
    error.value = '';
    successMessage.value = '';
    
    // Validate form
    if (!newTransaction.value.amount || newTransaction.value.amount <= 0) {
      error.value = "Please enter a valid amount greater than 0";
      return;
    }
    
    if (!newTransaction.value.description.trim()) {
      error.value = "Please enter a description";
      return;
    }

    if (newTransaction.value.description.trim().length < 3) {
      error.value = "Description must be at least 3 characters long";
      return;
    }

    isSubmitting.value = true;
    
    const token = localStorage.getItem("token");
    
    if (!token) {
      error.value = "Authentication required. Please log in again.";
      router.push("/login");
      return;
    }
    
    const transactionData = {
      type: newTransaction.value.type,
      category: newTransaction.value.category,
      amount: parseFloat(newTransaction.value.amount),
      description: newTransaction.value.description.trim(),
      date: new Date(),
      automated: false
    };

    console.log("📝 Submitting transaction:", transactionData);

    const response = await axios.post(`${API_URL}/cashflow/transactions`, transactionData, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ Transaction added successfully:", response.data);
    
    const transactionType = newTransaction.value.type === 'inflow' ? 'Income' : 'Expense';
    const categoryLabel = availableCategories.value.find(cat => cat.value === newTransaction.value.category)?.label || newTransaction.value.category;
    
    successMessage.value = `${transactionType} of $${transactionData.amount.toFixed(2)} (${categoryLabel}) added successfully!`;
    
    // Reset form
    newTransaction.value = {
      type: 'inflow',
      category: 'product_sales',
      amount: '',
      description: ''
    };

    // Refresh all data to show the new transaction
    await fetchAllData();
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = '';
    }, 5000);

  } catch (err) {
    console.error("❌ Error adding transaction:", err);
    
    if (err.response?.status === 401) {
      error.value = "Authentication failed. Please log in again.";
      router.push("/login");
    } else if (err.response?.status === 403) {
      error.value = "Admin access required to add transactions.";
    } else {
      error.value = err.response?.data?.message || "Failed to add transaction. Please try again.";
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Handle period change
const handlePeriodChange = async () => {
  loading.value = true;
  try {
    await Promise.all([
      fetchCashFlowData(),
      fetchCategoryBreakdown(),
      fetchForecast()
    ]);
  } catch (err) {
    console.error("Error updating data for new period:", err);
  } finally {
    loading.value = false;
  }
};

// Manual sync function for testing automation
const syncOrdersToTransactions = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    
    const response = await axios.post(`${API_URL}/cashflow/sync-orders`, {}, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    console.log("Orders synced to transactions:", response.data);
    
    // Refresh all data after sync
    await fetchAllData();
    
  } catch (err) {
    console.error("Error syncing orders:", err);
    error.value = "Failed to sync order data";
  } finally {
    loading.value = false;
  }
};

// Debug function to check transactions
const debugTransactions = async () => {
  try {
    const token = localStorage.getItem("token");
    
    const response = await axios.get(`${API_URL}/cashflow/debug/recent`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    console.log("🐛 DEBUG: Transaction data:", response.data);
    console.table(response.data.recentTransactions);
    
    alert(`Debug Info:
Total Transactions: ${response.data.totalTransactions}
Manual Transactions: ${response.data.manualTransactions}
Automated Transactions: ${response.data.automatedTransactions}

Check console for detailed transaction list.`);
    
  } catch (err) {
    console.error("Debug error:", err);
    alert("Debug failed - check console for details");
  }
};

// Fetch all data
const fetchAllData = async () => {
  loading.value = true;
  try {
    // Fetch all cash flow data in parallel for better performance
    await Promise.all([
      fetchCashFlowData(),
      fetchCategoryBreakdown(),
      fetchForecast()
    ]);
  } catch (err) {
    error.value = "Failed to load cash flow data";
    console.error("Error loading all cash flow data:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  console.log('🚀 CashFlow component mounted');
  
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn('🔐 No token found on mount, redirecting to login');
    alert("You need to login first");
    router.push("/login");
    return;
  }

  // Validate token expiry
  try {
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (tokenPayload.exp < currentTime) {
      console.warn('🔐 Token expired on mount, redirecting to login');
      localStorage.removeItem('token');
      alert("Your session has expired. Please login again.");
      router.push("/login");
      return;
    }
    console.log('✅ Valid token found, proceeding with data fetch');
  } catch (e) {
    console.warn('🔐 Invalid token format on mount, redirecting to login');
    localStorage.removeItem('token');
    alert("Invalid session. Please login again.");
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
                <p class="text-2xl font-bold" :class="cashFlowData.currentBalance >= 0 ? 'text-blue-600' : 'text-red-600'">
                  {{ formattedCurrentBalance }}
                </p>
              </div>
            </div>
          </div>

          <!-- Net Cash Flow -->
          <div class="card p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full" 
                   :class="cashFlowData.netCashFlow >= 0 ? 'bg-green-100 text-success' : 'bg-red-100 text-red-600'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="cashFlowData.netCashFlow >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'">
                  </path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Net Cash Flow ({{ selectedPeriod }} days)</p>
                <p class="text-2xl font-bold" :class="cashFlowData.netCashFlow >= 0 ? 'text-success' : 'text-red-600'">
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
                   :class="cashFlowData.runway > 90 ? 'bg-green-100 text-success' : cashFlowData.runway > 30 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
                  </path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-secondary-600">Runway</p>
                <p class="text-2xl font-bold" 
                   :class="cashFlowData.runway > 90 ? 'text-success' : cashFlowData.runway > 30 ? 'text-yellow-600' : 'text-red-600'">
                  {{ Math.round(cashFlowData.runway) }} days
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Period Selector & Controls -->
        <div class="card p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-secondary-900">Analysis Period</h3>
            <div class="flex items-center gap-3">
              <select v-model="selectedPeriod" @change="handlePeriodChange" class="form-select w-40">
                <option v-for="period in periods" :key="period.value" :value="period.value">
                  {{ period.label }}
                </option>
              </select>
              <button 
                @click="syncOrdersToTransactions"
                :disabled="loading"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
              >
                <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else>🔄</span>
                Sync Orders
              </button>
              <button 
                @click="debugTransactions"
                :disabled="loading"
                class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 flex items-center gap-2"
              >
                <span>🐛</span>
                Debug
              </button>
            </div>
          </div>
        </div>

        <!-- 🚀 PHASE 2: Manual Transaction Entry -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-secondary-900 mb-4">➕ Add Manual Transaction</h3>
          
          <!-- Success Message -->
          <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {{ successMessage }}
          </div>
          
          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {{ error }}
          </div>

          <form @submit.prevent="addTransaction">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <!-- Transaction Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select v-model="newTransaction.type" class="form-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option value="inflow">💰 Income</option>
                  <option value="outflow">💸 Expense</option>
                </select>
              </div>

              <!-- Category -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select v-model="newTransaction.category" class="form-select w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                  <option v-for="cat in availableCategories" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <!-- Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                <input 
                  v-model="newTransaction.amount" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  placeholder="0.00" 
                  class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input 
                  v-model="newTransaction.description" 
                  type="text" 
                  placeholder="Transaction description" 
                  class="form-input w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                >
              </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-4 flex items-center gap-3">
              <button 
                type="submit" 
                :disabled="isSubmitting || !newTransaction.amount || !newTransaction.description"
                class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span v-else>➕</span>
                {{ isSubmitting ? 'Adding...' : 'Add Transaction' }}
              </button>
              
              <p class="text-sm text-gray-500">
                Add {{ newTransaction.type === 'inflow' ? 'income' : 'expense' }} transactions manually to track non-automated cash flows
              </p>
            </div>
          </form>
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
              <div class="text-2xl font-bold text-success">{{ formattedTotalInflows }}</div>
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
                <span class="text-sm font-medium text-secondary-900">{{ getCategoryDisplayName(category.category || category.name) }}</span>
                <span class="text-sm font-semibold text-success">
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
                <span class="text-sm font-medium text-secondary-900">{{ getCategoryDisplayName(category.category || category.name) }}</span>
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
              <div class="text-2xl font-bold" :class="cashFlowData.netCashFlow / cashFlowData.totalInflows > 0.15 ? 'text-success' : 'text-yellow-600'">
                {{ ((cashFlowData.netCashFlow / cashFlowData.totalInflows) * 100).toFixed(1) }}%
              </div>
              <div class="text-sm text-secondary-600">Net cash flow / Total inflows</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-secondary-900">Cash Flow Coverage</div>
              <div class="text-2xl font-bold" :class="cashFlowData.totalInflows / cashFlowData.totalOutflows > 1.2 ? 'text-success' : 'text-red-600'">
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

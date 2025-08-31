Looking at your Cash Flow dashboard, the **Daily Burn Rate** is a key financial metric that shows how much money your business spends per day on average. Let me explain how it works in your application:

## 📊 **What is Daily Burn Rate?**

**Daily Burn Rate** = Total Outflows ÷ Number of Days in Period

It represents the average amount of cash your business "burns" (spends) each day to operate.

## 🔧 **How it's Calculated in Your App**

Let me check how it's currently implemented in your backend: Let me find the specific calculation for cash burn rate: Perfect! Let me read that specific section: ## 💡 **How Daily Burn Rate Works in Your App**

### **Calculation Formula:**
```javascript
const cashBurnRate = totalOutflows / period;
```

### **Step-by-Step Process:**

1. **Aggregate Total Outflows**: Your app sums all outflow transactions (expenses) within the selected period (e.g., 30 days)

2. **Calculate Daily Average**: Divides total outflows by the number of days in the period
   - Example: $30,000 in outflows ÷ 30 days = $1,000/day burn rate

3. **Display**: Shows as `$1,000.00/day` in your dashboard

### **Real-World Example from Your Data:**
If you're looking at a 30-day period with:
- **Total Outflows**: $32,750 (sum of all expenses)
- **Period**: 30 days
- **Daily Burn Rate**: $32,750 ÷ 30 = $1,091.67/day

## 📈 **Why Daily Burn Rate Matters:**

### **1. Cash Management**
- Shows how fast you're spending money
- Helps predict when you'll run out of cash

### **2. Runway Calculation** 
Your app uses burn rate to calculate runway:
```javascript
const runway = cashBurnRate > 0 ? Math.floor(currentBalance / cashBurnRate) : null;
```
- **Runway** = Current Balance ÷ Daily Burn Rate
- Example: $50,000 ÷ $1,091.67 = 46 days of runway

### **3. Business Planning**
- **Green**: Low burn rate = sustainable operations
- **Yellow**: Moderate burn rate = monitor closely  
- **Red**: High burn rate = need to reduce expenses or increase revenue

## 🎯 **What Influences Your Burn Rate:**

**Outflows that increase burn rate:**
- Operating expenses
- Payroll
- Rent & utilities
- Marketing costs
- Cost of goods sold
- Shipping costs
- Taxes

**The higher these expenses, the higher your daily burn rate becomes.**

Your burn rate automatically updates as you:
- Add manual expense transactions
- Sync new orders (which create automated expense entries)
- Change the analysis period (7, 30, 90 days, etc.)

This metric helps you understand your business's financial velocity and make informed decisions about spending and cash management! 🚀
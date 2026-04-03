export function calculateIncome(transactions) {
  return transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
}

export function calculateExpenses(transactions) {
  return transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
}

export function calculateBalance(transactions) {
  return calculateIncome(transactions) - calculateExpenses(transactions);
}

export function formatCurrency(amount) {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `₹${formatted}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getCategoryBreakdown(transactions) {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const breakdown = {};
  expenses.forEach((t) => {
    if (!breakdown[t.category]) breakdown[t.category] = 0;
    breakdown[t.category] += t.amount;
  });
  return Object.entries(breakdown).map(([name, value]) => ({ name, value }));
}

export function getHighestSpendingCategory(transactions) {
  const breakdown = getCategoryBreakdown(transactions);
  if (breakdown.length === 0) return null;
  return breakdown.reduce((max, item) => (item.value > max.value ? item : max), breakdown[0]);
}

export function calculateMonthlySavings(transactions) {
  const income = calculateIncome(transactions);
  const expenses = calculateExpenses(transactions);
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  return { amount: income - expenses, rate: Math.round(savingsRate) };
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function percentageChange(current, previous) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

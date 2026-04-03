import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, Activity } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import {
  formatCurrency,
  getHighestSpendingCategory,
  calculateMonthlySavings,
  getCategoryBreakdown,
} from '../utils/calculations';
import { monthlyTrendData } from '../data/dummyData';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface-highest)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] py-2 px-3 text-xs text-[var(--text-primary)] shadow-[var(--shadow-card)]">
      {label && <p className="text-[var(--text-secondary)] mb-1 font-semibold">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.stroke || p.fill || 'var(--accent)' }}>
          {p.name}: ₹{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function Analytics() {
  const { transactions, totalIncome, totalExpenses } = useFinance();
  const highestCategory = getHighestSpendingCategory(transactions);
  const savings = calculateMonthlySavings(transactions);
  const breakdown = getCategoryBreakdown(transactions);

  const monthlyData = useMemo(() => {
    const months = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleString('en-IN', { month: 'short' });
      if (!months[key]) months[key] = { month: key, income: 0, expense: 0 };
      if (t.type === 'income') months[key].income += t.amount;
      else months[key].expense += t.amount;
    });
    return Object.values(months);
  }, [transactions]);

  const barChartData = monthlyData.length > 0 ? monthlyData : monthlyTrendData.map(m => ({
    month: m.month, income: m.income, expense: m.expenses,
  }));

  const spendingTrend = useMemo(() => {
    const grouped = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const d = new Date(t.date);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      if (!grouped[key]) grouped[key] = { date: key, amount: 0 };
      grouped[key].amount += t.amount;
    });
    return Object.values(grouped).sort((a, b) => {
      const [am, ad] = a.date.split('/').map(Number);
      const [bm, bd] = b.date.split('/').map(Number);
      return am - bm || ad - bd;
    });
  }, [transactions]);

  const pieColors = ['var(--accent)', 'var(--income)', '#ff6b8a', '#f59e0b', '#8b5cf6', '#7c8db5'];

  const cards = [
    { title: 'Highest Spending', value: highestCategory?.name || 'N/A', sub: highestCategory ? `${formatCurrency(highestCategory.value)} total` : 'No expenses', icon: TrendingUp, color: '#f59e0b' },
    { title: 'Monthly Savings', value: formatCurrency(savings.amount), sub: `${savings.rate}% savings rate`, icon: IndianRupee, color: 'var(--income)' },
    { title: 'Total Transactions', value: transactions.length.toString(), sub: `${transactions.filter(t => t.type === 'income').length} income · ${transactions.filter(t => t.type === 'expense').length} expense`, icon: Activity, color: 'var(--accent)' },
    { title: 'Expense Ratio', value: totalIncome > 0 ? `${Math.round((totalExpenses / totalIncome) * 100)}%` : '0%', sub: 'Of total income spent', icon: TrendingDown, color: 'var(--expense)' },
  ];

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.25 }}
      className="p-7 max-w-[1500px] mx-auto"
    >
      <div className="mb-6">
        <p className="label-caps mb-1 tracking-[0.16em]">The Ledger</p>
        <h2 className="font-display font-extrabold text-[22px] text-(--text-primary) tracking-[-0.01em]">Analytics</h2>
      </div>

      <div className="grid grid-cols-1 min-[501px]:grid-cols-2 min-[1001px]:grid-cols-4 gap-4 mb-5">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.35, ease: 'easeOut' }}
            whileHover={{ y: -3 }}
            className="card p-5"
          >
            <div className="inline-flex p-2.5 rounded-lg mb-3.5" style={{ background: `${card.color}18` }}>
              <card.icon size={18} style={{ color: card.color }} />
            </div>
            <p className="text-xl font-extrabold font-display text-(--text-primary) mb-1">{card.value}</p>
            <p className="label-caps tracking-[0.12em]">{card.title}</p>
            <p className="text-xs text-(--text-secondary) mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 min-[1001px]:grid-cols-2 gap-4 mb-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.35 }} className="card p-5 pb-3">
          <p className="label-caps mb-4 tracking-[0.14em]">Category Distribution</p>
          <div className="flex items-center">
            <ResponsiveContainer width="60%" height={220}>
              <PieChart>
                <Pie data={breakdown} cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                  {breakdown.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 flex flex-col gap-2 pl-1">
              {breakdown.map((b, i) => (
                <div key={b.name} className="flex items-center gap-2">
                  <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: pieColors[i % pieColors.length] }} />
                  <span className="text-[11px] text-(--text-secondary) font-medium uppercase tracking-[0.06em]">{b.name}</span>
                  <span className="text-[11px] text-(--text-primary) font-bold ml-auto">{formatCurrency(b.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35 }} className="card p-5 pb-3">
          <p className="label-caps mb-4 tracking-[0.14em]">Daily Spending Trend</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={spendingTrend}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--expense)', strokeWidth: 1, strokeDasharray: '4' }} />
              <Line type="monotone" dataKey="amount" name="Spending" stroke="var(--expense)" strokeWidth={2.5} dot={{ r: 4, fill: 'var(--expense)', strokeWidth: 0 }} activeDot={{ r: 6 }} style={{ filter: 'drop-shadow(0 0 4px rgba(255,59,92,0.3))' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35 }} className="card p-5 pb-3">
        <p className="label-caps mb-4 tracking-[0.14em]">Income vs Expense Comparison</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barChartData} barCategoryGap="28%" barGap={4}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600, letterSpacing: 1 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend wrapperStyle={{ fontSize: '11px', color: 'var(--text-secondary)', paddingTop: '8px' }} formatter={(value) => <span className="text-(--text-secondary) text-[11px] font-medium">{value}</span>} />
            <Bar dataKey="income" name="Income" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Expense" fill="var(--expense)" radius={[4, 4, 0, 0]} opacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}

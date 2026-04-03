import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Landmark, Coins, PiggyBank, CreditCard } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, calculateMonthlySavings } from '../utils/calculations';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function Assets() {
  const { transactions, totalIncome, totalExpenses, balance } = useFinance();
  const savings = calculateMonthlySavings(transactions);

  const assetData = useMemo(() => {
    const salaryIncome = transactions.filter(t => t.type === 'income' && t.category === 'Salary').reduce((s, t) => s + t.amount, 0);
    const freelanceIncome = transactions.filter(t => t.type === 'income' && t.category === 'Freelance').reduce((s, t) => s + t.amount, 0);
    const investments = transactions.filter(t => t.type === 'expense' && t.category === 'Investment').reduce((s, t) => s + t.amount, 0);
    const bonuses = transactions.filter(t => t.type === 'income' && t.category === 'Bonus').reduce((s, t) => s + t.amount, 0);
    return { salaryIncome, freelanceIncome, investments, bonuses };
  }, [transactions]);

  const assets = [
    { title: 'Cash & Savings', value: formatCurrency(balance > 0 ? balance : 0), sub: 'Net balance available', icon: Wallet, color: 'var(--income)', change: `+${savings.rate}%`, changePositive: true },
    { title: 'Investments', value: formatCurrency(assetData.investments), sub: 'Stocks & other instruments', icon: TrendingUp, color: 'var(--accent)', change: assetData.investments > 0 ? '+Active' : 'None', changePositive: assetData.investments > 0 },
    { title: 'Employment Income', value: formatCurrency(assetData.salaryIncome), sub: 'From salary this period', icon: Landmark, color: '#8b5cf6', change: 'Recurring', changePositive: true },
    { title: 'Freelance Income', value: formatCurrency(assetData.freelanceIncome), sub: 'From freelance projects', icon: Coins, color: '#f59e0b', change: assetData.freelanceIncome > 0 ? 'Active' : 'Pending', changePositive: assetData.freelanceIncome > 0 },
    { title: 'Bonuses & Rewards', value: formatCurrency(assetData.bonuses), sub: 'One-time income sources', icon: PiggyBank, color: '#ec4899', change: assetData.bonuses > 0 ? 'Received' : 'None', changePositive: assetData.bonuses > 0 },
    { title: 'Total Revenue', value: formatCurrency(totalIncome), sub: 'Cumulative income this period', icon: CreditCard, color: 'var(--income)', change: `${((totalIncome / (totalIncome + totalExpenses || 1)) * 100).toFixed(0)}% of flow`, changePositive: true },
  ];

  const summaryBar = [
    { label: 'Net Worth', val: formatCurrency(balance), colorClass: balance >= 0 ? 'text-(--income)' : 'text-(--expense)' },
    { label: 'Total Income', val: formatCurrency(totalIncome), colorClass: 'text-(--accent)' },
    { label: 'Total Outflow', val: formatCurrency(totalExpenses), colorClass: 'text-(--expense)' },
  ];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25 }}
      className="p-7 max-w-[1500px] mx-auto"
    >
      <div className="mb-6">
        <p className="label-caps mb-1 tracking-[0.16em]">Portfolio</p>
        <h2 className="font-display font-extrabold text-[22px] text-(--text-primary) tracking-[-0.01em]">Assets Overview</h2>
      </div>

      <div className="grid grid-cols-1 min-[901px]:grid-cols-3 gap-4 mb-6">
        {summaryBar.map(s => (
          <div key={s.label} className="card p-5">
            <p className="label-caps mb-2 tracking-[0.14em]">{s.label}</p>
            <p className={`font-display text-[26px] font-extrabold leading-none ${s.colorClass}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 min-[501px]:grid-cols-2 min-[901px]:grid-cols-3 gap-4">
        {assets.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35, ease: 'easeOut' }}
            whileHover={{ y: -4, boxShadow: '0 8px 32px rgba(0,229,255,0.07)' }}
            className="card p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="inline-flex p-2.5 rounded-lg" style={{ background: `${a.color}18` }}>
                <a.icon size={20} style={{ color: a.color }} />
              </div>
              <span className={`text-[11px] font-semibold ${a.changePositive ? 'text-(--income)' : 'text-(--text-secondary)'}`}>
                {a.change}
              </span>
            </div>
            <p className="font-display text-[22px] font-extrabold text-(--text-primary) mb-1 tracking-[-0.02em]">{a.value}</p>
            <p className="label-caps tracking-[0.12em] mb-0.5">{a.title}</p>
            <p className="text-xs text-(--text-secondary)">{a.sub}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

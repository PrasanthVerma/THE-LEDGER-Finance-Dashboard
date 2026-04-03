import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';
import SummaryCard from '../components/dashboard/SummaryCard';
import {
  IncomeExpenseBarChart, FinancialTrendLineChart, ExpensePieChart,
} from '../components/dashboard/Charts';
import TransactionTable from '../components/transactions/TransactionTable';
import AddTransactionModal from '../components/transactions/AddTransactionModal';
import { formatCurrency } from '../utils/calculations';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function Dashboard() {
  const { totalIncome, totalExpenses, balance } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.25 }}
      className="pt-7 px-7 pb-10 max-w-[1500px] mx-auto"
    >
      <div className="grid grid-cols-1 min-[601px]:grid-cols-2 min-[901px]:grid-cols-3 gap-4 mb-5">
        <SummaryCard title="Total Balance" value={formatCurrency(balance)} trend={8} trendLabel="from last month" icon="💼" delay={0} />
        <SummaryCard title="Total Income" value={formatCurrency(totalIncome)} trend={12} trendLabel="projected growth" icon="📈" delay={0.08} />
        <SummaryCard title="Total Expenses" value={formatCurrency(totalExpenses)} trend={-5} trendLabel="savings identified" icon="💸" delay={0.16} />
      </div>

      <div className="grid grid-cols-1 min-[901px]:grid-cols-3 gap-4 mb-5">
        <IncomeExpenseBarChart />
        <FinancialTrendLineChart />
        <ExpensePieChart />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <p className="label-caps text-xs tracking-[0.16em]">Recent Transactions</p>
          <Link to="/transactions" className="text-xs font-semibold text-(--accent) no-underline tracking-[0.02em] transition-fast hover:opacity-75">
            View All Archive →
          </Link>
        </div>
        <TransactionTable limit={5} />
      </div>

      <motion.button
        whileHover={{ scale: 1.04, boxShadow: '0 0 24px var(--accent-glow-btn)' }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setModalOpen(true)}
        className="fixed bottom-7 right-7 bg-(--accent) text-[#001f24] border-none rounded-(--radius-full) py-[13px] px-[22px] font-bold text-[13px] font-display cursor-pointer tracking-[0.04em] z-20 flex items-center gap-1.5"
        style={{ boxShadow: '0 4px 20px rgba(0,229,255,0.2)' }}
      >
        + Add Transaction
      </motion.button>

      <AddTransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}

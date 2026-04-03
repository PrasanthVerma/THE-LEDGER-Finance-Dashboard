import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../context/FinanceContext';
import TransactionTable from '../components/transactions/TransactionTable';
import AddTransactionModal from '../components/transactions/AddTransactionModal';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function Transactions() {
  const { transactions } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);

  const handleExport = () => {
    const headers = ['Date,Description,Category,Amount,Type'];
    const rows = transactions.map(t =>
      `${t.date},"${t.description}",${t.category},${t.amount},${t.type}`
    );
    const csv = [...headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total', value: transactions.length, color: 'text-(--accent)' },
    { label: 'Income', value: transactions.filter(t => t.type === 'income').length, color: 'text-(--income)' },
    { label: 'Expenses', value: transactions.filter(t => t.type === 'expense').length, color: 'text-(--expense)' },
    { label: 'Categories', value: new Set(transactions.map(t => t.category)).size, color: 'text-[#8b5cf6]' },
  ];

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.25 }}
      className="p-7 max-w-[1500px] mx-auto"
    >
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="label-caps mb-1 tracking-[0.16em]">Finance</p>
          <h2 className="font-display font-extrabold text-[22px] text-(--text-primary) tracking-[-0.01em]">All Transactions</h2>
        </div>
        <div className="flex gap-2.5">
          <button className="btn-ghost" onClick={handleExport}>↓ Export CSV</button>
          <button className="btn-primary" onClick={() => setModalOpen(true)}>+ Add Transaction</button>
        </div>
      </div>

      <div className="grid grid-cols-2 min-[701px]:grid-cols-4 gap-3 mb-5">
        {stats.map(s => (
          <div key={s.label} className="card py-4 px-5">
            <p className={`font-display text-[26px] font-extrabold leading-none ${s.color}`}>{s.value}</p>
            <p className="label-caps mt-1.5 tracking-[0.12em]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <TransactionTable />
      </div>

      <AddTransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </motion.div>
  );
}

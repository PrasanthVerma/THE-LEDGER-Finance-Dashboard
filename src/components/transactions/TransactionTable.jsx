import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Pencil, ArrowUpDown } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { useRole } from '../../context/RoleContext';
import { formatCurrency, formatDate } from '../../utils/calculations';
import { categories } from '../../data/dummyData';
import EditTransactionModal from './EditTransactionModal';

const categoryIcon = {
  Technology: '☁️', Bills: '📋', Food: '🍽️', Travel: '✈️',
  Shopping: '🛍️', Salary: '💼', Freelance: '💻',
  Investment: '📈', Bonus: '🎁', Entertainment: '🎮',
  Health: '🏥', Assets: '🏢', Sales: '💳', Income: '💰',
  Other: '📦', Default: '💰',
};

const selectClasses = "py-[9px] px-3 bg-(--surface-void) border border-(--border-card) rounded-(--radius-md) text-(--text-secondary) text-[13px] outline-none cursor-pointer";

export default function TransactionTable({ limit }) {
  const { transactions, deleteTransaction } = useFinance();
  const { isAdmin } = useRole();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = transactions
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchCat = filterCategory === 'All' || t.category === filterCategory;
      const matchType = filterType === 'All' || t.type === filterType;
      return matchSearch && matchCat && matchType;
    })
    .sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === 'date') { av = new Date(av); bv = new Date(bv); }
      if (sortField === 'amount') { av = Number(av); bv = Number(bv); }
      return sortDir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const displayed = limit ? filtered.slice(0, limit) : filtered;
  const thClass = "text-[10px] font-bold tracking-[0.14em] uppercase text-(--text-secondary) pb-3.5 text-left whitespace-nowrap border-b border-(--border-card) bg-transparent border-none font-body cursor-pointer";

  return (
    <div>
      {!limit && (
        <div className="flex flex-wrap gap-2.5 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-secondary)" />
            <input
              type="text" placeholder="Search transactions..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full py-[9px] pr-3 pl-8 bg-(--surface-void) border border-(--border-card) rounded-(--radius-md) text-(--text-primary) text-[13px] outline-none transition-fast focus:border-(--border-focus)"
            />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={selectClasses}>
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className={selectClasses}>
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px] border-collapse">
          <thead>
            <tr>
              <th className={`${thClass} pl-0`} onClick={() => !limit && toggleSort('date')}>
                Date {!limit && <ArrowUpDown size={10} className="inline ml-0.5 align-middle" />}
              </th>
              <th className={`${thClass} w-[35%]`}>Description</th>
              <th className={thClass}>Category</th>
              <th className={`${thClass} !text-right`} onClick={() => !limit && toggleSort('amount')}>
                Amount {!limit && <ArrowUpDown size={10} className="inline ml-0.5 align-middle" />}
              </th>
              <th className={`${thClass} !text-center`}>Type</th>
              {isAdmin && !limit && <th className={`${thClass} !text-center`}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {displayed.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-(--text-secondary) text-[13px]">
                    No transactions found
                  </td>
                </tr>
              ) : displayed.map((t, i) => (
                <motion.tr
                  key={t.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.025 }}
                  className="border-b border-(--border-card) transition-fast hover:bg-white/[0.02]"
                >
                  <td className="py-4 text-[13px] text-(--text-secondary) align-middle whitespace-nowrap">
                    {formatDate(t.date)}
                  </td>
                  <td className="py-4 px-3 align-middle">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-(--radius-md) bg-(--surface-high) flex items-center justify-center text-sm shrink-0">
                        {categoryIcon[t.category] || categoryIcon.Default}
                      </div>
                      <span className="text-[13px] font-semibold text-(--text-primary)">{t.description}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 align-middle">
                    <span className="badge badge-category">{t.category}</span>
                  </td>
                  <td className="py-4 text-right align-middle">
                    <span className={`text-[13px] font-bold font-display ${t.type === 'income' ? 'text-(--income)' : 'text-(--expense)'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </td>
                  <td className="py-4 px-3 text-center align-middle">
                    <span className={`badge ${t.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                      {t.type === 'income' ? 'Revenue' : 'Expense'}
                    </span>
                  </td>
                  {isAdmin && !limit && (
                    <td className="py-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <motion.button
                          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                          onClick={() => setEditingTransaction(t)} title="Edit"
                          className="bg-transparent border-none text-(--accent) cursor-pointer p-1 rounded-(--radius-sm) transition-fast"
                        >
                          <Pencil size={13} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                          onClick={() => deleteTransaction(t.id)} title="Delete"
                          className="bg-transparent border-none text-(--expense) cursor-pointer p-1 rounded-(--radius-sm) transition-fast"
                        >
                          <Trash2 size={13} />
                        </motion.button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {!limit && (
        <p className="mt-4 text-[11px] text-(--text-secondary)">
          Showing {displayed.length} of {transactions.length} transactions
        </p>
      )}

      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
      />
    </div>
  );
}

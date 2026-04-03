import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { categories } from '../../data/dummyData';

const initialForm = {
  amount: '',
  category: 'Food',
  date: new Date().toISOString().split('T')[0],
  description: '',
  type: 'expense',
};

const inputCls = "w-full py-2.5 px-3 bg-(--surface-void) border border-(--border-card) rounded-(--radius-md) text-(--text-primary) text-[13px] outline-none font-body transition-[border-color] duration-150 ease-linear focus:border-(--border-focus)";

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useFinance();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.description.trim()) e.description = 'Description required';
    if (!form.date) e.date = 'Date required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    addTransaction({ ...form, amount: Number(form.amount) });
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/65 backdrop-blur-[4px]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full max-w-[420px] bg-(--surface-card) border border-(--border-subtle) rounded-(--radius-xl) p-6 shadow-(--shadow-ambient)"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="label-caps text-[10px] tracking-[0.14em]">The Ledger</p>
                <h2 className="font-display font-extrabold text-lg text-(--text-primary) mt-0.5">
                  New Transaction
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-(--surface-high) border-none text-(--text-secondary) cursor-pointer flex items-center justify-center transition-fast"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Type Toggle */}
              <div>
                <label className="label-caps block mb-1.5">Type</label>
                <div className="flex gap-2">
                  {['income', 'expense'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange('type', type)}
                      className={`flex-1 py-[9px] rounded-(--radius-md) text-xs font-bold capitalize cursor-pointer transition-smooth font-body border ${
                        form.type === type
                          ? type === 'income'
                            ? 'border-(--income-border) bg-(--income-bg) text-(--income)'
                            : 'border-(--expense-border) bg-(--expense-bg) text-(--expense)'
                          : 'border-(--border-card) bg-(--surface-void) text-(--text-secondary)'
                      }`}
                    >
                      {type === 'income' ? '+ Revenue' : '− Expense'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="label-caps block mb-1.5">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-secondary) text-[13px] font-semibold">₹</span>
                  <input
                    type="number" placeholder="0.00" step="0.01" min="0"
                    value={form.amount}
                    onChange={e => handleChange('amount', e.target.value)}
                    className={`${inputCls} pl-6`}
                  />
                </div>
                {errors.amount && <p className="text-(--expense) text-[11px] mt-1">{errors.amount}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="label-caps block mb-1.5">Description</label>
                <input
                  type="text" placeholder="What was this for?"
                  value={form.description}
                  onChange={e => handleChange('description', e.target.value)}
                  className={inputCls}
                />
                {errors.description && <p className="text-(--expense) text-[11px] mt-1">{errors.description}</p>}
              </div>

              {/* Category + Date */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="label-caps block mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={e => handleChange('category', e.target.value)}
                    className={inputCls}
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-caps block mb-1.5">Date</label>
                  <input
                    type="date" value={form.date}
                    onChange={e => handleChange('date', e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01, boxShadow: '0 0 20px var(--accent-glow-btn)' }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full mt-1 py-3 text-[13px] tracking-[0.06em]"
              >
                Record Transaction
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

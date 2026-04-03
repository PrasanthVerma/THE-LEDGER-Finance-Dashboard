import { motion } from 'framer-motion';
import { Tag, PiggyBank, ListFilter, TrendingUp } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import {
  getHighestSpendingCategory,
  calculateMonthlySavings,
  formatCurrency,
} from '../../utils/calculations';

export default function InsightsCards() {
  const { transactions } = useFinance();

  const highestCategory = getHighestSpendingCategory(transactions);
  const savings = calculateMonthlySavings(transactions);
  const totalCount = transactions.length;

  const cards = [
    {
      title: 'Top Spending Category',
      value: highestCategory?.name || 'N/A',
      sub: highestCategory ? `${formatCurrency(highestCategory.value)} spent` : 'No data',
      icon: Tag, iconColor: '#f59e0b', iconBg: 'rgba(245, 158, 11, 0.10)',
    },
    {
      title: 'Monthly Savings',
      value: formatCurrency(savings.amount),
      sub: `${savings.rate}% savings rate`,
      icon: PiggyBank, iconColor: 'var(--income)', iconBg: 'var(--income-bg)',
    },
    {
      title: 'Total Transactions',
      value: totalCount.toString(),
      sub: 'Recorded this period',
      icon: ListFilter, iconColor: 'var(--accent)', iconBg: 'var(--accent-glow)',
    },
    {
      title: 'Avg Transaction',
      value: totalCount
        ? formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0) / totalCount)
        : '₹0',
      sub: 'Per transaction average',
      icon: TrendingUp, iconColor: '#8b5cf6', iconBg: 'rgba(139, 92, 246, 0.10)',
    },
  ];

  return (
    <div className="grid grid-cols-1 min-[501px]:grid-cols-2 min-[1001px]:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
          whileHover={{ y: -4 }}
          className="card p-5"
        >
          <div
            className="inline-flex p-2.5 rounded-(--radius-lg) mb-3.5"
            style={{ background: card.iconBg }}
          >
            <card.icon size={18} style={{ color: card.iconColor }} />
          </div>
          <p className="text-xl font-extrabold font-display text-(--text-primary) mb-1">
            {card.value}
          </p>
          <p className="label-caps tracking-[0.12em]">
            {card.title}
          </p>
          <p className="text-xs text-(--text-secondary) mt-1">
            {card.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

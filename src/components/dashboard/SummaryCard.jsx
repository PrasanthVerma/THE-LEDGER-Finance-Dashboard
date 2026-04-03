import { motion } from 'framer-motion';

export default function SummaryCard({ title, value, trend, trendLabel, icon, delay = 0 }) {
  const isPositive = trend > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,229,255,0.07)' }}
      className="card p-6 cursor-default"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <span className="label-caps tracking-[0.14em] pt-0.5">
          {title}
        </span>
        <div className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-lg bg-(--surface-high) border border-(--border-subtle)">
          {icon}
        </div>
      </div>

      {/* Value */}
      <p className="display-value mb-2.5">
        {value}
      </p>

      {/* Trend */}
      <p className={`text-xs font-medium ${isPositive ? 'text-(--income)' : 'text-(--expense)'}`}>
        <span className="font-bold">
          {isPositive ? '+' : ''}{trend}%
        </span>
        {' '}
        <span className="text-(--text-secondary) font-normal">{trendLabel}</span>
      </p>
    </motion.div>
  );
}

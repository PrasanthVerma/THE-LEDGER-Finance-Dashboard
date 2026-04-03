import { motion } from 'framer-motion';
import InsightsCards from '../components/insights/InsightsCards';
import {
  ExpensePieChart, FinancialTrendLineChart, IncomeExpenseBarChart,
} from '../components/dashboard/Charts';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export default function Insights() {
  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.25 }}
      className="p-7 max-w-[1500px] mx-auto"
    >
      <div className="mb-6">
        <p className="label-caps mb-1 tracking-[0.16em]">Analytics</p>
        <h2 className="font-display font-extrabold text-[22px] text-(--text-primary) tracking-[-0.01em]">Financial Insights</h2>
      </div>

      <div className="mb-5">
        <InsightsCards />
      </div>

      <div className="grid grid-cols-1 min-[801px]:grid-cols-2 gap-4 mb-5">
        <ExpensePieChart />
        <FinancialTrendLineChart />
      </div>

      <IncomeExpenseBarChart />
    </motion.div>
  );
}

import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { useFinance } from '../../context/FinanceContext';
import { getCategoryBreakdown, formatCurrency } from '../../utils/calculations';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-(--surface-highest) border border-(--border-subtle) rounded-(--radius-md) py-2 px-3 text-xs text-(--text-primary) shadow-(--shadow-card)">
      {label && <p className="text-(--text-secondary) mb-1 font-semibold">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="font-semibold" style={{ color: p.stroke || p.fill || 'var(--accent)' }}>
          {p.name}: ₹{Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}

function PeakTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-(--surface-highest) border border-(--accent) rounded-(--radius-md) py-1.5 px-3 text-[11px] text-(--accent) font-bold" style={{ boxShadow: '0 0 16px var(--accent-glow)' }}>
      Peak: ₹{Number(payload[0]?.value / 1000).toFixed(1)}k
    </div>
  );
}

function ChartCard({ title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: 'easeOut' }}
      className="card p-5 pb-3"
    >
      <p className="label-caps mb-4 tracking-[0.14em]">{title}</p>
      {children}
    </motion.div>
  );
}

const barData = [
  { month: 'JAN', income: 22000, expense: 12500 },
  { month: 'FEB', income: 25000, expense: 14800 },
  { month: 'MAR', income: 21000, expense: 11200 },
  { month: 'APR', income: 28000, expense: 16000 },
  { month: 'MAY', income: 29800, expense: 15370 },
];

export function IncomeExpenseBarChart() {
  return (
    <ChartCard title="Income vs Expense" delay={0.1}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={barData} barCategoryGap="28%" barGap={2}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="month"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600, letterSpacing: 1 }}
            axisLine={false} tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="expense" name="Expense" fill="#1e3a2e" radius={[3, 3, 0, 0]}>
            {barData.map((_, i) => (
              <Cell key={i} fill={i === barData.length - 1 ? 'var(--income)' : '#2a5a3e'} />
            ))}
          </Bar>
          <Bar dataKey="income" name="Income" fill="var(--accent)" radius={[3, 3, 0, 0]}>
            {barData.map((_, i) => (
              <Cell key={i} fill={i === barData.length - 1 ? 'var(--accent)' : '#1a3d4d'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

const trendData = [
  { q: 'Q1', value: 32000 },
  { q: 'Q2', value: 58000 },
  { q: 'Q3', value: 41000 },
  { q: 'Q4', value: 82000 },
];

export function FinancialTrendLineChart() {
  return (
    <ChartCard title="Financial Trend" delay={0.2}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={trendData}>
          <defs>
            <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="q"
            tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 600 }}
            axisLine={true} tickLine={true}
          />
          <YAxis hide />
          <Tooltip content={<PeakTooltip />} cursor={{ stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '4' }} />
          <Area
            type="monotone"
            dataKey="value"
            name="Revenue"
            stroke="var(--accent)"
            strokeWidth={2.5}
            fill="url(#accentGrad)"
            dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: 'var(--accent)', boxShadow: '0 0 12px var(--accent)' }}
            style={{ filter: 'drop-shadow(0 0 6px var(--accent-glow))' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ExpensePieChart() {
  const { transactions, totalExpenses } = useFinance();
  const breakdown = getCategoryBreakdown(transactions).slice(0, 4);
  const colors = ['var(--accent)', 'var(--income)', '#ff6b8a', '#7c8db5'];
  const legendLabels = breakdown.map((b, i) => ({ name: b.name, color: colors[i] }));

  const expenseLabel = totalExpenses >= 100000
    ? `₹${(totalExpenses / 100000).toFixed(1)}L`
    : `₹${(totalExpenses / 1000).toFixed(1)}k`;

  const renderCustomLabel = ({ cx, cy }) => (
    <>
      <text x={cx} y={cy - 8} textAnchor="middle" dy={4} style={{ fill: 'var(--text-secondary)', fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em' }}>
        TOTAL
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" style={{ fill: 'var(--text-primary)', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
        {expenseLabel}
      </text>
    </>
  );

  return (
    <ChartCard title="Expense Categories" delay={0.3}>
      <div className="flex items-center">
        <ResponsiveContainer width="60%" height={200}>
          <PieChart>
            <Pie
              data={breakdown}
              cx="50%" cy="50%"
              innerRadius={58} outerRadius={80}
              paddingAngle={2} dataKey="value"
              startAngle={90} endAngle={-270}
              labelLine={false}
              label={renderCustomLabel}
            >
              {breakdown.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex-1 flex flex-col gap-2 pl-1">
          {legendLabels.map((l) => (
            <div key={l.name} className="flex items-center gap-2">
              <div className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: l.color }} />
              <span className="text-[11px] text-[var(--text-secondary)] font-medium uppercase tracking-[0.06em]">
                {l.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

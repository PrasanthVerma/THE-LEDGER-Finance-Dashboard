import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BarChart2, Wallet, CreditCard, Settings, CheckCircle2, X,
} from 'lucide-react';
import { useRole } from '../../context/RoleContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analytics', label: 'Analytics', icon: BarChart2 },
  { path: '/assets', label: 'Assets', icon: Wallet },
  { path: '/transactions', label: 'Transactions', icon: CreditCard },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { isAdmin } = useRole();

  const SidebarContent = () => (
    <div className="bg-(--sidebar-bg) w-full h-full flex flex-col border-r border-(--border-card)">
      <div className="pt-7 px-5 pb-6 border-b border-(--border-card)">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-base tracking-[0.05em] text-(--text-primary) uppercase">
              The Ledger
            </h1>
            <p className="label-caps mt-[3px] tracking-[0.15em]">Institutional Grade</p>
          </div>
          <button
            onClick={onClose}
            className="hidden max-md:flex bg-transparent border-none text-(--text-secondary) cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 px-2.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={onClose} end={path === '/'} className="block no-underline mb-0.5">
            {({ isActive }) => (
              <div className={`flex items-center gap-3 py-[11px] px-3.5 rounded-(--radius-md) border-l-[3px] text-[13.5px] font-body tracking-[0.01em] transition-smooth cursor-pointer ${
                isActive
                  ? 'border-l-(--accent) bg-(--sidebar-active-bg) text-(--accent) font-semibold'
                  : 'border-l-transparent bg-transparent text-(--text-secondary) font-normal hover:text-(--text-primary) hover:bg-white/3'
              }`}>
                <Icon size={16} strokeWidth={isActive ? 2.5 : 1.8} />
                <span>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 px-3.5 border-t border-(--border-card)">
        {isAdmin && (
          <div className="flex items-center gap-1.5 mb-2.5">
            <CheckCircle2 size={12} className="text-(--accent)" />
            <span className="label-caps text-(--accent) tracking-[0.14em]">Admin Access</span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[linear-gradient(135deg,var(--accent),var(--income))] flex items-center justify-center font-bold text-[13px] text-[#001f24] shrink-0">
            AL
          </div>
          <div className="min-w-0">
            <p className="font-display font-semibold text-[13px] text-(--text-primary) whitespace-nowrap overflow-hidden text-ellipsis">
              Alex Ledger
            </p>
            <span className="label-caps tracking-[0.12em] text-[9px]">Master Account</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex md:flex-col w-(--sidebar-width) min-w-(--sidebar-width) h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/65 z-40"
            />
            <motion.aside
              initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-(--sidebar-width-mobile) z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

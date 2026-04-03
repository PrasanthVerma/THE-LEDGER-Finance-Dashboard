import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Moon, Sun, Menu, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useRole, ROLES } from '../../context/RoleContext';

export default function Navbar({ onMenuToggle }) {
  const { isDark, toggleTheme } = useTheme();
  const { role, switchRole } = useRole();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const notifications = [
    { id: 1, msg: 'New revenue: Stripe Payout +₹6,500', time: '2m ago', dot: '#00e5ff' },
    { id: 2, msg: 'Monthly report is ready', time: '1h ago', dot: '#00ff88' },
    { id: 3, msg: 'Budget limit: 80% reached', time: '3h ago', dot: '#ffc107' },
  ];

  const dropdownCls = "bg-(--surface-highest) border border-(--border-subtle) rounded-(--radius-lg) shadow-(--shadow-card)";

  return (
    <header className="h-(--navbar-height) bg-(--navbar-bg) border-b border-(--border-card) flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-[12px]">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="hidden max-md:flex bg-transparent border-none text-(--text-secondary) cursor-pointer p-1.5 rounded-(--radius-md)"
        >
          <Menu size={20} />
        </button>
        <h1 className="font-display font-extrabold text-[22px] text-(--text-primary) tracking-[-0.01em]">
          Welcome, Alex!
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center bg-(--surface-void) rounded-full p-1 border border-(--border-card)">
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => !isDark && toggleTheme()}
            className={`w-[30px] h-[30px] flex items-center justify-center rounded-full border-none cursor-pointer transition-smooth ${
              isDark ? 'bg-(--surface-high) text-(--accent)' : 'bg-transparent text-(--text-tertiary)'
            }`}
          >
            <Moon size={14} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => isDark && toggleTheme()}
            className={`w-[30px] h-[30px] flex items-center justify-center rounded-full border-none cursor-pointer transition-smooth ${
              !isDark ? 'bg-(--surface-high) text-[#fbbf24]' : 'bg-transparent text-(--text-tertiary)'
            }`}
          >
            <Sun size={14} />
          </motion.button>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="w-[38px] h-[38px] flex items-center justify-center rounded-full bg-(--surface-void) border border-(--border-card) text-(--text-secondary) cursor-pointer relative transition-smooth"
          >
            <Bell size={16} />
            <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-(--accent) rounded-full border-[1.5px] border-(--navbar-bg)" />
          </motion.button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`${dropdownCls} absolute right-0 top-11 w-[280px] p-2 z-50`}
              >
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-(--text-secondary) py-2 px-3 pb-1.5">
                  Notifications
                </p>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 py-2.5 px-3 rounded-(--radius-md) cursor-pointer transition-fast hover:bg-white/4"
                  >
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: n.dot }} />
                    <div>
                      <p className="text-xs text-(--text-primary) leading-[1.4]">{n.msg}</p>
                      <p className="text-[11px] text-(--text-secondary) mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="w-[38px] h-[38px] rounded-full bg-[linear-gradient(135deg,var(--accent),var(--income))] border-2 border-(--border-subtle) flex items-center justify-center font-extrabold text-xs text-[#001f24] font-display cursor-pointer"
          >
            AL
          </motion.button>

          <AnimatePresence>
            {userOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`${dropdownCls} absolute right-0 top-11 w-[200px] p-2 z-50`}
              >
                <div className="py-2 px-3 pb-2.5 border-b border-(--border-card) mb-1">
                  <p className="text-[13px] font-semibold text-(--text-primary) font-display">Alex Ledger</p>
                  <p className="label-caps text-[9px] mt-0.5">Master Account</p>
                </div>
                <button
                  onClick={switchRole}
                  className="w-full flex items-center gap-2 py-[9px] px-3 rounded-(--radius-md) bg-transparent border-none text-(--accent) text-xs font-semibold cursor-pointer transition-fast hover:bg-(--accent-glow)"
                >
                  <Shield size={13} />
                  Switch to {role === ROLES.ADMIN ? 'User' : 'Admin'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {(notifOpen || userOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setNotifOpen(false); setUserOpen(false); }} />
      )}
    </header>
  );
}

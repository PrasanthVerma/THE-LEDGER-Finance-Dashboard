import { motion } from 'framer-motion';
import { Moon, Sun, Shield, Bell, Lock, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useRole, ROLES } from '../context/RoleContext';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

function SettingRow({ icon: Icon, iconColor, title, description, children }) {
  return (
    <div className="flex items-center justify-between py-[18px] border-b border-(--border-card) gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className="flex items-center justify-center w-[38px] h-[38px] rounded-lg shrink-0"
          style={{ background: `${iconColor}18` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-(--text-primary) font-display">{title}</p>
          <p className="text-xs text-(--text-secondary) mt-0.5">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function ToggleSwitch({ isOn, onToggle, activeColor = 'var(--accent)' }) {
  return (
    <motion.button
      onClick={onToggle}
      className="w-11 h-6 rounded-(--radius-full) border border-(--border-subtle) cursor-pointer relative p-0 transition-colors duration-200"
      style={{ background: isOn ? activeColor : 'var(--surface-high)' }}
    >
      <motion.div
        animate={{ x: isOn ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-[18px] h-[18px] rounded-full bg-white absolute top-[2px]"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
      />
    </motion.button>
  );
}

export default function Settings() {
  const { isDark, toggleTheme } = useTheme();
  const { role, switchRole, isAdmin } = useRole();

  return (
    <motion.div
      variants={pageVariants} initial="initial" animate="animate" exit="exit"
      transition={{ duration: 0.25 }}
      className="p-7 max-w-[800px] mx-auto"
    >
      <div className="mb-6">
        <p className="label-caps mb-1 tracking-[0.16em]">Preferences</p>
        <h2 className="font-display font-extrabold text-[22px] text-(--text-primary) tracking-[-0.01em]">Settings</h2>
      </div>

      <div className="card p-6 mb-5">
        <p className="label-caps mb-4 tracking-[0.14em]">Profile</p>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[linear-gradient(135deg,var(--accent),var(--income))] flex items-center justify-center font-extrabold text-lg text-[#001f24] font-display shrink-0">
            AL
          </div>
          <div>
            <p className="font-display font-bold text-base text-(--text-primary)">Alex Ledger</p>
            <p className="label-caps mt-0.5 tracking-[0.12em]">Master Account</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-(--accent)' : 'bg-(--income)'}`} />
              <span className={`text-xs font-semibold ${isAdmin ? 'text-(--accent)' : 'text-(--income)'}`}>
                {isAdmin ? 'Administrator' : 'Standard User'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6 mb-5">
        <p className="label-caps mb-1 tracking-[0.14em]">Appearance</p>
        <SettingRow
          icon={isDark ? Moon : Sun}
          iconColor={isDark ? 'var(--accent)' : '#fbbf24'}
          title="Dark Mode"
          description={isDark ? 'Dark theme is active' : 'Light theme is active'}
        >
          <ToggleSwitch isOn={isDark} onToggle={toggleTheme} />
        </SettingRow>
      </div>

      <div className="card p-6 mb-5">
        <p className="label-caps mb-1 tracking-[0.14em]">Access & Security</p>
        <SettingRow
          icon={Shield}
          iconColor={isAdmin ? 'var(--accent)' : '#8b5cf6'}
          title="Role"
          description={isAdmin ? 'Full admin privileges (edit/delete)' : 'View and add transactions only'}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-(--text-secondary) font-medium">{role === ROLES.ADMIN ? 'Admin' : 'User'}</span>
            <ToggleSwitch isOn={isAdmin} onToggle={switchRole} />
          </div>
        </SettingRow>
        <SettingRow icon={Lock} iconColor="#f59e0b" title="Two-Factor Authentication" description="Additional login security">
          <ToggleSwitch isOn={false} onToggle={() => {}} />
        </SettingRow>
      </div>

      <div className="card p-6">
        <p className="label-caps mb-1 tracking-[0.14em]">Notifications</p>
        <SettingRow icon={Bell} iconColor="var(--income)" title="Transaction Alerts" description="Get notified for large transactions">
          <ToggleSwitch isOn={true} onToggle={() => {}} />
        </SettingRow>
        <SettingRow icon={Globe} iconColor="var(--accent)" title="Report Notifications" description="Monthly report email summaries">
          <ToggleSwitch isOn={true} onToggle={() => {}} />
        </SettingRow>
      </div>
    </motion.div>
  );
}

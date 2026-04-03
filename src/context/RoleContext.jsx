import { createContext, useContext, useState } from 'react';

const RoleContext = createContext(null);

export const ROLES = { USER: 'user', ADMIN: 'admin' };

export function RoleProvider({ children }) {
  const [role, setRole] = useState(ROLES.ADMIN);

  const switchRole = () => setRole((prev) => (prev === ROLES.ADMIN ? ROLES.USER : ROLES.ADMIN));
  const isAdmin = role === ROLES.ADMIN;

  return (
    <RoleContext.Provider value={{ role, switchRole, isAdmin }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
}

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { dummyTransactions } from '../data/dummyData';
import { calculateIncome, calculateExpenses, calculateBalance, generateId } from '../utils/calculations';

const FinanceContext = createContext(null);

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('transactions');
    try {
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse transactions from localStorage', e);
    }
    return dummyTransactions;
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
      date: transaction.date || new Date().toISOString().split('T')[0],
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTransaction = useCallback((id, updatedData) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
  }, []);

  const totalIncome = calculateIncome(transactions);
  const totalExpenses = calculateExpenses(transactions);
  const balance = calculateBalance(transactions);

  return (
    <FinanceContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, totalIncome, totalExpenses, balance }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
}

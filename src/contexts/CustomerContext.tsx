
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
}

interface CustomerContextType {
  customer: Customer | null;
  isLoading: boolean;
  login: (customer: Customer) => void;
  logout: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('customer');
    if (stored) {
      try {
        setCustomer(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('customer');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (customer: Customer) => {
    setCustomer(customer);
    localStorage.setItem('customer', JSON.stringify(customer));
  };

  const logout = () => {
    setCustomer(null);
    localStorage.removeItem('customer');
  };

  return (
    <CustomerContext.Provider value={{ customer, isLoading, login, logout }}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomer() {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}

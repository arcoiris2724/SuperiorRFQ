import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { QuoteProvider } from '@/components/quote/QuoteContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <QuoteProvider>
        <AppLayout />
      </QuoteProvider>
    </AppProvider>
  );
};

export default Index;

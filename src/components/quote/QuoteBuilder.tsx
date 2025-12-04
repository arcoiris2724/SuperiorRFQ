import React from 'react';
import { useQuote } from './QuoteContext';
import { StepIndicator } from './StepIndicator';
import { LocationStep } from './LocationStep';
import { MaterialStep } from './MaterialStep';
import { SizeStep } from './SizeStep';
import DurationStep from './DurationStep';
import { PaymentStep } from './PaymentStep';

export const QuoteBuilder: React.FC = () => {
  const { quote } = useQuote();

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Build Your Quote</h2>
      <StepIndicator />
      {quote.step === 1 && <LocationStep />}
      {quote.step === 2 && <MaterialStep />}
      {quote.step === 3 && <SizeStep />}
      {quote.step === 4 && <DurationStep />}
      {quote.step === 5 && <PaymentStep />}
    </div>
  );
};

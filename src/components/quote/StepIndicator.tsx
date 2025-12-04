import React from 'react';
import { useQuote } from './QuoteContext';

const steps = [
  { num: 1, label: 'Location' },
  { num: 2, label: 'Material' },
  { num: 3, label: 'Size' },
  { num: 4, label: 'Duration' },
  { num: 5, label: 'Payment' }
];

export const StepIndicator: React.FC = () => {
  const { quote } = useQuote();

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, idx) => (
        <React.Fragment key={step.num}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg
                ${quote.step >= step.num ? 'bg-[#1A8B06]' : 'bg-gray-300'}`}
            >
              {step.num}
            </div>
            <span className={`text-xs mt-1 ${quote.step >= step.num ? 'text-[#1A8B06]' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`w-12 h-1 mx-1 ${quote.step > step.num ? 'bg-[#1A8B06]' : 'bg-gray-300'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

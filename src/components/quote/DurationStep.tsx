import React from 'react';
import { useQuote } from './QuoteContext';
import { rentalPeriods } from '@/data/dumpsterData';
import { Check, Calendar } from 'lucide-react';

const DurationStep: React.FC = () => {
  const { quote, setRentalPeriod, setStep } = useQuote();

  const handleSelect = (id: string) => {
    setRentalPeriod(id);
  };

  const handleContinue = () => {
    if (quote.rentalPeriod) {
      setStep(5);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">How Long Do You Need It?</h2>
        <p className="text-gray-600 mt-2">Select your rental duration</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {rentalPeriods.map((period) => (
          <div
            key={period.id}
            onClick={() => handleSelect(period.id)}
            className={`relative cursor-pointer rounded-xl border-2 p-6 text-center transition-all duration-200 hover:shadow-lg ${
              quote.rentalPeriod === period.id
                ? 'border-[#1A8B06] bg-green-50 shadow-md'
                : 'border-gray-200 hover:border-[#2DB742]'
            }`}
          >
            {quote.rentalPeriod === period.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#1A8B06] rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            <Calendar className={`w-8 h-8 mx-auto mb-3 ${
              quote.rentalPeriod === period.id ? 'text-[#1A8B06]' : 'text-gray-400'
            }`} />
            <h3 className="text-lg font-bold text-gray-900">{period.name}</h3>
            {period.priceModifier > 0 ? (
              <p className="text-sm text-orange-600 font-medium mt-2">+${period.priceModifier}</p>
            ) : period.priceModifier < 0 ? (
              <p className="text-sm text-[#1A8B06] font-medium mt-2">-${Math.abs(period.priceModifier)}</p>
            ) : (
              <p className="text-sm text-[#1A8B06] font-medium mt-2">Standard</p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-green-50 rounded-lg p-4 max-w-2xl mx-auto mt-6">
        <p className="text-sm text-[#106203]">
          <strong>Need it longer?</strong> Additional days can be added at $25/day. Contact us for extended rentals.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button onClick={() => setStep(3)} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Back</button>
        <button onClick={handleContinue} disabled={!quote.rentalPeriod} className="px-8 py-2 bg-[#1A8B06] text-white rounded-lg hover:bg-[#106203] disabled:opacity-50">
          Continue
        </button>
      </div>
    </div>
  );
};

export default DurationStep;

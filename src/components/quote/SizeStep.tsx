import React from 'react';
import { useQuote } from './QuoteContext';
import { materials } from '@/data/dumpsterData';
import { pricing } from '@/data/pricingData';

const sizeImages: Record<string, string> = {
  '5': 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763250702_cd6b1483.png',
  '10': 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763250702_cd6b1483.png',
  '15': 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763275846_e510c5fc.png',
  '20': 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763296038_5ec263dc.png',
  '30': 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763313403_24c24105.png',
  '40': 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763333996_c92ac688.png',
};

export const SizeStep: React.FC = () => {
  const { setSize, quote, prevStep, setStep } = useQuote();

  const selectedMaterial = materials.find(m => m.id === quote.material);
  const availableSizes = selectedMaterial?.sizes.filter(s => 
    quote.location && quote.material && pricing[quote.location]?.[quote.material]?.[s]
  ) || [];

  const getCashPrice = (size: string): number | null => {
    if (!quote.location || !quote.material) return null;
    return pricing[quote.location]?.[quote.material]?.[size]?.cash || null;
  };

  const handleSelect = (size: string) => {
    setSize(size);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Select Dumpster Size</h3>
      <p className="text-sm text-gray-500 mb-6">
        Material: <span className="font-medium text-[#106203]">{selectedMaterial?.name}</span>
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableSizes.map((size) => {
          const price = getCashPrice(size);
          return (
            <button
              key={size}
              onClick={() => handleSelect(size)}
              className={`p-4 border-2 rounded-lg text-center transition-all hover:border-[#2DB742] hover:shadow-md
                ${quote.size === size ? 'border-[#1A8B06] bg-green-50' : 'border-gray-200 bg-white'}`}
            >
              <img 
                src={sizeImages[size]} 
                alt={`${size} yard dumpster`}
                className="w-full h-20 object-contain mb-2"
              />
              <div className="text-2xl font-bold text-[#1A8B06]">{size}</div>
              <div className="text-xs text-gray-500 mb-1">Yard</div>
              {price && (
                <div className="text-base font-semibold text-[#106203]">
                  ${price.toFixed(0)}
                  <span className="text-xs text-gray-400 block">cash price</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={prevStep} className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
          Back
        </button>
        {quote.size && (
          <button onClick={() => setStep(4)} className="px-8 py-2 bg-[#1A8B06] text-white rounded-lg hover:bg-[#106203]">
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

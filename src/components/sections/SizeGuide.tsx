import React, { useState } from 'react';
import { dumpsterSizes } from '@/data/dumpsterSizeData';
import { largeDumpsterSizes } from '@/data/dumpsterSizesLarge';
import DumpsterCard from './DumpsterCard';
import { Button } from '@/components/ui/button';
import { Check, Package, ArrowRight } from 'lucide-react';

interface SizeGuideProps {
  onGetQuote: () => void;
}

const allSizes = [...dumpsterSizes, ...largeDumpsterSizes];

const SizeGuide: React.FC<SizeGuideProps> = ({ onGetQuote }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const selected = allSizes.find(s => s.id === selectedSize);

  return (
    <section id="sizes" className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Size Guide</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Find Your Perfect Dumpster Size
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Click on any dumpster to see detailed capacity information and what fits inside
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {allSizes.map((size) => (
            <DumpsterCard
              key={size.id}
              dumpster={size}
              isSelected={selectedSize === size.id}
              onSelect={setSelectedSize}
            />
          ))}
        </div>

        {selected && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-10 animate-in fade-in duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              What Fits in a {selected.name}?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="font-semibold text-gray-700 mb-2">Capacity Examples:</p>
                <ul className="space-y-2">
                  {selected.fitsItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-2">Best Used For:</p>
                <ul className="space-y-2">
                  {selected.idealFor.map((use, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />{use}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Button size="lg" onClick={onGetQuote} className="bg-green-600 hover:bg-green-700 px-8">
            Get Your Quote <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SizeGuide;

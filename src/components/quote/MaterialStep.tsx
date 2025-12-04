import React from 'react';
import { useQuote } from './QuoteContext';
import { materials } from '@/data/dumpsterData';
import { pricing } from '@/data/pricingData';
import { Hammer, Square, Mountain, Box, Circle, TreePine, Layers } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'construction-demo': <Hammer className="w-8 h-8 text-[#1A8B06]" />,
  'clean-concrete': <Square className="w-8 h-8 text-[#1A8B06]" />,
  'clean-dirt': <Mountain className="w-8 h-8 text-[#1A8B06]" />,
  'clean-brick': <Box className="w-8 h-8 text-[#1A8B06]" />,
  'asphalt': <Circle className="w-8 h-8 text-[#1A8B06]" />,
  'trees-brush': <TreePine className="w-8 h-8 text-[#1A8B06]" />,
  'mixed': <Layers className="w-8 h-8 text-[#1A8B06]" />
};

export const MaterialStep: React.FC = () => {
  const { setMaterial, quote, prevStep } = useQuote();

  const availableMaterials = materials.filter(m => 
    quote.location && pricing[quote.location]?.[m.id]
  );

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Select Material Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableMaterials.map((mat) => (
          <button
            key={mat.id}
            onClick={() => setMaterial(mat.id)}
            className={`p-4 border-2 rounded-lg text-left transition-all hover:border-[#2DB742] hover:shadow-md
              ${quote.material === mat.id ? 'border-[#1A8B06] bg-green-50' : 'border-gray-200 bg-white'}`}
          >
            <div className="mb-2">{iconMap[mat.id]}</div>
            <div className="font-semibold text-[#106203]">{mat.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              Sizes: {mat.sizes.join(', ')} yd
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={prevStep}
        className="mt-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
};

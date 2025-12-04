import React from 'react';
import { DumpsterSize } from '@/data/dumpsterSizeData';
import { Truck, Scale, Ruler, Package } from 'lucide-react';

interface DumpsterCardProps {
  dumpster: DumpsterSize;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const DumpsterCard: React.FC<DumpsterCardProps> = ({ dumpster, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(dumpster.id)}
      className={`bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300 border-2 ${
        isSelected ? 'border-green-500 shadow-xl ring-2 ring-green-200' : 'border-gray-100 hover:border-green-300 hover:shadow-lg'
      }`}
    >
      <div className="relative">
        <img src={dumpster.image} alt={dumpster.name} className="w-full h-36 object-contain mb-3" />
        <span className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">
          {dumpster.yards} YD
        </span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">{dumpster.name}</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Ruler className="w-4 h-4 text-green-600" />
          <span>{dumpster.dimensions}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Scale className="w-4 h-4 text-green-600" />
          <span>{dumpster.weightLimit}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Truck className="w-4 h-4 text-green-600" />
          <span>{dumpster.truckLoads}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t">
        <p className="text-xs text-gray-500 mb-1">Ideal for:</p>
        <ul className="text-xs text-gray-700 space-y-1">
          {dumpster.idealFor.slice(0, 2).map((use, i) => (
            <li key={i} className="flex items-start gap-1">
              <span className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
              {use}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 pt-3 border-t flex justify-between items-center">
        <span className="text-xs text-gray-500">Starting at</span>
        <span className="text-xl font-bold text-green-600">${dumpster.basePrice}</span>
      </div>
    </div>
  );
};

export default DumpsterCard;

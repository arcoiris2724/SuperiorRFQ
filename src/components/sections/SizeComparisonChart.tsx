import React from 'react';
import { dumpsterSizes } from '@/data/dumpsterSizeData';
import { largeDumpsterSizes } from '@/data/dumpsterSizesLarge';
import { Check } from 'lucide-react';

const allSizes = [...dumpsterSizes, ...largeDumpsterSizes];

const SizeComparisonChart: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Compare</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">Dumpster Size Comparison</h2>
          <p className="text-gray-600">Compare all sizes at a glance to find your perfect match</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-4 text-left font-semibold">Size</th>
                <th className="p-4 text-left font-semibold">Dimensions</th>
                <th className="p-4 text-left font-semibold">Weight Limit</th>
                <th className="p-4 text-left font-semibold">Truck Loads</th>
                <th className="p-4 text-left font-semibold">Starting Price</th>
              </tr>
            </thead>
            <tbody>
              {allSizes.map((size, index) => (
                <tr key={size.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={size.image} alt={size.name} className="w-16 h-10 object-contain" />
                      <span className="font-bold text-green-700">{size.yards} Yard</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{size.dimensions}</td>
                  <td className="p-4 text-gray-600">{size.weightLimit}</td>
                  <td className="p-4 text-gray-600">{size.truckLoads}</td>
                  <td className="p-4 font-bold text-green-600">${size.basePrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Small Projects (5-10 Yard)</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Bathroom remodel</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Garage cleanout</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Small landscaping</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Medium Projects (15-20 Yard)</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Kitchen renovation</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Roof replacement</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Estate cleanout</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">Large Projects (30-40 Yard)</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />New construction</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Major demolition</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" />Commercial projects</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SizeComparisonChart;

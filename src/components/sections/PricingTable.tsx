import React from 'react';
import { materials } from '@/data/dumpsterData';
import { pricing } from '@/data/pricingData';

export const PricingTable: React.FC = () => {
  const rows: { material: string; size: string; ns: any; er: any }[] = [];
  const sizes = ['5', '10', '15', '20', '30', '40'];
  
  materials.forEach(mat => {
    sizes.forEach(size => {
      const ns = pricing['nassau-suffolk']?.[mat.id]?.[size];
      const er = pricing['east-riverhead']?.[mat.id]?.[size];
      if (ns || er) {
        rows.push({ material: mat.name, size: `${size} yd`, ns, er });
      }
    });
  });

  return (
    <section id="pricing" className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Complete Pricing Guide</h2>
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full bg-white text-sm">
            <thead>
              <tr className="bg-slate-800 text-white">
                <th className="p-3 text-left">Material</th>
                <th className="p-3">Size</th>
                <th className="p-3 bg-[#1A8B06]">Suffolk/Nassau Cash</th>
                <th className="p-3 bg-[#1A8B06]">Debit</th>
                <th className="p-3 bg-[#1A8B06]">Credit</th>
                <th className="p-3 bg-orange-500">E. Riverhead Cash</th>
                <th className="p-3 bg-orange-500">Debit</th>
                <th className="p-3 bg-orange-500">Credit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-3 text-[#1A8B06] font-medium">{row.material}</td>
                  <td className="p-3 text-center font-medium">{row.size}</td>
                  <td className="p-3 text-center">{row.ns?.cash ? `$${row.ns.cash.toFixed(2)}` : '-'}</td>
                  <td className="p-3 text-center">{row.ns?.debit ? `$${row.ns.debit.toFixed(2)}` : '-'}</td>
                  <td className="p-3 text-center">{row.ns?.credit ? `$${row.ns.credit.toFixed(2)}` : '-'}</td>
                  <td className="p-3 text-center">{row.er?.cash ? `$${row.er.cash.toFixed(2)}` : '-'}</td>
                  <td className="p-3 text-center">{row.er?.debit ? `$${row.er.debit.toFixed(2)}` : '-'}</td>
                  <td className="p-3 text-center">{row.er?.credit ? `$${row.er.credit.toFixed(2)}` : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

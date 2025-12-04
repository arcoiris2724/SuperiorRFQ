import React from 'react';
import { Check } from 'lucide-react';

export const ServiceAreas: React.FC = () => {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Our Service Areas</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border-l-4 border-[#1A8B06] bg-white p-6 rounded-r-lg shadow-md">
            <h3 className="text-xl font-bold text-[#1A8B06] mb-3">Nassau & Suffolk Counties</h3>
            <p className="text-slate-600 mb-4">
              Our primary service area covering most of Long Island. We provide fast, reliable dumpster rental services throughout Nassau and Suffolk Counties.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-[#1A8B06] mr-2" />
                Same-day or next-day delivery available
              </li>
              <li className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-[#1A8B06] mr-2" />
                Competitive pricing for all material types
              </li>
              <li className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-[#1A8B06] mr-2" />
                Flexible rental periods
              </li>
            </ul>
          </div>
          <div className="border-l-4 border-orange-500 bg-white p-6 rounded-r-lg shadow-md">
            <h3 className="text-xl font-bold text-orange-600 mb-3">East of Riverhead</h3>
            <p className="text-slate-600 mb-4">
              Extended service area for customers in the eastern part of Long Island. We're proud to serve the entire island with reliable waste management.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-orange-500 mr-2" />
                Extended coverage area
              </li>
              <li className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-orange-500 mr-2" />
                Transparent pricing with no surprises
              </li>
              <li className="flex items-center text-sm text-slate-700">
                <Check className="w-4 h-4 text-orange-500 mr-2" />
                Professional service guaranteed
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

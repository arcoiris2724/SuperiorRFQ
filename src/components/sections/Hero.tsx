import React from 'react';
import { logoUrl } from '@/data/dumpsterData';
import { Phone, CheckCircle, Gift, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
  onGetQuote: () => void;
  onShowOffer?: () => void;
}

// Featured dumpster image - 20 yard with person for scale
const heroImage = 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763296038_5ec263dc.png';

export const Hero: React.FC<HeroProps> = ({ onGetQuote, onShowOffer }) => {
  return (
    <section className="bg-slate-800 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <img 
              src={logoUrl} 
              alt="Superior Waste Services of New York" 
              className="h-24 md:h-32 mx-auto md:mx-0 mb-6 rounded-lg shadow-2xl"
            />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: 'Manrope, sans-serif' }}>
              Instant Dumpster Rental Quotes
            </h1>
            <p className="text-lg text-slate-300 mb-2">
              Serving Nassau & Suffolk Counties on Long Island
            </p>
            <p className="text-slate-400 mb-6 max-w-lg">
              Get transparent, instant pricing for all your waste disposal needs. No hidden fees. No surprises.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              {['Same Day Delivery', 'Transparent Pricing', 'All Materials'].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                  <CheckCircle className="w-4 h-4 text-[#2DB742]" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button
                onClick={onGetQuote}
                className="px-6 py-3 bg-[#1A8B06] hover:bg-[#106203] text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
              >
                Get Your Free Quote Now
              </button>
              <a
                href="tel:631-580-5800"
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                631-580-5800
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
              <button 
                onClick={onShowOffer}
                className="inline-flex items-center gap-2 text-[#2DB742] hover:text-[#3ed854] text-sm font-medium transition-colors cursor-pointer group"
              >
                <Gift className="w-4 h-4" />
                <span className="underline underline-offset-2">First time customer? Get $1 off per yard!</span>
              </button>
              <Link 
                to="/customer/login"
                className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
              >
                <Users className="w-4 h-4" />
                <span className="underline underline-offset-2">Refer a friend & earn $25!</span>
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <img 
              src={heroImage} 
              alt="20 Yard Dumpster with size reference" 
              className="w-full max-w-md mx-auto drop-shadow-2xl"
            />
            <p className="text-center text-slate-400 text-sm mt-2">
              20 Yard Dumpster - Our Most Popular Size
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

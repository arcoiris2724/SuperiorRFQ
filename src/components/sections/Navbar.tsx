import React, { useState } from 'react';
import { Phone, Menu, X, FileSearch, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoUrl, contactInfo } from '@/data/dumpsterData';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onGetQuote: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onGetQuote }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <img src={logoUrl} alt="Superior Waste Services" className="h-14 rounded" />
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-slate-300 hover:text-[#2DB742] font-medium">Home</a>
            <a href="#sizes" className="text-slate-300 hover:text-[#2DB742] font-medium">Sizes</a>
            <a href="#pricing" className="text-slate-300 hover:text-[#2DB742] font-medium">Pricing</a>
            <a href="#faq" className="text-slate-300 hover:text-[#2DB742] font-medium">FAQ</a>
            <a href="#contact" className="text-slate-300 hover:text-[#2DB742] font-medium">Contact</a>
            <Link to="/track" className="text-slate-300 hover:text-[#2DB742] font-medium flex items-center gap-1">
              <FileSearch className="w-4 h-4" /> Track
            </Link>
            <Link to="/customer/login" className="text-slate-300 hover:text-[#2DB742] font-medium flex items-center gap-1">
              <User className="w-4 h-4" /> My Account
            </Link>
          </div>

          
          <div className="hidden md:flex items-center gap-4">
            <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2 text-[#2DB742] font-semibold">
              <Phone className="w-4 h-4" />
              {contactInfo.phone}
            </a>
            <Button onClick={onGetQuote} className="bg-[#1A8B06] hover:bg-[#106203]">
              Get Quote
            </Button>
          </div>
          
          <button className="md:hidden p-2 text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col gap-4">
              <a href="#" onClick={() => setMobileOpen(false)} className="text-slate-300 font-medium py-2">Home</a>
              <a href="#sizes" onClick={() => setMobileOpen(false)} className="text-slate-300 font-medium py-2">Sizes</a>
              <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-slate-300 font-medium py-2">Pricing</a>
              <a href="#faq" onClick={() => setMobileOpen(false)} className="text-slate-300 font-medium py-2">FAQ</a>
              <a href="#contact" onClick={() => setMobileOpen(false)} className="text-slate-300 font-medium py-2">Contact</a>
              <Link to="/track" onClick={() => setMobileOpen(false)} className="text-slate-300 font-medium py-2 flex items-center gap-2">
                <FileSearch className="w-4 h-4" /> Track Quote
              </Link>
              <Link to="/customer/login" onClick={() => setMobileOpen(false)} className="text-slate-300 font-medium py-2 flex items-center gap-2">
                <User className="w-4 h-4" /> My Account
              </Link>
              <Button onClick={() => { onGetQuote(); setMobileOpen(false); }} className="w-full bg-[#1A8B06]">
                Get Quote
              </Button>
            </div>
          </div>
        )}


      </div>
    </nav>
  );
};

export default Navbar;

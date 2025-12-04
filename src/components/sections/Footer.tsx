import React from 'react';
import { Phone, Mail, MapPin, Clock, FileSearch, User, Gift } from 'lucide-react';
import { logoUrl, contactInfo } from '@/data/dumpsterData';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-white py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Referral Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 mb-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Gift className="w-10 h-10" />
            <div>
              <h3 className="text-xl font-bold">Refer a Friend, Earn $25!</h3>
              <p className="text-white/90">Give your friends $15 off their first rental. You get $25 in credits!</p>
            </div>
            <Link to="/customer/login" className="px-6 py-2 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap">
              Get Your Code
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={logoUrl} alt="Superior Waste Services" className="h-20 mb-4 rounded" />
            <p className="text-slate-400 text-sm">
              Long Island's trusted dumpster rental service. Serving Nassau and Suffolk Counties with reliable waste management solutions.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#2DB742]">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300">
                <Phone className="w-5 h-5 mr-3 text-[#2DB742]" />
                <a href={`tel:${contactInfo.phone}`} className="hover:text-[#2DB742]">{contactInfo.phone}</a>
              </li>
              <li className="flex items-center text-slate-300">
                <Mail className="w-5 h-5 mr-3 text-[#2DB742]" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#2DB742]">{contactInfo.email}</a>
              </li>
              <li className="flex items-start text-slate-300">
                <MapPin className="w-5 h-5 mr-3 text-[#2DB742] mt-0.5" />
                <span>{contactInfo.address}</span>
              </li>
              <li className="flex items-center text-slate-300">
                <Clock className="w-5 h-5 mr-3 text-[#2DB742]" />
                <span>Mon-Fri: 7AM - 5PM | Sat: 7AM - 2PM</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#2DB742]">Quick Links</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><a href="#sizes" className="hover:text-[#2DB742]">Dumpster Sizes</a></li>
              <li><a href="#pricing" className="hover:text-[#2DB742]">Pricing</a></li>
              <li><a href="#faq" className="hover:text-[#2DB742]">FAQ</a></li>
              <li>
                <Link to="/track" className="hover:text-[#2DB742] flex items-center gap-2">
                  <FileSearch className="w-4 h-4" /> Track Your Quote
                </Link>
              </li>
              <li>
                <Link to="/customer/login" className="hover:text-[#2DB742] flex items-center gap-2">
                  <User className="w-4 h-4" /> Customer Portal
                </Link>
              </li>
              <li>
                <Link to="/customer/login" className="hover:text-[#2DB742] flex items-center gap-2">
                  <Gift className="w-4 h-4" /> Referral Program
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-lg mb-4 text-[#2DB742]">Service Areas</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Nassau County</li>
              <li>Suffolk County</li>
              <li>East of Riverhead</li>
              <li>Serving LI for 40+ years</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Superior Waste Services of New York. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

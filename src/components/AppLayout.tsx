import React, { useRef, useState } from 'react';
import Navbar from './sections/Navbar';
import { Hero } from './sections/Hero';
import { QuoteBuilder } from './quote/QuoteBuilder';
import { ServiceAreas } from './sections/ServiceAreas';
import SizeGuide from './sections/SizeGuide';
import SizeComparisonChart from './sections/SizeComparisonChart';
import { PricingTable } from './sections/PricingTable';
import FAQ from './sections/FAQ';
import { Footer } from './sections/Footer';
import WhatsAppButton from './WhatsAppButton';
import { FirstTimeOfferModal } from './sections/FirstTimeOfferModal';

const AppLayout: React.FC = () => {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const scrollToQuote = () => {
    quoteRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShowOffer = () => {
    setShowOfferModal(true);
  };

  const handleCloseOffer = () => {
    setShowOfferModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar onGetQuote={scrollToQuote} />
      <Hero onGetQuote={scrollToQuote} onShowOffer={handleShowOffer} />
      
      <section ref={quoteRef} className="py-12 px-4 bg-slate-100">
        <QuoteBuilder />
      </section>

      <SizeGuide onGetQuote={scrollToQuote} />
      <SizeComparisonChart />
      <ServiceAreas />
      <PricingTable />
      <FAQ />
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
      
      {/* First Time Customer Offer Modal - Auto-show on first visit */}
      <FirstTimeOfferModal onClaimOffer={scrollToQuote} />
      
      {/* First Time Customer Offer Modal - Manual trigger */}
      {showOfferModal && (
        <FirstTimeOfferModal 
          onClaimOffer={scrollToQuote} 
          isVisible={showOfferModal}
          onClose={handleCloseOffer}
        />
      )}
    </div>
  );
};

export default AppLayout;

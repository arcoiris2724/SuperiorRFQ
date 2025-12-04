import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';

interface FirstTimeOfferModalProps {
  onClaimOffer: () => void;
  isVisible?: boolean;
  onClose?: () => void;
}

const discounts = [
  { size: 5, discount: 5 },
  { size: 10, discount: 10 },
  { size: 15, discount: 15 },
  { size: 20, discount: 20 },
  { size: 30, discount: 30 },
  { size: 40, discount: 40 },
];

export const FirstTimeOfferModal: React.FC<FirstTimeOfferModalProps> = ({ 
  onClaimOffer, 
  isVisible: externalVisible,
  onClose: externalClose 
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = externalVisible !== undefined;
  const isOpen = isControlled ? externalVisible : internalOpen;

  useEffect(() => {
    if (!isControlled) {
      const hasSeenOffer = localStorage.getItem('hasSeenFirstTimeOffer');
      if (!hasSeenOffer) {
        const timer = setTimeout(() => setInternalOpen(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isControlled]);

  const handleClose = () => {
    if (isControlled && externalClose) {
      externalClose();
    } else {
      setInternalOpen(false);
      localStorage.setItem('hasSeenFirstTimeOffer', 'true');
    }
  };

  const handleClaim = () => {
    handleClose();
    onClaimOffer();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-[#e8f5e9] rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Gift className="w-10 h-10 text-[#1A8B06]" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            First time customers:
          </h2>
          <p className="text-gray-800 mb-4">
            Please add your "<span className="italic font-semibold">1st Time</span>" note in the RFQ Form.
          </p>

          <button
            onClick={handleClaim}
            className="w-full py-4 px-6 bg-[#1A8B06] hover:bg-[#106203] text-white text-2xl md:text-3xl font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 mb-3"
          >
            CLAIM NOW
          </button>

          <p className="text-[#1A8B06] font-semibold mb-4">
            $1 Off Per Yard For 1st Time Rentals!
          </p>

          <div className="space-y-1">
            {discounts.map(({ size, discount }) => (
              <p key={size} className="text-gray-800 font-medium">
                <span className="font-bold">${discount} Off</span> {size} Yard Dumpster
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeOfferModal;

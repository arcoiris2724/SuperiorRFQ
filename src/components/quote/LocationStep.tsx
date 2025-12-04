import React from 'react';
import { useQuote } from './QuoteContext';
import { locations } from '@/data/dumpsterData';
import { MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AddressAutocomplete from './AddressAutocomplete';
import MapPreview from './MapPreview';

export const LocationStep: React.FC = () => {
  const { setLocation, quote, setDeliveryAddress, setStep } = useQuote();

  const handleContinue = () => {
    if (quote.location && quote.deliveryAddress) {
      setStep(2);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Select Your Service Area</h3>
        <p className="text-gray-600 mt-1">Choose your region and enter the delivery address</p>
      </div>

      <div className="space-y-4">
        {locations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => setLocation(loc.id)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:border-[#2DB742] hover:shadow-md flex items-center gap-4
              ${quote.location === loc.id ? 'border-[#1A8B06] bg-green-50' : 'border-gray-200 bg-white'}`}
          >
            <MapPin className="w-7 h-7 text-[#1A8B06]" />
            <div className="flex-1">
              <div className="font-semibold text-[#106203]">{loc.name}</div>
              <div className="text-sm text-gray-500">{loc.description}</div>
            </div>
            {quote.location === loc.id && <CheckCircle2 className="w-6 h-6 text-[#1A8B06]" />}
          </button>
        ))}
      </div>

      {quote.location && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <Label className="text-base font-medium mb-3 block">Delivery Address</Label>
          <AddressAutocomplete
            value={quote.deliveryAddress?.address || ''}
            onChange={setDeliveryAddress}
            placeholder="Enter your delivery address..."
          />
          
          {quote.deliveryAddress && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-green-700 mb-3">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Address confirmed</span>
              </div>
              <MapPreview
                lat={quote.deliveryAddress.lat}
                lng={quote.deliveryAddress.lng}
                address={quote.deliveryAddress.address}
                height="180px"
              />
            </div>
          )}

          {!quote.deliveryAddress && (
            <div className="mt-3 flex items-start gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span className="text-sm">Please enter and select your delivery address from the suggestions</span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button 
          onClick={handleContinue} 
          disabled={!quote.location || !quote.deliveryAddress}
          size="lg"
          className="px-8"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

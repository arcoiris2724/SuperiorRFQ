import React, { useState } from 'react';
import { useQuote } from './QuoteContext';
import { locations, materials, rentalPeriods, paymentMethods } from '@/data/dumpsterData';
import { Button } from '@/components/ui/button';
import { Check, Truck, Calendar, MapPin, User, Package, CreditCard, Loader2, Camera, Navigation, Receipt } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MapPreview from './MapPreview';
import { formatTaxRate } from '@/utils/taxCalculator';

const ReviewStep: React.FC = () => {
  const { quote, getTaxInfo, getDurationModifier, setStep, resetQuote } = useQuote();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const size = quote.size;
  const material = materials.find(m => m.id === quote.material);
  const period = rentalPeriods.find(p => p.id === quote.rentalPeriod);
  const location = locations.find(l => l.id === quote.location);
  const payment = paymentMethods.find(p => p.id === quote.payment);
  const taxInfo = getTaxInfo();
  const durationMod = getDurationModifier();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('send-quote-email', {
        body: {
          quote: {
            name: quote.name, email: quote.email, phone: quote.phone,
            location: location?.name || quote.location,
            material: material?.name || quote.material,
            size: quote.size, rentalPeriod: period?.name || quote.rentalPeriod,
            payment: payment?.name || quote.payment, photos: quote.photos,
            deliveryAddress: quote.deliveryAddress?.address,
            deliveryLat: quote.deliveryAddress?.lat,
            deliveryLng: quote.deliveryAddress?.lng,
            addressComponents: quote.deliveryAddress?.components
          },
          subtotal: taxInfo?.subtotal,
          taxAmount: taxInfo?.tax,
          taxRate: taxInfo?.taxRate,
          county: taxInfo?.countyName,
          total: taxInfo?.total
        }
      });
      if (fnError) throw fnError;
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quote Submitted!</h2>
        <p className="text-gray-600 mb-2">Thank you, {quote.name}!</p>
        <p className="text-gray-600 mb-8">A confirmation email has been sent to {quote.email}.</p>
        <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto mb-8">
          <p className="text-sm text-gray-500">Your Quote Total (incl. tax)</p>
          <p className="text-4xl font-bold text-blue-600">${taxInfo?.total.toFixed(2)}</p>
        </div>
        <Button onClick={resetQuote} size="lg">Start New Quote</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Review Your Quote</h2>
        <p className="text-gray-600 mt-2">Please confirm all details are correct</p>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border rounded-xl divide-y">
          <div className="p-4 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div className="flex-1"><p className="text-sm text-gray-500">Service Area</p><p className="font-semibold">{location?.name}</p></div>
          </div>
          {quote.deliveryAddress && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Navigation className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-500">Delivery Address</p>
              </div>
              <p className="font-semibold mb-3">{quote.deliveryAddress.address}</p>
              <MapPreview lat={quote.deliveryAddress.lat} lng={quote.deliveryAddress.lng} address={quote.deliveryAddress.address} height="150px" />
            </div>
          )}
          <div className="p-4 flex items-center gap-4">
            <Truck className="w-5 h-5 text-blue-600" />
            <div className="flex-1"><p className="text-sm text-gray-500">Material</p><p className="font-semibold">{material?.name}</p></div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <Package className="w-5 h-5 text-blue-600" />
            <div className="flex-1"><p className="text-sm text-gray-500">Size</p><p className="font-semibold">{size} Yard</p></div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div className="flex-1"><p className="text-sm text-gray-500">Rental</p><p className="font-semibold">{period?.name}</p></div>
            {durationMod !== 0 && <p className="font-bold text-sm">{durationMod > 0 ? '+' : ''}${durationMod}</p>}
          </div>
          <div className="p-4 flex items-center gap-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <div className="flex-1"><p className="text-sm text-gray-500">Payment</p><p className="font-semibold">{payment?.name}</p></div>
          </div>
          <div className="p-4 flex items-center gap-4">
            <User className="w-5 h-5 text-blue-600" />
            <div className="flex-1"><p className="text-sm text-gray-500">Contact</p><p className="font-semibold">{quote.name}</p><p className="text-sm text-gray-500">{quote.email} | {quote.phone}</p></div>
          </div>
          {quote.photos.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3"><Camera className="w-5 h-5 text-blue-600" /><p className="text-sm text-gray-500">Photos ({quote.photos.length})</p></div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {quote.photos.map((url, i) => (<img key={i} src={url} alt={`Photo ${i+1}`} className="w-full aspect-square object-cover rounded-lg border" />))}
              </div>
            </div>
          )}
        </div>
        
        {/* Tax Breakdown */}
        {taxInfo && (
          <div className="bg-blue-600 text-white rounded-xl p-6 mt-6">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-blue-100">
                <span>Subtotal:</span>
                <span>${taxInfo.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-blue-100">
                <span className="flex items-center gap-1">
                  <Receipt className="w-4 h-4" />
                  Sales Tax ({formatTaxRate(taxInfo.taxRate)}):
                </span>
                <span>${taxInfo.tax.toFixed(2)}</span>
              </div>
              <div className="text-xs text-blue-200">{taxInfo.countyName}</div>
            </div>
            <div className="border-t border-blue-400 pt-3 flex justify-between items-center">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-3xl font-bold">${taxInfo.total.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setStep(5)} size="lg">Back</Button>
        <Button onClick={handleSubmit} disabled={loading} size="lg" className="px-8 bg-green-600 hover:bg-green-700">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : 'Submit Quote Request'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewStep;


import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, FileText, ArrowLeft, Navigation, MapPin, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { StatusTimeline } from '@/components/tracking/StatusTimeline';
import { Button } from '@/components/ui/button';
import DeliveryMap from '@/components/customer/DeliveryMap';

interface QuoteData {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_email: string;
  location: string;
  material: string;
  size: number;
  rental_period: string;
  payment_method: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  pickup_date?: string;
  driver_en_route?: boolean;
  pickup_driver_en_route?: boolean;
  delivery_lat?: number;
  delivery_lng?: number;
  address?: string;
}

interface TrackingData {
  tracking: boolean;
  location: { latitude: number; longitude: number; eta_minutes: number; distance_meters: number } | null;
  destination: { lat: number; lng: number; address: string } | null;
}

export default function TrackQuote() {
  const [searchParams] = useSearchParams();
  const [refNumber, setRefNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [tracking, setTracking] = useState<TrackingData | null>(null);

  const searchQuote = async (ref: string) => {
    if (!ref.trim()) return;
    setLoading(true);
    setError(null);
    setQuote(null);
    setTracking(null);

    try {
      const { data, error: dbError } = await supabase.from('quotes').select('*').eq('reference_number', ref.trim().toUpperCase()).single();
      if (dbError || !data) { setError('Quote not found.'); return; }
      setQuote(data);
      if (data.driver_en_route || data.pickup_driver_en_route) fetchTracking(data.id);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async (quoteId: string) => {
    try {
      const { data } = await supabase.functions.invoke('driver-location', { body: { action: 'get-location', quoteId } });
      if (data) setTracking(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) { setRefNumber(refParam.toUpperCase()); searchQuote(refParam); }
  }, [searchParams]);

  useEffect(() => {
    if (!quote?.id || (!quote.driver_en_route && !quote.pickup_driver_en_route)) return;
    const interval = setInterval(() => fetchTracking(quote.id), 15000);
    return () => clearInterval(interval);
  }, [quote]);

  const handleSearch = async (e: React.FormEvent) => { e.preventDefault(); searchQuote(refNumber); };
  const isEnRoute = quote?.driver_en_route || quote?.pickup_driver_en_route;
  const formatETA = (mins: number) => mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h ${mins%60}m`;
  const formatDist = (m: number) => m < 1000 ? `${m}m` : `${(m/1609.34).toFixed(1)} mi`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-[#1A8B06] text-white py-4">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white w-fit"><ArrowLeft className="w-4 h-4" /> Back to Home</Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1A8B06] rounded-full flex items-center justify-center mx-auto mb-4"><FileText className="w-8 h-8 text-white" /></div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Quote</h1>
            <p className="text-gray-600">Enter your reference number to check status and track delivery.</p>
          </div>

          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input type="text" value={refNumber} onChange={(e) => setRefNumber(e.target.value.toUpperCase())} placeholder="Enter reference number (e.g., SW-XXXXX-XXXX)"
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg focus:border-[#2DB742] focus:outline-none font-mono text-lg" disabled={loading} />
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
              <button type="submit" disabled={loading || !refNumber.trim()} className="px-6 py-3 bg-[#1A8B06] text-white font-semibold rounded-lg hover:bg-[#106203] disabled:opacity-50 flex items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
              </button>
            </div>
          </form>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 mb-6"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}

          {quote && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-[#1A8B06] text-white p-6">
                <p className="text-sm opacity-80">Reference Number</p>
                <p className="text-2xl font-mono font-bold">{quote.reference_number}</p>
                {isEnRoute && <div className="mt-2 flex items-center gap-2 bg-white/20 rounded-lg px-3 py-1 w-fit"><Navigation className="w-4 h-4 animate-pulse" /><span className="text-sm font-medium">Driver En Route - Live Tracking</span></div>}
              </div>

              {isEnRoute && tracking?.tracking && (
                <div className="p-4 bg-green-50 border-b">
                  <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2"><Navigation className="w-5 h-5" /> Live Tracking</h3>
                  <DeliveryMap driverLocation={tracking.location} destination={tracking.destination} />
                  {tracking.location && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <Clock className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-orange-600">{tracking.location.eta_minutes ? formatETA(tracking.location.eta_minutes) : '--'}</p>
                        <p className="text-xs text-gray-500">ETA</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                        <MapPin className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <p className="text-xl font-bold text-blue-600">{tracking.location.distance_meters ? formatDist(tracking.location.distance_meters) : '--'}</p>
                        <p className="text-xs text-gray-500">Away</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Quote Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  <div><span className="text-gray-500">Name:</span><p className="font-medium">{quote.customer_name}</p></div>
                  <div><span className="text-gray-500">Size:</span><p className="font-medium">{quote.size} Yard</p></div>
                  <div><span className="text-gray-500">Material:</span><p className="font-medium">{quote.material}</p></div>
                  <div><span className="text-gray-500">Duration:</span><p className="font-medium">{quote.rental_period}</p></div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <span className="text-gray-600">Estimated Total</span>
                  <p className="text-3xl font-bold text-[#1A8B06]">${quote.total_price?.toFixed(2)}</p>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Status Timeline</h3>
                <StatusTimeline currentStatus={quote.status} createdAt={quote.created_at} updatedAt={quote.updated_at} deliveryDate={quote.delivery_date} deliveryTimeSlot={quote.delivery_time_slot} pickupDate={quote.pickup_date} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, Clock, Navigation, RefreshCw, X } from 'lucide-react';
import DeliveryMap from './DeliveryMap';

interface DeliveryTrackerProps {
  quoteId: string;
  referenceNumber: string;
  onClose: () => void;
}

interface TrackingData {
  tracking: boolean;
  location: { latitude: number; longitude: number; eta_minutes: number; distance_meters: number; updated_at: string } | null;
  destination: { lat: number; lng: number; address: string } | null;
  quote: { status: string; driver_en_route: boolean; pickup_driver_en_route: boolean };
}

export default function DeliveryTracker({ quoteId, referenceNumber, onClose }: DeliveryTrackerProps) {
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchLocation = async () => {
    try {
      const { data } = await supabase.functions.invoke('driver-location', {
        body: { action: 'get-location', quoteId }
      });
      if (data) {
        setTracking(data);
        setLastUpdate(new Date());
      }
    } catch (err) {
      console.error('Tracking error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(fetchLocation, 15000);
    return () => clearInterval(interval);
  }, [quoteId]);

  const formatETA = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1609.34).toFixed(1)} mi`;
  };

  const isEnRoute = tracking?.quote?.driver_en_route || tracking?.quote?.pickup_driver_en_route;
  const isPickup = tracking?.quote?.pickup_driver_en_route;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-auto">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-500" />
              {isPickup ? 'Pickup' : 'Delivery'} Tracking
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
          <p className="text-sm text-gray-500">Order: {referenceNumber}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
            </div>
          ) : !tracking?.tracking ? (
            <div className="text-center py-8">
              <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Driver Not En Route</h3>
              <p className="text-gray-500 text-sm">Tracking will be available once the driver starts the {isPickup ? 'pickup' : 'delivery'}.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Driver En Route
                </Badge>
                <Button variant="ghost" size="sm" onClick={fetchLocation}>
                  <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                </Button>
              </div>

              <DeliveryMap driverLocation={tracking.location} destination={tracking.destination} />

              {tracking.location && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <Clock className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-orange-600">
                      {tracking.location.eta_minutes ? formatETA(tracking.location.eta_minutes) : '--'}
                    </p>
                    <p className="text-xs text-gray-500">Estimated Arrival</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <Navigation className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-blue-600">
                      {tracking.location.distance_meters ? formatDistance(tracking.location.distance_meters) : '--'}
                    </p>
                    <p className="text-xs text-gray-500">Distance Away</p>
                  </div>
                </div>
              )}

              {tracking.destination && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Destination</p>
                      <p className="text-xs text-gray-500">{tracking.destination.address}</p>
                    </div>
                  </div>
                </div>
              )}

              {lastUpdate && (
                <p className="text-xs text-gray-400 text-center">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Navigation, MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GPSTrackerProps {
  activeQuoteId: string | null;
  driverId: string;
  isEnRoute: boolean;
}

export default function GPSTracker({ activeQuoteId, driverId, isEnRoute }: GPSTrackerProps) {
  const [tracking, setTracking] = useState(false);
  const [lastLocation, setLastLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendLocation = useCallback(async (position: GeolocationPosition) => {
    const { latitude, longitude, heading, speed, accuracy } = position.coords;
    setLastLocation({ lat: latitude, lng: longitude });
    setError(null);

    try {
      await supabase.functions.invoke('driver-location', {
        body: {
          action: 'update-location',
          driverId,
          quoteId: activeQuoteId,
          latitude,
          longitude,
          heading: heading || 0,
          speed: speed || 0,
          accuracy: accuracy || 0
        }
      });
    } catch (err) {
      console.error('Failed to send location:', err);
    }
  }, [driverId, activeQuoteId]);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      toast({ title: 'Error', description: 'GPS not supported on this device', variant: 'destructive' });
      return;
    }

    const id = navigator.geolocation.watchPosition(
      sendLocation,
      (err) => {
        setError(err.message);
        toast({ title: 'GPS Error', description: err.message, variant: 'destructive' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    setWatchId(id);
    setTracking(true);
    toast({ title: 'GPS Active', description: 'Location tracking enabled' });
  }, [sendLocation]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setTracking(false);
    toast({ title: 'GPS Stopped', description: 'Location tracking disabled' });
  }, [watchId]);

  useEffect(() => {
    if (isEnRoute && !tracking) {
      startTracking();
    } else if (!isEnRoute && tracking) {
      stopTracking();
    }
  }, [isEnRoute]);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${tracking ? 'bg-green-100' : 'bg-gray-100'}`}>
      {tracking ? (
        <>
          <div className="relative">
            <Navigation className="w-5 h-5 text-green-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-green-700">GPS Active</p>
            {lastLocation && (
              <p className="text-xs text-green-600 truncate">
                {lastLocation.lat.toFixed(4)}, {lastLocation.lng.toFixed(4)}
              </p>
            )}
          </div>
          <Button size="sm" variant="ghost" onClick={stopTracking} className="text-green-700 hover:text-green-800 hover:bg-green-200">
            Stop
          </Button>
        </>
      ) : (
        <>
          <MapPin className="w-5 h-5 text-gray-500" />
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600">GPS Inactive</p>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>
          <Button size="sm" variant="ghost" onClick={startTracking} className="text-gray-600 hover:text-gray-800">
            Start
          </Button>
        </>
      )}
    </div>
  );
}

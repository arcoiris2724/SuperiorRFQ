
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { LogOut, RefreshCw, CheckCircle, Truck, Navigation, Trash2 } from 'lucide-react';
import DriverStopCard from '@/components/driver/DriverStopCard';
import PickupStopCard from '@/components/driver/PickupStopCard';
import PhotoCapture from '@/components/driver/PhotoCapture';
import PickupPhotoCapture from '@/components/driver/PickupPhotoCapture';
import GPSTracker from '@/components/driver/GPSTracker';
import { toast } from '@/hooks/use-toast';

interface Stop {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_time_slot?: string;
  pickup_time_slot?: string;
  size: string;
  material: string;
  notes?: string;
  delivery_completed?: boolean;
  pickup_completed?: boolean;
  driver_en_route?: boolean;
  pickup_driver_en_route?: boolean;
}

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState<'deliveries' | 'pickups'>('deliveries');
  const [deliveries, setDeliveries] = useState<Stop[]>([]);
  const [pickups, setPickups] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStop, setActiveStop] = useState<Stop | null>(null);
  const [showDeliveryPhoto, setShowDeliveryPhoto] = useState(false);
  const [showPickupPhoto, setShowPickupPhoto] = useState(false);
  const [driverId] = useState(() => localStorage.getItem('driverToken') || 'driver-1');
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    const token = localStorage.getItem('driverToken');
    if (!token) { navigate('/driver'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [deliveryRes, pickupRes] = await Promise.all([
      supabase.functions.invoke('driver-routes', { body: { action: 'get-today' } }),
      supabase.functions.invoke('driver-routes', { body: { action: 'get-pickups' } })
    ]);
    if (deliveryRes.data?.deliveries) setDeliveries(deliveryRes.data.deliveries);
    if (pickupRes.data?.pickups) setPickups(pickupRes.data.pickups);
    setLoading(false);
  };

  const handleNavigate = (stop: Stop) => {
    if (stop.delivery_lat && stop.delivery_lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.delivery_lat},${stop.delivery_lng}&travelmode=driving`, '_blank');
    }
  };

  const handleStartDelivery = async (stop: Stop) => {
    await supabase.functions.invoke('driver-routes', { body: { action: 'start-delivery', quoteId: stop.id } });
    setDeliveries(prev => prev.map(d => d.id === stop.id ? { ...d, driver_en_route: true } : d));
    toast({ title: 'Customer Notified', description: 'SMS sent - dumpster on the way!' });
  };

  const handleStartPickup = async (stop: Stop) => {
    await supabase.functions.invoke('driver-routes', { body: { action: 'start-pickup', quoteId: stop.id } });
    setPickups(prev => prev.map(p => p.id === stop.id ? { ...p, pickup_driver_en_route: true } : p));
    toast({ title: 'Customer Notified', description: 'SMS sent - pickup on the way!' });
  };

  const handleCompleteDelivery = async (photoUrl: string, notes: string) => {
    if (!activeStop) return;
    await supabase.functions.invoke('driver-routes', {
      body: { action: 'complete-delivery', quoteId: activeStop.id, proofPhoto: photoUrl, driverNotes: notes }
    });
    toast({ title: 'Delivery Completed!', description: `${activeStop.reference_number} marked as delivered` });
    setShowDeliveryPhoto(false); setActiveStop(null); fetchData();
  };

  const handleCompletePickup = async (photoUrl: string, notes: string) => {
    if (!activeStop) return;
    await supabase.functions.invoke('driver-routes', {
      body: { action: 'complete-pickup', quoteId: activeStop.id, proofPhoto: photoUrl, driverNotes: notes }
    });
    toast({ title: 'Pickup Completed!', description: `${activeStop.reference_number} picked up` });
    setShowPickupPhoto(false); setActiveStop(null); fetchData();
  };

  const handleLogout = () => { localStorage.removeItem('driverToken'); navigate('/driver'); };

  const pendingDeliveries = deliveries.filter(d => !d.delivery_completed);
  const completedDeliveries = deliveries.filter(d => d.delivery_completed);
  const pendingPickups = pickups.filter(p => !p.pickup_completed);
  const completedPickups = pickups.filter(p => p.pickup_completed);

  const activeEnRouteStop = [...pendingDeliveries, ...pendingPickups].find(s => s.driver_en_route || s.pickup_driver_en_route);
  const isEnRoute = !!activeEnRouteStop;

  const openFullRoute = (stops: Stop[]) => {
    const validStops = stops.filter(s => s.delivery_lat && s.delivery_lng);
    if (validStops.length === 0) return;
    const waypoints = validStops.slice(0, -1).map(s => `${s.delivery_lat},${s.delivery_lng}`).join('|');
    const dest = validStops[validStops.length - 1];
    let url = `https://www.google.com/maps/dir/?api=1&destination=${dest.delivery_lat},${dest.delivery_lng}&travelmode=driving`;
    if (waypoints) url += `&waypoints=${waypoints}`;
    window.open(url, '_blank');
  };

  const isDeliveries = activeTab === 'deliveries';
  const pending = isDeliveries ? pendingDeliveries : pendingPickups;
  const completed = isDeliveries ? completedDeliveries.length : completedPickups.length;

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {showDeliveryPhoto && activeStop && (
        <PhotoCapture deliveryRef={activeStop.reference_number} onComplete={handleCompleteDelivery}
          onCancel={() => { setShowDeliveryPhoto(false); setActiveStop(null); }} />
      )}
      {showPickupPhoto && activeStop && (
        <PickupPhotoCapture pickupRef={activeStop.reference_number} onComplete={handleCompletePickup}
          onCancel={() => { setShowPickupPhoto(false); setActiveStop(null); }} />
      )}

      <header className={`text-white p-4 sticky top-0 z-40 shadow-lg ${isDeliveries ? 'bg-[#1A8B06]' : 'bg-orange-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDeliveries ? <Truck className="w-8 h-8" /> : <Trash2 className="w-8 h-8" />}
            <div>
              <h1 className="font-bold text-lg">{isDeliveries ? "Today's Deliveries" : "Today's Pickups"}</h1>
              <p className="text-sm text-white/80">{today}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={fetchData} className="text-white hover:bg-white/20">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleLogout} className="text-white hover:bg-white/20">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="bg-white border-b px-4 py-2">
        <GPSTracker activeQuoteId={activeEnRouteStop?.id || null} driverId={driverId} isEnRoute={isEnRoute} />
      </div>

      <div className="bg-white border-b">
        <div className="grid grid-cols-2">
          <button onClick={() => setActiveTab('deliveries')}
            className={`py-4 text-center font-bold transition-all ${activeTab === 'deliveries' ? 'bg-[#1A8B06] text-white' : 'bg-gray-100 text-gray-600'}`}>
            <Truck className="w-5 h-5 mx-auto mb-1" /> Deliveries ({pendingDeliveries.length})
          </button>
          <button onClick={() => setActiveTab('pickups')}
            className={`py-4 text-center font-bold transition-all ${activeTab === 'pickups' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
            <Trash2 className="w-5 h-5 mx-auto mb-1" /> Pickups ({pendingPickups.length})
          </button>
        </div>
      </div>

      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className={`text-3xl font-bold ${isDeliveries ? 'text-[#1A8B06]' : 'text-orange-500'}`}>{pending.length}</p>
              <p className="text-xs text-gray-500">Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{completed}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
          {pending.length > 0 && (
            <Button onClick={() => openFullRoute(pending)} className="bg-blue-600 hover:bg-blue-700">
              <Navigation className="w-4 h-4 mr-2" /> Full Route
            </Button>
          )}
        </div>
      </div>

      <main className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className={`w-8 h-8 animate-spin mx-auto ${isDeliveries ? 'text-[#1A8B06]' : 'text-orange-500'}`} />
          </div>
        ) : pending.length === 0 && completed === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold">No {isDeliveries ? 'Deliveries' : 'Pickups'} Today</h2>
          </div>
        ) : isDeliveries ? (
          <>
            {pendingDeliveries.map((d, i) => (
              <DriverStopCard key={d.id} delivery={d} index={i} onNavigate={handleNavigate}
                onComplete={(s) => { setActiveStop(s); setShowDeliveryPhoto(true); }}
                onStartDelivery={handleStartDelivery} isActive={i === 0} />
            ))}
            {completedDeliveries.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">COMPLETED ({completedDeliveries.length})</h3>
                {completedDeliveries.map((d, i) => (
                  <DriverStopCard key={d.id} delivery={d} index={i} onNavigate={handleNavigate} onComplete={() => {}} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {pendingPickups.map((p, i) => (
              <PickupStopCard key={p.id} pickup={p} index={i} onNavigate={handleNavigate}
                onComplete={(s) => { setActiveStop(s); setShowPickupPhoto(true); }}
                onStartPickup={handleStartPickup} isActive={i === 0} />
            ))}
            {completedPickups.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">COMPLETED ({completedPickups.length})</h3>
                {completedPickups.map((p, i) => (
                  <PickupStopCard key={p.id} pickup={p} index={i} onNavigate={handleNavigate} onComplete={() => {}} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

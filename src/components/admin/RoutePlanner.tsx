
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Route, Sparkles, Navigation, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import RouteStopCard from './RouteStopCard';
import RouteDirections from './RouteDirections';
import RoutePlannerMap from './RoutePlannerMap';

interface DeliveryStop {
  id: string;
  reference_number: string;
  customer_name: string;
  delivery_address: string;
  delivery_time_slot: string;
  delivery_date: string;
  size: string;
  delivery_lat: number;
  delivery_lng: number;
}

interface RouteLeg {
  stopIndex: number;
  startAddress: string;
  endAddress: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  steps: any[];
}

interface Props {
  scheduled: any[];
}


export default function RoutePlanner({ scheduled }: Props) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stops, setStops] = useState<DeliveryStop[]>([]);
  const [activeStopId, setActiveStopId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [routeData, setRouteData] = useState<{ legs: RouteLeg[]; totalDistance: any; totalDuration: any } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [startAddress, setStartAddress] = useState('');

  useEffect(() => {
    const dayStops = scheduled.filter(s => {
      if (!s.delivery_lat || !s.delivery_lng || !s.delivery_date) return false;
      const stopDate = s.delivery_date.split('T')[0];
      return stopDate === selectedDate;
    });
    setStops(dayStops as DeliveryStop[]);
    setRouteData(null);
  }, [selectedDate, scheduled]);


  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    const newStops = [...stops];
    const [removed] = newStops.splice(draggedIndex, 1);
    newStops.splice(dropIndex, 0, removed);
    setStops(newStops);
    setDraggedIndex(null);
    setRouteData(null);
  };

  const getDirections = async () => {
    if (stops.length < 1) return;
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('route-optimizer', {
        body: { action: 'get-directions', stops: stops.map(s => ({ id: s.id, lat: s.delivery_lat, lng: s.delivery_lng, address: s.delivery_address })) }
      });
      if (data?.success) setRouteData({ legs: data.legs, totalDistance: data.totalDistance, totalDuration: data.totalDuration });
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const optimizeRoute = async () => {
    if (stops.length < 2) return;
    setOptimizing(true);
    try {
      const { data } = await supabase.functions.invoke('route-optimizer', {
        body: { action: 'optimize-order', stops: stops.map(s => ({ id: s.id, lat: s.delivery_lat, lng: s.delivery_lng })) }
      });
      if (data?.optimizedStops) {
        const optimized = data.optimizedOrder.map((i: number) => stops[i]);
        setStops(optimized);
        setRouteData(null);
      }
    } catch (err) { console.error(err); }
    setOptimizing(false);
  };

  const navigateDate = (dir: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + dir);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const getETA = (legIndex: number) => {
    if (!routeData || legIndex < 0) return undefined;
    let totalSeconds = 0;
    for (let i = 0; i <= legIndex; i++) totalSeconds += routeData.legs[i]?.duration.value || 0;
    const startTime = new Date(); startTime.setHours(8, 0, 0, 0);
    startTime.setSeconds(startTime.getSeconds() + totalSeconds);
    return startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-[#1A8B06]" />
          <h2 className="font-semibold">Route Planner</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate(-1)}><ChevronLeft className="w-4 h-4" /></Button>
          <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-40" />
          <Button variant="outline" size="sm" onClick={() => navigateDate(1)}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      {stops.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No deliveries with coordinates scheduled for this date</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-0">
          <div className="p-4 border-r max-h-[600px] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">{stops.length} stops • Drag to reorder</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={optimizeRoute} disabled={optimizing || stops.length < 2}>
                  {optimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span className="ml-1 hidden sm:inline">Optimize</span>
                </Button>
                <Button size="sm" onClick={getDirections} disabled={loading} className="bg-[#1A8B06] hover:bg-[#106203]">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  <span className="ml-1 hidden sm:inline">Get Route</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              {stops.map((stop, i) => (
                <RouteStopCard key={stop.id} stop={stop} index={i} isActive={stop.id === activeStopId}
                  eta={routeData ? getETA(i) : undefined} duration={routeData?.legs[i]?.duration.text}
                  onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} onClick={() => setActiveStopId(stop.id)} />
              ))}
            </div>
            {routeData && (
              <div className="mt-4 space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#1A8B06]">Total Route</span>
                    <span className="text-gray-600">{routeData.totalDistance.text} • {routeData.totalDuration.text}</span>
                  </div>
                </div>
                <a 
                  href={`https://www.google.com/maps/dir/${stops.map(s => `${s.delivery_lat},${s.delivery_lng}`).join('/')}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full gap-2">
                    <Navigation className="w-4 h-4" />Open Full Route in Google Maps
                  </Button>
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="h-[300px] p-4">
              <RoutePlannerMap stops={stops} activeStopId={activeStopId} />
            </div>
            {routeData && (
              <div className="p-4 border-t max-h-[300px] overflow-y-auto">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Navigation className="w-4 h-4" />Turn-by-Turn Directions</h3>
                <RouteDirections legs={routeData.legs} stopNames={stops.map(s => s.customer_name)} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

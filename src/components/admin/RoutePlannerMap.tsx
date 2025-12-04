
import { useEffect, useRef } from 'react';

interface Stop {
  id: string;
  customer_name: string;
  delivery_lat: number;
  delivery_lng: number;
}

interface Props {
  stops: Stop[];
  activeStopId: string | null;
  bounds?: { northeast: { lat: number; lng: number }; southwest: { lat: number; lng: number } };
}

export default function RoutePlannerMap({ stops, activeStopId, bounds }: Props) {
  if (stops.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No stops with coordinates</p>
      </div>
    );
  }

  // Calculate center and bounds
  const validStops = stops.filter(s => s.delivery_lat && s.delivery_lng);
  if (validStops.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No stops with valid coordinates</p>
      </div>
    );
  }

  const lats = validStops.map(s => s.delivery_lat);
  const lngs = validStops.map(s => s.delivery_lng);
  const minLat = Math.min(...lats) - 0.01;
  const maxLat = Math.max(...lats) + 0.01;
  const minLng = Math.min(...lngs) - 0.01;
  const maxLng = Math.max(...lngs) + 0.01;

  const bbox = `${minLng},${minLat},${maxLng},${maxLat}`;
  
  // Create markers string for OSM
  const markers = validStops.map((s, i) => `${s.delivery_lat},${s.delivery_lng}`).join('|');
  const activeStop = validStops.find(s => s.id === activeStopId);
  
  const centerLat = activeStop?.delivery_lat || (minLat + maxLat) / 2;
  const centerLng = activeStop?.delivery_lng || (minLng + maxLng) / 2;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${centerLat}%2C${centerLng}`;

  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden border">
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        title="Route Map"
      />
      {/* Overlay with stop markers */}
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur rounded-lg p-2 shadow-lg max-h-48 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-600 mb-1">Stops ({validStops.length})</p>
        {validStops.map((stop, i) => (
          <div 
            key={stop.id} 
            className={`flex items-center gap-2 text-xs py-1 ${stop.id === activeStopId ? 'text-[#1A8B06] font-semibold' : 'text-gray-600'}`}
          >
            <span className="w-5 h-5 rounded-full bg-[#1A8B06] text-white flex items-center justify-center text-[10px] font-bold">
              {i + 1}
            </span>
            <span className="truncate max-w-[120px]">{stop.customer_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

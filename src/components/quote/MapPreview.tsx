import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  lat: number;
  lng: number;
  address: string;
  height?: string;
}

const MapPreview: React.FC<Props> = ({ lat, lng, address, height = '200px' }) => {
  // Using OpenStreetMap static image (free, no API key needed)
  const zoom = 16;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005}%2C${lat - 0.003}%2C${lng + 0.005}%2C${lat + 0.003}&layer=mapnik&marker=${lat}%2C${lng}`;
  const fullMapUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="relative" style={{ height }}>
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          title="Delivery Location Map"
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <a
            href={fullMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-4 h-4 text-gray-600" />
          </a>
        </div>
      </div>
      <div className="p-3 bg-gray-50 border-t">
        <div className="flex items-start gap-2 mb-2">
          <MapPin className="w-5 h-5 text-[#1A8B06] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700 line-clamp-2">{address}</p>
        </div>
        <div className="flex gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
          </a>
          <a href={fullMapUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              View Larger
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MapPreview;

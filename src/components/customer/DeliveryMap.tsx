
import { useEffect, useRef, useState } from 'react';

interface DeliveryMapProps {
  driverLocation: { latitude: number; longitude: number } | null;
  destination: { lat: number; lng: number; address: string } | null;
}

export default function DeliveryMap({ driverLocation, destination }: DeliveryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || !driverLocation || !destination) return;

    const driverLat = driverLocation.latitude;
    const driverLng = driverLocation.longitude;
    const destLat = destination.lat;
    const destLng = destination.lng;

    const centerLat = (driverLat + destLat) / 2;
    const centerLng = (driverLng + destLng) / 2;

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${centerLat},${centerLng}&zoom=12&size=600x400&maptype=roadmap&markers=color:green%7Clabel:D%7C${driverLat},${driverLng}&markers=color:red%7Clabel:H%7C${destLat},${destLng}&path=color:0x4285F4%7Cweight:4%7C${driverLat},${driverLng}%7C${destLat},${destLng}&key=`;

    setMapLoaded(true);
  }, [driverLocation, destination]);

  if (!driverLocation || !destination) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Waiting for driver location...</p>
      </div>
    );
  }

  const driverLat = driverLocation.latitude;
  const driverLng = driverLocation.longitude;
  const destLat = destination.lat;
  const destLng = destination.lng;
  const centerLat = (driverLat + destLat) / 2;
  const centerLng = (driverLng + destLng) / 2;

  return (
    <div ref={mapRef} className="w-full h-64 md:h-80 rounded-lg overflow-hidden relative bg-gray-100">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${driverLat},${driverLng}&destination=${destLat},${destLng}&mode=driving`}
        allowFullScreen
      />
      <div className="absolute bottom-2 left-2 right-2 flex gap-2 text-xs">
        <div className="bg-green-500 text-white px-2 py-1 rounded flex items-center gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          Driver
        </div>
        <div className="bg-red-500 text-white px-2 py-1 rounded">
          Your Location
        </div>
      </div>
    </div>
  );
}

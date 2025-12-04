import { MapPin, Navigation, Phone, Clock, Package, CheckCircle, Camera, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface Delivery {
  id: string;
  reference_number: string;
  customer_name: string;
  customer_phone: string;
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_time_slot?: string;
  size: string;
  material: string;
  notes?: string;
  delivery_completed?: boolean;
  driver_en_route?: boolean;
}

interface Props {
  delivery: Delivery;
  index: number;
  onNavigate: (delivery: Delivery) => void;
  onComplete: (delivery: Delivery) => void;
  onStartDelivery?: (delivery: Delivery) => Promise<void>;
  isActive?: boolean;
}

export default function DriverStopCard({ delivery, index, onNavigate, onComplete, onStartDelivery, isActive }: Props) {
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(delivery.driver_en_route);
  
  const timeSlotLabels: Record<string, string> = {
    'morning': '8AM - 12PM', 'afternoon': '12PM - 4PM', 'evening': '4PM - 7PM'
  };

  const handleNotify = async () => {
    if (onStartDelivery) {
      setNotifying(true);
      await onStartDelivery(delivery);
      setNotified(true);
      setNotifying(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-5 border-2 transition-all ${
      delivery.delivery_completed ? 'border-green-500 bg-green-50' : 
      isActive ? 'border-[#1A8B06] ring-2 ring-[#1A8B06]/20' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg ${
            delivery.delivery_completed ? 'bg-green-500' : 'bg-[#1A8B06]'
          }`}>
            {delivery.delivery_completed ? <CheckCircle className="w-6 h-6" /> : index + 1}
          </div>
          <div>
            <p className="font-bold text-lg">{delivery.customer_name}</p>
            <p className="text-sm text-gray-500 font-mono">{delivery.reference_number}</p>
          </div>
        </div>
        <Badge className={delivery.delivery_completed ? 'bg-green-100 text-green-800' : notified ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}>
          {delivery.delivery_completed ? 'Completed' : notified ? 'En Route' : 'Pending'}
        </Badge>
      </div>

      <div className="space-y-3 mb-5">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <MapPin className="w-5 h-5 text-[#1A8B06] mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">{delivery.delivery_address || 'Address not specified'}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">{timeSlotLabels[delivery.delivery_time_slot || ''] || 'TBD'}</span>
          </div>
          <div className="flex-1 flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
            <Package className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium">{delivery.size}</span>
          </div>
        </div>
        {delivery.notes && (
          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-xl border border-yellow-200">
            <strong>Notes:</strong> {delivery.notes}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a href={`tel:${delivery.customer_phone}`} className="block">
          <Button variant="outline" className="w-full h-12 text-sm font-semibold"><Phone className="w-4 h-4 mr-2" /> Call</Button>
        </a>
        <Button onClick={() => onNavigate(delivery)} className="h-12 text-sm font-semibold bg-blue-600 hover:bg-blue-700" disabled={!delivery.delivery_lat}>
          <Navigation className="w-4 h-4 mr-2" /> Navigate
        </Button>
      </div>

      {!delivery.delivery_completed && (
        <div className="grid grid-cols-2 gap-3 mt-3">
          <Button onClick={handleNotify} disabled={notified || notifying} variant={notified ? 'outline' : 'default'}
            className={`h-14 text-sm font-bold ${notified ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-500 hover:bg-orange-600'}`}>
            {notifying ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Send className="w-5 h-5 mr-2" />}
            {notified ? 'Notified' : 'On My Way'}
          </Button>
          <Button onClick={() => onComplete(delivery)} className="h-14 text-sm font-bold bg-[#1A8B06] hover:bg-[#106203]">
            <Camera className="w-5 h-5 mr-2" /> Complete
          </Button>
        </div>
      )}
    </div>
  );
}

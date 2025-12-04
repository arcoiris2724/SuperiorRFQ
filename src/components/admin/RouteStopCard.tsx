
import { GripVertical, MapPin, Clock, User, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Stop {
  id: string;
  reference_number: string;
  customer_name: string;
  delivery_address: string;
  delivery_time_slot: string;
  size: string;
  delivery_lat: number;
  delivery_lng: number;
}

interface Props {
  stop: Stop;
  index: number;
  isActive: boolean;
  eta?: string;
  duration?: string;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onClick: () => void;
}

export default function RouteStopCard({ stop, index, isActive, eta, duration, onDragStart, onDragOver, onDrop, onClick }: Props) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onClick={onClick}
      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
        isActive ? 'border-[#1A8B06] bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1">
          <GripVertical className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1A8B06] text-white font-bold text-sm shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{stop.customer_name}</span>
            <Badge variant="outline" className="text-xs">{stop.reference_number}</Badge>
          </div>
          <p className="text-xs text-gray-600 flex items-center gap-1 mb-1">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{stop.delivery_address || 'No address'}</span>
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Package className="w-3 h-3" />{stop.size} Yard</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{stop.delivery_time_slot?.split(' - ')[0] || 'TBD'}</span>
          </div>
          {(eta || duration) && (
            <div className="mt-2 pt-2 border-t flex items-center gap-3 text-xs">
              {eta && <span className="text-[#1A8B06] font-medium">ETA: {eta}</span>}
              {duration && <span className="text-gray-500">Drive: {duration}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

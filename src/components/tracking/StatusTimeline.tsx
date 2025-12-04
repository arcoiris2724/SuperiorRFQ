import React from 'react';
import { Clock, Eye, CheckCircle, Calendar, Package, Check, Truck } from 'lucide-react';

interface StatusTimelineProps {
  currentStatus: string;
  createdAt: string;
  updatedAt?: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  pickupDate?: string;
}

const statuses = [
  { id: 'pending', label: 'Pending', desc: 'Quote submitted, awaiting review', icon: Clock },
  { id: 'reviewed', label: 'Reviewed', desc: 'Our team has reviewed your request', icon: Eye },
  { id: 'approved', label: 'Approved', desc: 'Quote approved and ready to schedule', icon: CheckCircle },
  { id: 'scheduled', label: 'Scheduled', desc: 'Delivery date confirmed', icon: Calendar },
  { id: 'delivered', label: 'Delivered', desc: 'Dumpster delivered to your location', icon: Truck },
  { id: 'completed', label: 'Completed', desc: 'Service completed successfully', icon: Package },
];


export const StatusTimeline: React.FC<StatusTimelineProps> = ({ 
  currentStatus, createdAt, updatedAt, deliveryDate, deliveryTimeSlot, pickupDate 
}) => {
  const currentIndex = statuses.findIndex(s => s.id === currentStatus);
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatDateOnly = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="py-4">
      {deliveryDate && (currentStatus === 'scheduled' || currentStatus === 'approved') && (
        <div className="mb-6 p-4 bg-gradient-to-r from-[#1A8B06] to-[#2DB742] text-white rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm opacity-80">Scheduled Delivery</p>
              <p className="text-xl font-bold">{formatDateOnly(deliveryDate)}</p>
              {deliveryTimeSlot && <p className="text-sm opacity-90">{deliveryTimeSlot}</p>}
            </div>
          </div>
          {pickupDate && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-sm"><span className="opacity-80">Scheduled Pickup:</span> {formatDateOnly(pickupDate)}</p>
            </div>
          )}
        </div>
      )}

      <div className="relative">
        {statuses.map((status, index) => {
          const Icon = status.icon;
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={status.id} className="flex items-start mb-8 last:mb-0">
              <div className="flex flex-col items-center mr-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${isComplete ? 'bg-[#1A8B06] border-[#1A8B06] text-white' : ''}
                  ${isCurrent ? 'bg-[#2DB742] border-[#2DB742] text-white ring-4 ring-green-100' : ''}
                  ${isPending ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}`}>
                  {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {index < statuses.length - 1 && (
                  <div className={`w-0.5 h-12 mt-2 ${index < currentIndex ? 'bg-[#1A8B06]' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className={`pt-1 ${isPending ? 'opacity-50' : ''}`}>
                <h4 className={`font-semibold ${isCurrent ? 'text-[#1A8B06]' : isComplete ? 'text-gray-800' : 'text-gray-500'}`}>
                  {status.label} {isCurrent && <span className="ml-2 text-xs bg-[#2DB742] text-white px-2 py-0.5 rounded-full">Current</span>}
                </h4>
                <p className="text-sm text-gray-500">{status.desc}</p>
                {isCurrent && updatedAt && <p className="text-xs text-gray-400 mt-1">Updated: {formatDate(updatedAt)}</p>}
                {index === 0 && <p className="text-xs text-gray-400 mt-1">Submitted: {formatDate(createdAt)}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

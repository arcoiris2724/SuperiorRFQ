
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Package, FileText, CalendarClock, Navigation } from 'lucide-react';

interface Quote {
  id: string;
  reference_number: string;
  status: string;
  dumpster_size: string;
  address: string;
  city: string;
  total_price: number;
  delivery_date?: string;
  delivery_time_slot?: string;
  pickup_date?: string;
  created_at: string;
  driver_en_route?: boolean;
  pickup_driver_en_route?: boolean;
}

interface QuoteCardProps {
  quote: Quote;
  onReschedule: (quote: Quote) => void;
  onDownloadInvoice: (quote: Quote) => void;
  onTrackDelivery?: (quote: Quote) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  scheduled: 'bg-purple-100 text-purple-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function QuoteCard({ quote, onReschedule, onDownloadInvoice, onTrackDelivery }: QuoteCardProps) {
  const canReschedule = ['approved', 'scheduled'].includes(quote.status);
  const canDownload = ['approved', 'scheduled', 'delivered', 'completed'].includes(quote.status);
  const canTrack = quote.driver_en_route || quote.pickup_driver_en_route;

  return (
    <Card className={`hover:shadow-lg transition-shadow ${canTrack ? 'ring-2 ring-green-500' : ''}`}>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-500">Reference</p>
            <p className="font-mono font-semibold text-orange-600">{quote.reference_number}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={statusColors[quote.status] || 'bg-gray-100'}>
              {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
            </Badge>
            {canTrack && (
              <Badge className="bg-green-500 text-white animate-pulse">
                Driver En Route
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-4 h-4" />
            <span>{quote.dumpster_size} Yard Dumpster</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{quote.address}, {quote.city}</span>
          </div>
          {quote.delivery_date && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Delivery: {new Date(quote.delivery_date).toLocaleDateString()} ({quote.delivery_time_slot})</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <p className="font-bold text-lg">${quote.total_price?.toFixed(2)}</p>
          <div className="flex gap-2 flex-wrap justify-end">
            {canTrack && onTrackDelivery && (
              <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => onTrackDelivery(quote)}>
                <Navigation className="w-4 h-4 mr-1" /> Track
              </Button>
            )}
            {canReschedule && (
              <Button size="sm" variant="outline" onClick={() => onReschedule(quote)}>
                <CalendarClock className="w-4 h-4 mr-1" /> Reschedule
              </Button>
            )}
            {canDownload && (
              <Button size="sm" variant="outline" onClick={() => onDownloadInvoice(quote)}>
                <FileText className="w-4 h-4 mr-1" /> Invoice
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { Quote } from '@/pages/admin/AdminDashboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, Loader2, Calendar } from 'lucide-react';

interface Props {
  quotes: Quote[];
  loading: boolean;
  onSelect: (quote: Quote) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  approved: 'bg-purple-100 text-purple-800',
  scheduled: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function QuotesTable({ quotes, loading, onSelect }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A8B06]" />
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
        No quotes found matching your filters.
      </div>
    );
  }

  const formatDeliveryDate = (date: string) => {
    return new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Ref #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <TableRow 
              key={quote.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onSelect(quote)}
            >
              <TableCell className="font-mono text-xs">{quote.reference_number}</TableCell>
              <TableCell className="text-sm">
                {new Date(quote.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="font-medium">{quote.customer_name}</div>
                <div className="text-xs text-gray-500">{quote.customer_email}</div>
              </TableCell>
              <TableCell className="capitalize">{quote.location}</TableCell>
              <TableCell>{quote.size} Yard</TableCell>
              <TableCell>
                {quote.delivery_date ? (
                  <div className="flex items-center gap-1 text-[#1A8B06]">
                    <Calendar className="w-3 h-3" />
                    <span className="text-xs font-medium">{formatDeliveryDate(quote.delivery_date)}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">Not scheduled</span>
                )}
              </TableCell>
              <TableCell className="font-semibold">${quote.total_price}</TableCell>
              <TableCell>
                <Badge className={statusColors[quote.status] || 'bg-gray-100'}>
                  {quote.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Eye className="w-4 h-4 text-gray-400" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, CreditCard, Calendar, DollarSign } from 'lucide-react';

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  total_amount: number;
  tax_amount: number;
  subtotal: number;
  tax_rate: number;
  county: string;
  due_date: string;
  issued_date: string;
  quotes?: { reference_number: string; dumpster_size: string; address: string; city: string };
  payments?: { amount: number; payment_date: string }[];
}

interface Props {
  invoice: Invoice;
  onView: (invoice: Invoice) => void;
  onPay: (invoice: Invoice) => void;
  onDownload: (invoice: Invoice) => void;
}

const statusColors: Record<string, string> = {
  unpaid: 'bg-red-100 text-red-800',
  partial: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800'
};

export default function InvoiceCard({ invoice, onView, onPay, onDownload }: Props) {
  const paidAmount = invoice.payments?.reduce((sum, p) => sum + parseFloat(String(p.amount)), 0) || 0;
  const remaining = invoice.total_amount - paidAmount;
  const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status !== 'paid';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-sm text-gray-500">Invoice</p>
            <p className="font-mono font-semibold text-orange-600">{invoice.invoice_number}</p>
          </div>
          <Badge className={statusColors[isOverdue ? 'overdue' : invoice.status]}>
            {isOverdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
          </Badge>
        </div>

        {invoice.quotes && (
          <div className="text-sm text-gray-600 mb-3">
            <p>Quote: {invoice.quotes.reference_number}</p>
            <p>{invoice.quotes.dumpster_size} Yard - {invoice.quotes.address}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Due: {new Date(invoice.due_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>Paid: ${paidAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-sm text-gray-500">Balance Due</p>
            <p className="font-bold text-lg text-orange-600">${remaining.toFixed(2)}</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onView(invoice)}>
              <FileText className="w-4 h-4 mr-1" /> View
            </Button>
            <Button size="sm" variant="outline" onClick={() => onDownload(invoice)}>
              <Download className="w-4 h-4" />
            </Button>
            {invoice.status !== 'paid' && (
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onPay(invoice)}>
                <CreditCard className="w-4 h-4 mr-1" /> Pay
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

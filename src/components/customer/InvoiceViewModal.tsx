
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, Printer, Calendar, MapPin, Package } from 'lucide-react';

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
  customer_name?: string;
  customer_email?: string;
  quotes?: any;
  payments?: { id: string; amount: number; payment_date: string; payment_method: string; transaction_id: string }[];
}

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
  onDownload: (invoice: Invoice) => void;
}

export default function InvoiceViewModal({ invoice, onClose, onDownload }: Props) {
  if (!invoice) return null;

  const paidAmount = invoice.payments?.reduce((sum, p) => sum + parseFloat(String(p.amount)), 0) || 0;
  const remaining = invoice.total_amount - paidAmount;

  const handlePrint = () => window.print();

  return (
    <Dialog open={!!invoice} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Invoice {invoice.invoice_number}</span>
            <Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              {invoice.status.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-bold text-lg text-orange-800 mb-2">Superior Waste Solutions</h3>
            <p className="text-sm text-gray-600">Long Island, NY</p>
            <p className="text-sm text-gray-600">info@superiorwaste.com</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Bill To:</p>
              <p className="font-semibold">{invoice.customer_name || 'Customer'}</p>
              <p>{invoice.customer_email}</p>
            </div>
            <div className="text-right">
              <p><span className="text-gray-500">Issued:</span> {new Date(invoice.issued_date).toLocaleDateString()}</p>
              <p><span className="text-gray-500">Due:</span> {new Date(invoice.due_date).toLocaleDateString()}</p>
            </div>
          </div>

          {invoice.quotes && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Service Details</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2"><Package className="w-4 h-4" /> {invoice.quotes.dumpster_size} Yard Dumpster</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {invoice.quotes.address}, {invoice.quotes.city}</div>
                {invoice.quotes.delivery_date && (
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(invoice.quotes.delivery_date).toLocaleDateString()}</div>
                )}
              </div>
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>${invoice.subtotal?.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-600">
              <span>Sales Tax ({invoice.county} - {invoice.tax_rate}%)</span>
              <span>${invoice.tax_amount?.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg"><span>Total</span><span>${invoice.total_amount?.toFixed(2)}</span></div>
            <div className="flex justify-between text-green-600"><span>Paid</span><span>-${paidAmount.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-orange-600 text-xl"><span>Balance Due</span><span>${remaining.toFixed(2)}</span></div>
          </div>

          {invoice.payments && invoice.payments.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Payment History</h4>
                <div className="space-y-2">
                  {invoice.payments.map(p => (
                    <div key={p.id} className="flex justify-between text-sm bg-green-50 p-2 rounded">
                      <span>{new Date(p.payment_date).toLocaleDateString()} - {p.payment_method}</span>
                      <span className="font-semibold">${parseFloat(String(p.amount)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" /> Print</Button>
            <Button variant="outline" onClick={() => onDownload(invoice)}><Download className="w-4 h-4 mr-2" /> Download</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

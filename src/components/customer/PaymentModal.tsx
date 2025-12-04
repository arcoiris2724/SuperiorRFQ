
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/lib/supabase';
import { CreditCard, Building2, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  invoice_number: string;
  total_amount: number;
  payments?: { amount: number }[];
}

interface Props {
  invoice: Invoice | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ invoice, onClose, onSuccess }: Props) {
  const [method, setMethod] = useState('credit_card');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  if (!invoice) return null;

  const paidAmount = invoice.payments?.reduce((sum, p) => sum + parseFloat(String(p.amount)), 0) || 0;
  const remaining = invoice.total_amount - paidAmount;

  const handlePayment = async () => {
    const payAmount = parseFloat(amount);
    if (!payAmount || payAmount <= 0 || payAmount > remaining) {
      toast({ title: 'Invalid amount', description: 'Please enter a valid payment amount', variant: 'destructive' });
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-invoices', {
        body: {
          action: 'process-payment',
          paymentData: { invoiceId: invoice.id, amount: payAmount, method }
        }
      });

      if (error || data?.error) throw new Error(data?.error || 'Payment failed');

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setAmount('');
      }, 2000);
    } catch (err: any) {
      toast({ title: 'Payment Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <Dialog open={!!invoice} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-700">Payment Successful!</h3>
            <p className="text-gray-600 mt-2">Thank you for your payment</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={!!invoice} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pay Invoice {invoice.invoice_number}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-600">Balance Due</p>
            <p className="text-3xl font-bold text-orange-600">${remaining.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <Label>Payment Amount</Label>
            <Input
              type="number"
              step="0.01"
              max={remaining}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount (max $${remaining.toFixed(2)})`}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setAmount(remaining.toFixed(2))}>Pay Full</Button>
              <Button size="sm" variant="outline" onClick={() => setAmount((remaining / 2).toFixed(2))}>Pay Half</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Payment Method</Label>
            <RadioGroup value={method} onValueChange={setMethod}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="credit_card" id="cc" />
                <Label htmlFor="cc" className="flex items-center gap-2 cursor-pointer">
                  <CreditCard className="w-5 h-5" /> Credit/Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="bank_transfer" id="bank" />
                <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="w-5 h-5" /> Bank Transfer
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : `Pay $${amount || '0.00'}`}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Payments are processed securely. You will receive a confirmation email.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

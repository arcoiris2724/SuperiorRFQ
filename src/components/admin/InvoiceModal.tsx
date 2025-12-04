import { useState, useRef } from 'react';
import { Quote } from '@/pages/admin/AdminDashboard';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Download, Mail, Loader2, Check, Printer, Receipt } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  quote: Quote;
  onClose: () => void;
}

export default function InvoiceModal({ quote, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [invoiceHtml, setInvoiceHtml] = useState<string | null>(null);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [creatingDbInvoice, setCreatingDbInvoice] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();

  const generateInvoice = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke('generate-invoice', {
      body: { quote, action: 'generate' }
    });
    if (data?.html) {
      setInvoiceHtml(data.html);
      setInvoiceNumber(data.invoiceNumber);
    }
    setLoading(false);
  };

  const createDatabaseInvoice = async () => {
    setCreatingDbInvoice(true);
    const { data, error } = await supabase.functions.invoke('admin-quotes', {
      body: { action: 'create-invoice', quoteId: quote.id }
    });
    if (data?.invoice || data?.invoiceId) {
      toast({ title: 'Invoice Created', description: 'Invoice has been added to customer portal' });
    } else if (error) {
      toast({ title: 'Error', description: 'Failed to create invoice', variant: 'destructive' });
    }
    setCreatingDbInvoice(false);
  };

  const emailInvoice = async () => {
    setSending(true);
    const { data } = await supabase.functions.invoke('generate-invoice', {
      body: { quote, action: 'email' }
    });
    if (data?.success) setEmailSent(true);
    setSending(false);
  };

  const printInvoice = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
    }
  };

  const downloadInvoice = () => {
    if (!invoiceHtml) return;
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1A8B06]" />
            Invoice for {quote.reference_number}
          </DialogTitle>
        </DialogHeader>

        {!invoiceHtml ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <FileText className="w-16 h-16 text-gray-300" />
            <p className="text-gray-500">Generate a professional invoice for this quote</p>
            <div className="flex gap-2">
              <Button onClick={generateInvoice} disabled={loading} className="bg-[#1A8B06] hover:bg-[#106203]">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                Preview Invoice
              </Button>
              <Button onClick={createDatabaseInvoice} disabled={creatingDbInvoice} variant="outline">
                {creatingDbInvoice ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Receipt className="w-4 h-4 mr-2" />}
                Add to Customer Portal
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 pb-4 border-b flex-wrap">
              <Button onClick={printInvoice} variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />Print / Save PDF
              </Button>
              <Button onClick={downloadInvoice} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />Download HTML
              </Button>
              <Button onClick={createDatabaseInvoice} disabled={creatingDbInvoice} variant="outline" size="sm">
                {creatingDbInvoice ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Receipt className="w-4 h-4 mr-2" />}
                Add to Portal
              </Button>
              <Button onClick={emailInvoice} disabled={sending || emailSent} className="bg-[#1A8B06] hover:bg-[#106203]" size="sm">
                {sending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : emailSent ? <Check className="w-4 h-4 mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                {emailSent ? 'Sent!' : 'Email to Customer'}
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-100 rounded-lg p-2 min-h-[500px]">
              <iframe ref={iframeRef} srcDoc={invoiceHtml} className="w-full h-full min-h-[500px] bg-white rounded shadow" title="Invoice Preview" />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

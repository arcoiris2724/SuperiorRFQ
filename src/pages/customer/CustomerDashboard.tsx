
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCustomer } from '@/contexts/CustomerContext';
import { supabase } from '@/lib/supabase';
import QuoteCard from '@/components/customer/QuoteCard';
import InvoiceCard from '@/components/customer/InvoiceCard';
import InvoiceViewModal from '@/components/customer/InvoiceViewModal';
import PaymentModal from '@/components/customer/PaymentModal';
import RescheduleModal from '@/components/customer/RescheduleModal';
import ReferralSection from '@/components/customer/ReferralSection';
import DeliveryTracker from '@/components/customer/DeliveryTracker';
import NotificationManager from '@/components/customer/NotificationManager';
import { Truck, LogOut, FileText, Clock, CheckCircle, Package, Loader2, Plus, Receipt, DollarSign, Gift, Navigation, Bell } from 'lucide-react';

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
  payments?: any[];
}

export default function CustomerDashboard() {
  const { customer, logout, isLoading: authLoading } = useCustomer();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rescheduleQuote, setRescheduleQuote] = useState<Quote | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [trackingQuote, setTrackingQuote] = useState<Quote | null>(null);
  const [creditBalance, setCreditBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !customer) navigate('/customer/login');
  }, [customer, authLoading, navigate]);

  useEffect(() => {
    if (customer) { fetchQuotes(); fetchInvoices(); fetchCredits(); }
  }, [customer]);

  useEffect(() => {
    if (!customer) return;
    const interval = setInterval(fetchQuotes, 30000);
    return () => clearInterval(interval);
  }, [customer]);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('customer-quotes', {
        body: { action: 'list', customerId: customer?.id, email: customer?.email }
      });
      setQuotes(data?.quotes || []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const fetchInvoices = async () => {
    try {
      const { data } = await supabase.functions.invoke('customer-invoices', {
        body: { action: 'list', email: customer?.email }
      });
      setInvoices(data?.invoices || []);
    } catch (err) { console.error(err); }
  };

  const fetchCredits = async () => {
    try {
      const { data } = await supabase.functions.invoke('customer-referrals', {
        body: { action: 'get-referral-info', customerId: customer?.id, customerName: customer?.name }
      });
      setCreditBalance(data?.referral?.credit_balance || 0);
    } catch (err) { console.error(err); }
  };

  const downloadInvoice = async (invoice: Invoice) => {
    const { data } = await supabase.functions.invoke('generate-invoice', {
      body: { quoteId: invoice.quotes?.id || invoice.id, action: 'generate' }
    });
    if (data?.html) {
      const blob = new Blob([data.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `invoice-${invoice.invoice_number}.html`; a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadQuoteInvoice = (quote: Quote) => {
    const invoice = `INVOICE - ${quote.reference_number}\n${'='.repeat(32)}\nDate: ${new Date().toLocaleDateString()}\nCustomer: ${customer?.name}\n\nSERVICE DETAILS\n${'-'.repeat(15)}\nDumpster: ${quote.dumpster_size} Yard\nAddress: ${quote.address}, ${quote.city}\n${quote.delivery_date ? `Delivery: ${new Date(quote.delivery_date).toLocaleDateString()}` : ''}\n\nTOTAL: $${quote.total_price?.toFixed(2)}`;
    const blob = new Blob([invoice], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `invoice-${quote.reference_number}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const activeQuotes = quotes.filter(q => ['pending', 'reviewed', 'approved', 'scheduled', 'delivered'].includes(q.status));
  const completedQuotes = quotes.filter(q => q.status === 'completed');
  const enRouteQuotes = quotes.filter(q => q.driver_en_route || q.pickup_driver_en_route);
  const unpaidInvoices = invoices.filter(i => i.status !== 'paid');
  const totalOwed = unpaidInvoices.reduce((sum, i) => {
    const paid = i.payments?.reduce((s, p) => s + parseFloat(String(p.amount)), 0) || 0;
    return sum + (i.total_amount - paid);
  }, 0);

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center"><Truck className="w-6 h-6 text-white" /></div>
            <span className="font-bold text-xl">My Account</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">Welcome, {customer?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" /> Logout</Button>
          </div>
        </div>
      </header>

      {enRouteQuotes.length > 0 && (
        <div className="bg-green-500 text-white py-3">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Navigation className="w-5 h-5 animate-pulse" />
              <span className="font-medium">Driver en route! Track your {enRouteQuotes[0].pickup_driver_en_route ? 'pickup' : 'delivery'} in real-time</span>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setTrackingQuote(enRouteQuotes[0])}>Track Now</Button>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Quotes', value: quotes.length, icon: FileText, color: 'bg-blue-500' },
            { label: 'Active', value: activeQuotes.length, icon: Clock, color: 'bg-orange-500' },
            { label: 'Completed', value: completedQuotes.length, icon: CheckCircle, color: 'bg-green-500' },
            { label: 'Invoices', value: invoices.length, icon: Receipt, color: 'bg-purple-500' },
            { label: 'Balance Due', value: `$${totalOwed.toFixed(0)}`, icon: DollarSign, color: 'bg-red-500' },
            { label: 'Credits', value: `$${creditBalance.toFixed(0)}`, icon: Gift, color: 'bg-emerald-500' }
          ].map((stat, i) => (
            <Card key={i}><CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}><stat.icon className="w-5 h-5 text-white" /></div>
              <div><p className="text-xl font-bold">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <Link to="/"><Button className="bg-orange-500 hover:bg-orange-600"><Plus className="w-4 h-4 mr-2" /> New Quote</Button></Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500" /></div>
        ) : (
          <Tabs defaultValue="quotes">
            <TabsList className="mb-6">
              <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
              <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-1"><Gift className="w-4 h-4" /> Referrals</TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-1"><Bell className="w-4 h-4" /> Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="quotes">
              {quotes.length === 0 ? (
                <Card><CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No quotes yet</h3>
                  <Link to="/"><Button className="bg-orange-500 hover:bg-orange-600">Get a Quote</Button></Link>
                </CardContent></Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {quotes.map(quote => (
                    <QuoteCard key={quote.id} quote={quote} onReschedule={setRescheduleQuote} onDownloadInvoice={downloadQuoteInvoice} onTrackDelivery={setTrackingQuote} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="invoices">
              {invoices.length === 0 ? (
                <Card><CardContent className="p-12 text-center">
                  <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No invoices yet</h3>
                  <p className="text-gray-500">Invoices will appear here once your quotes are processed</p>
                </CardContent></Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {invoices.map(invoice => (
                    <InvoiceCard key={invoice.id} invoice={invoice} onView={setViewInvoice} onPay={setPayInvoice} onDownload={downloadInvoice} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="referrals">
              {customer && <ReferralSection customerId={customer.id} customerName={customer.name} />}
            </TabsContent>

            <TabsContent value="notifications">
              <div className="grid md:grid-cols-2 gap-6">
                {customer && <NotificationManager customerId={customer.id} />}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-orange-500" /> Notification Types</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-1" />
                        <div><p className="font-medium text-green-800">Driver Nearby</p><p className="text-sm text-green-600">Get alerted when your driver is within 5 minutes of arrival</p></div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-1" />
                        <div><p className="font-medium text-blue-800">Delivery Complete</p><p className="text-sm text-blue-600">Notification when your dumpster has been delivered</p></div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mt-1" />
                        <div><p className="font-medium text-orange-800">Invoice Reminders</p><p className="text-sm text-orange-600">Reminders for upcoming and overdue invoices</p></div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mt-1" />
                        <div><p className="font-medium text-purple-800">Pickup Complete</p><p className="text-sm text-purple-600">Confirmation when your dumpster has been picked up</p></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

        )}
      </main>

      <RescheduleModal quote={rescheduleQuote} customerId={customer?.id || ''} onClose={() => setRescheduleQuote(null)} onSuccess={fetchQuotes} />
      <InvoiceViewModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} onDownload={downloadInvoice} />
      <PaymentModal invoice={payInvoice} onClose={() => setPayInvoice(null)} onSuccess={() => { fetchInvoices(); setPayInvoice(null); }} />
      {trackingQuote && <DeliveryTracker quoteId={trackingQuote.id} referenceNumber={trackingQuote.reference_number} onClose={() => setTrackingQuote(null)} />}
    </div>
  );
}

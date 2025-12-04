import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Download, RefreshCw, Filter, CalendarDays, List, Route, Settings, MessageSquare, Loader2, Star } from 'lucide-react';
import QuotesTable from '@/components/admin/QuotesTable';
import QuoteModal from '@/components/admin/QuoteModal';
import DeliveryCalendar from '@/components/admin/DeliveryCalendar';
import RoutePlanner from '@/components/admin/RoutePlanner';
import AdminSettings from '@/components/admin/AdminSettings';
import ReviewsManager from '@/components/admin/ReviewsManager';
import { toast } from '@/hooks/use-toast';

export interface Quote {
  id: string;
  reference_number: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  location: string;
  material: string;
  size: string;
  rental_period: string;
  rental_days: number;
  payment_method: string;
  base_price: number;
  duration_modifier: number;
  total_price: number;
  status: string;
  notes: string;
  delivery_date?: string;
  delivery_time_slot?: string;
  pickup_date?: string;
  pickup_time_slot?: string;
  photos?: string[];
  delivery_address?: string;
  delivery_lat?: number;
  delivery_lng?: number;
  address_components?: Record<string, string>;
  delivery_completed?: boolean;
  delivery_completed_at?: string;
  delivery_proof_photo?: string;
  driver_notes?: string;
  pickup_completed?: boolean;
  pickup_completed_at?: string;
  pickup_proof_photo?: string;
  pickup_driver_notes?: string;
  tax_amount?: number;
  tax_rate?: number;
  county?: string;
}

export default function AdminDashboard() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [scheduled, setScheduled] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [filters, setFilters] = useState({ status: 'all', dateFrom: '', dateTo: '' });
  const [view, setView] = useState<'list' | 'calendar' | 'routes'>('list');
  const [showSettings, setShowSettings] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { navigate('/admin'); return; }
    fetchQuotes(); fetchScheduled();
  }, []);

  const fetchQuotes = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke('admin-quotes', { body: { action: 'list', filters } });
    if (data?.quotes) setQuotes(data.quotes);
    setLoading(false);
  };

  const fetchScheduled = async () => {
    const { data } = await supabase.functions.invoke('admin-quotes', { body: { action: 'get-scheduled' } });
    if (data?.scheduled) setScheduled(data.scheduled);
  };

  const handleSendReminders = async () => {
    setSendingReminders(true);
    const { data } = await supabase.functions.invoke('admin-quotes', { body: { action: 'send-invoice-reminders' } });
    setSendingReminders(false);
    toast({ title: 'SMS Reminders Sent', description: `${data?.sent || 0} reminder(s) sent successfully` });
  };

  const handleLogout = () => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin'); };
  const handleSelectFromCalendar = (id: string) => { const q = quotes.find(q => q.id === id) || scheduled.find(q => q.id === id); if (q) setSelectedQuote(q); };
  const handleUpdate = () => { fetchQuotes(); fetchScheduled(); };

  const exportCSV = () => {
    const headers = ['Ref#','Date','Name','Email','Phone','Location','Material','Size','Period','Payment','Total','Status'];
    const rows = quotes.map(q => [q.reference_number, new Date(q.created_at).toLocaleDateString(), q.customer_name, q.customer_email, q.customer_phone, q.location, q.material, q.size, q.rental_period, q.payment_method, q.total_price, q.status]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `quotes-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[#1A8B06]">Superior Waste Admin</h1>
          <div className="flex items-center gap-2">
            <Button variant={view === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setView('list')} className={view === 'list' ? 'bg-[#1A8B06]' : ''}><List className="w-4 h-4 mr-1" /> Quotes</Button>
            <Button variant={view === 'calendar' ? 'default' : 'outline'} size="sm" onClick={() => setView('calendar')} className={view === 'calendar' ? 'bg-[#1A8B06]' : ''}><CalendarDays className="w-4 h-4 mr-1" /> Calendar</Button>
            <Button variant={view === 'routes' ? 'default' : 'outline'} size="sm" onClick={() => setView('routes')} className={view === 'routes' ? 'bg-[#1A8B06]' : ''}><Route className="w-4 h-4 mr-1" /> Routes</Button>
            <Button variant="outline" size="sm" onClick={() => setShowReviews(true)}><Star className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={handleSendReminders} disabled={sendingReminders}>
              {sendingReminders ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}><Settings className="w-4 h-4" /></Button>
            <Button variant="outline" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'list' && (
          <>
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <div className="flex flex-wrap gap-3 items-end">
                <div><label className="text-xs text-gray-500">Status</label>
                  <Select value={filters.status} onValueChange={v => setFilters(p => ({...p, status: v}))}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="reviewed">Reviewed</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
                  </Select></div>
                <div><label className="text-xs text-gray-500">From</label><Input type="date" value={filters.dateFrom} onChange={e => setFilters(p => ({...p, dateFrom: e.target.value}))} className="w-36" /></div>
                <div><label className="text-xs text-gray-500">To</label><Input type="date" value={filters.dateTo} onChange={e => setFilters(p => ({...p, dateTo: e.target.value}))} className="w-36" /></div>
                <Button onClick={fetchQuotes} className="bg-[#1A8B06] hover:bg-[#106203]"><Filter className="w-4 h-4 mr-1" />Filter</Button>
                <Button variant="outline" onClick={handleUpdate}><RefreshCw className="w-4 h-4" /></Button>
                <Button variant="outline" onClick={exportCSV}><Download className="w-4 h-4 mr-1" />Export</Button>
              </div>
            </div>
            <QuotesTable quotes={quotes} loading={loading} onSelect={setSelectedQuote} />
          </>
        )}
        {view === 'calendar' && <DeliveryCalendar scheduled={scheduled} onSelectQuote={handleSelectFromCalendar} />}
        {view === 'routes' && <RoutePlanner scheduled={scheduled} />}
        {selectedQuote && <QuoteModal quote={selectedQuote} onClose={() => setSelectedQuote(null)} onUpdate={handleUpdate} />}
        {showSettings && <AdminSettings onClose={() => setShowSettings(false)} />}
        {showReviews && <ReviewsManager onClose={() => setShowReviews(false)} />}
      </main>
    </div>
  );
}

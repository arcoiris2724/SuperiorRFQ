import { useState } from 'react';
import { Quote } from '@/pages/admin/AdminDashboard';
import { supabase } from '@/lib/supabase';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Phone, Mail, Loader2, Hash, Truck, Send, Camera, MapPin, Navigation, ExternalLink, CheckCircle, Trash2, FileText } from 'lucide-react';
import InvoiceModal from './InvoiceModal';

interface Props { quote: Quote; onClose: () => void; onUpdate: () => void; }
const timeSlots = ['morning', 'afternoon', 'evening'];
const timeLabels: Record<string, string> = { morning: '8AM - 12PM', afternoon: '12PM - 4PM', evening: '4PM - 7PM' };

export default function QuoteModal({ quote, onClose, onUpdate }: Props) {
  const [status, setStatus] = useState(quote.status);
  const [notes, setNotes] = useState(quote.notes || '');
  const [deliveryDate, setDeliveryDate] = useState(quote.delivery_date || '');
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState(quote.delivery_time_slot || '');
  const [pickupDate, setPickupDate] = useState(quote.pickup_date || '');
  const [pickupTimeSlot, setPickupTimeSlot] = useState(quote.pickup_time_slot || '');
  const [saving, setSaving] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  const statusChanged = status !== quote.status;
  const photos = quote.photos || [];
  const hasLocation = quote.delivery_lat && quote.delivery_lng;
  const mapsUrl = hasLocation ? `https://www.google.com/maps/search/?api=1&query=${quote.delivery_lat},${quote.delivery_lng}` : '';
  const directionsUrl = hasLocation ? `https://www.google.com/maps/dir/?api=1&destination=${quote.delivery_lat},${quote.delivery_lng}` : '';

  const handleSave = async () => {
    setSaving(true);
    await supabase.functions.invoke('admin-quotes', {
      body: { action: 'update', quoteId: quote.id, status, notes, deliveryDate: deliveryDate || null, 
        deliveryTimeSlot: deliveryTimeSlot || null, pickupDate: pickupDate || null, pickupTimeSlot: pickupTimeSlot || null,
        sendEmail: statusChanged && sendEmail, baseUrl: window.location.origin }
    });
    setSaving(false); onUpdate(); onClose();
  };

  if (showInvoice) {
    return <InvoiceModal quote={quote} onClose={() => setShowInvoice(false)} />;
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2"><Hash className="w-5 h-5" />{quote.reference_number}</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowInvoice(true)} className="gap-1">
                <FileText className="w-4 h-4" />Invoice
              </Button>
              <Badge className="text-lg px-3 py-1 bg-[#1A8B06]">${quote.total_price}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Customer</h3>
            <p className="font-medium">{quote.customer_name}</p>
            <p className="flex items-center gap-2 text-sm text-gray-600"><Mail className="w-4 h-4" />{quote.customer_email}</p>
            <p className="flex items-center gap-2 text-sm text-gray-600"><Phone className="w-4 h-4" />{quote.customer_phone}</p>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 border-b pb-2">Details</h3>
            <p className="text-sm"><span className="text-gray-500">Size:</span> {quote.size} Yard</p>
            <p className="text-sm"><span className="text-gray-500">Material:</span> {quote.material}</p>
          </div>
        </div>

        {quote.delivery_completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2"><CheckCircle className="w-5 h-5" /><h3 className="font-semibold">Delivery Completed</h3></div>
            {quote.delivery_completed_at && <p className="text-sm text-green-600">Completed: {new Date(quote.delivery_completed_at).toLocaleString()}</p>}
            {quote.driver_notes && <p className="text-sm mt-2"><span className="font-medium">Driver Notes:</span> {quote.driver_notes}</p>}
            {quote.delivery_proof_photo && <a href={quote.delivery_proof_photo} target="_blank" rel="noopener noreferrer"><img src={quote.delivery_proof_photo} alt="Proof" className="w-24 h-24 object-cover rounded-lg border mt-2" /></a>}
          </div>
        )}

        {quote.pickup_completed && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-orange-700 mb-2"><Trash2 className="w-5 h-5" /><h3 className="font-semibold">Pickup Completed</h3></div>
            {quote.pickup_completed_at && <p className="text-sm text-orange-600">Completed: {new Date(quote.pickup_completed_at).toLocaleString()}</p>}
            {quote.pickup_driver_notes && <p className="text-sm mt-2"><span className="font-medium">Driver Notes:</span> {quote.pickup_driver_notes}</p>}
            {quote.pickup_proof_photo && <a href={quote.pickup_proof_photo} target="_blank" rel="noopener noreferrer"><img src={quote.pickup_proof_photo} alt="Pickup Proof" className="w-24 h-24 object-cover rounded-lg border mt-2" /></a>}
          </div>
        )}

        {(quote.delivery_address || hasLocation) && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3"><MapPin className="w-5 h-5 text-[#1A8B06]" /><h3 className="font-semibold text-gray-700">Location</h3></div>
            {quote.delivery_address && <p className="text-sm text-gray-700 mb-3">{quote.delivery_address}</p>}
            {hasLocation && <div className="flex gap-2"><a href={directionsUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="gap-2"><Navigation className="w-4 h-4" />Directions</Button></a><a href={mapsUrl} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm" className="gap-2"><ExternalLink className="w-4 h-4" />Map</Button></a></div>}
          </div>
        )}

        {photos.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3"><Camera className="w-5 h-5 text-[#1A8B06]" /><h3 className="font-semibold text-gray-700">Photos</h3></div>
            <div className="grid grid-cols-4 gap-2">{photos.map((url, i) => (<a key={i} href={url} target="_blank" rel="noopener noreferrer"><img src={url} alt={`Photo ${i+1}`} className="w-full aspect-square object-cover rounded-lg border" /></a>))}</div>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-[#1A8B06]"><Truck className="w-5 h-5" /><h3 className="font-semibold">Scheduling</h3></div>
          <div className="grid md:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium">Delivery Date</label><Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} /></div>
            <div><label className="text-sm font-medium">Delivery Time</label><Select value={deliveryTimeSlot} onValueChange={setDeliveryTimeSlot}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{timeSlots.map(s => <SelectItem key={s} value={s}>{timeLabels[s]}</SelectItem>)}</SelectContent></Select></div>
            <div><label className="text-sm font-medium">Pickup Date</label><Input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} /></div>
            <div><label className="text-sm font-medium">Pickup Time</label><Select value={pickupTimeSlot} onValueChange={setPickupTimeSlot}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{timeSlots.map(s => <SelectItem key={s} value={s}>{timeLabels[s]}</SelectItem>)}</SelectContent></Select></div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div><label className="text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="reviewed">Reviewed</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="scheduled">Scheduled</SelectItem><SelectItem value="delivered">Delivered</SelectItem><SelectItem value="completed">Completed</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent>
            </Select>
          </div>
          {statusChanged && (<div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg"><Checkbox id="sendEmail" checked={sendEmail} onCheckedChange={(c) => setSendEmail(!!c)} /><label htmlFor="sendEmail" className="text-sm font-medium flex items-center gap-2 cursor-pointer"><Send className="w-4 h-4 text-blue-600" />Send email</label></div>)}
          <div><label className="text-sm font-medium">Notes</label><Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Internal notes..." /></div>
          <div className="flex gap-2 justify-end"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave} disabled={saving} className="bg-[#1A8B06] hover:bg-[#106203]">{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save</Button></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

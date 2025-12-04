
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

interface Quote {
  id: string;
  reference_number: string;
  delivery_date?: string;
  delivery_time_slot?: string;
}

interface RescheduleModalProps {
  quote: Quote | null;
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const timeSlots = ['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

export default function RescheduleModal({ quote, customerId, onClose, onSuccess }: RescheduleModalProps) {
  const [date, setDate] = useState(quote?.delivery_date || '');
  const [timeSlot, setTimeSlot] = useState(quote?.delivery_time_slot || '');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const checkAvailability = async () => {
    if (!date || !timeSlot) return;
    setIsChecking(true);
    try {
      const { data } = await supabase.functions.invoke('customer-quotes', {
        body: { action: 'check-availability', quoteId: quote?.id, deliveryDate: date, deliveryTimeSlot: timeSlot }
      });
      setIsAvailable(data?.available ?? false);
    } catch (err) {
      setIsAvailable(false);
    } finally {
      setIsChecking(false);
    }
  };

  const handleReschedule = async () => {
    if (!isAvailable) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-quotes', {
        body: { 
          action: 'reschedule', 
          quoteId: quote?.id, 
          customerId, 
          deliveryDate: date, 
          deliveryTimeSlot: timeSlot,
          baseUrl: window.location.origin
        }
      });
      if (error || data?.error) throw new Error(data?.error || 'Failed to reschedule');
      toast({ title: 'Delivery Rescheduled', description: `New date: ${new Date(date).toLocaleDateString()} at ${timeSlot}. A confirmation email has been sent.` });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };


  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);

  return (
    <Dialog open={!!quote} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Reschedule Delivery</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <p className="text-sm text-gray-600">Quote: <span className="font-mono font-semibold">{quote?.reference_number}</span></p>
          
          <div>
            <Label>New Delivery Date</Label>
            <input type="date" className="w-full mt-1 px-3 py-2 border rounded-md" min={minDate.toISOString().split('T')[0]} value={date} onChange={e => { setDate(e.target.value); setIsAvailable(null); }} />
          </div>

          <div>
            <Label>Time Slot</Label>
            <Select value={timeSlot} onValueChange={v => { setTimeSlot(v); setIsAvailable(null); }}>
              <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
              <SelectContent>
                {timeSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {date && timeSlot && isAvailable === null && (
            <Button variant="outline" className="w-full" onClick={checkAvailability} disabled={isChecking}>
              {isChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Check Availability
            </Button>
          )}

          {isAvailable === true && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">This time slot is available!</AlertDescription>
            </Alert>
          )}

          {isAvailable === false && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">This time slot is not available. Please choose another.</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600" onClick={handleReschedule} disabled={!isAvailable || isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

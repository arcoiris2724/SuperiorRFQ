import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ScheduledQuote {
  id: string;
  reference_number: string;
  customer_name: string;
  location: string;
  size: string;
  delivery_date: string;
  delivery_time_slot: string;
}

interface Props {
  scheduled: ScheduledQuote[];
  onSelectQuote: (id: string) => void;
}

const timeSlots = ['8:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 2:00 PM', '2:00 PM - 4:00 PM', '4:00 PM - 6:00 PM'];

export default function DeliveryCalendar({ scheduled, onSelectQuote }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];
  const isToday = (d: Date) => formatDate(d) === formatDate(new Date());

  const getDeliveriesForDate = (date: Date) => 
    scheduled.filter(s => s.delivery_date === formatDate(date));

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (dir * 7));
    setCurrentDate(d);
  };

  const weekDays = getWeekDays();

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#1A8B06]" />
          <h2 className="font-semibold">Delivery Schedule</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ChevronLeft className="w-4 h-4" /></Button>
          <span className="text-sm font-medium min-w-[140px] text-center">
            {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <Button variant="outline" size="sm" onClick={() => navigate(1)}><ChevronRight className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>Today</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day, i) => (
          <div key={i} className={`p-2 text-center border-r last:border-r-0 ${isToday(day) ? 'bg-green-50' : ''}`}>
            <p className="text-xs text-gray-500">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p className={`text-lg font-semibold ${isToday(day) ? 'text-[#1A8B06]' : ''}`}>{day.getDate()}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 min-h-[300px]">
        {weekDays.map((day, i) => {
          const deliveries = getDeliveriesForDate(day);
          return (
            <div key={i} className={`p-2 border-r last:border-r-0 ${isToday(day) ? 'bg-green-50/50' : ''}`}>
              {deliveries.map(d => (
                <div key={d.id} onClick={() => onSelectQuote(d.id)}
                  className="mb-2 p-2 bg-[#1A8B06] text-white rounded text-xs cursor-pointer hover:bg-[#106203] transition-colors">
                  <p className="font-semibold truncate">{d.customer_name}</p>
                  <p className="flex items-center gap-1 opacity-80"><Clock className="w-3 h-3" />{d.delivery_time_slot?.split(' - ')[0]}</p>
                  <p className="truncate opacity-80">{d.size} Yard • {d.location}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

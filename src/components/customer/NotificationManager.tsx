
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, BellRing, Loader2, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  customerId: string;
}

export default function NotificationManager({ customerId }: Props) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkStatus();
  }, [customerId]);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      if ('Notification' in window) {
        setPermission(Notification.permission);
      }
      const { data } = await supabase.functions.invoke('send-push-notification', {
        body: { action: 'get-status', customerId }
      });
      setIsSubscribed(data?.subscribed || false);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      setError('Notifications not supported in this browser');
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      await subscribe();
    }
  };

  const subscribe = async () => {
    setIsLoading(true);
    setError('');
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;
      
      const { data: vapidData } = await supabase.functions.invoke('send-push-notification', {
        body: { action: 'get-vapid-key' }
      });
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidData.publicKey)
      });
      
      await supabase.functions.invoke('send-push-notification', {
        body: { action: 'subscribe', customerId, subscription: subscription.toJSON() }
      });
      
      setIsSubscribed(true);
      new Notification('Notifications Enabled', { body: 'You will receive delivery updates!' });
    } catch (e: any) {
      setError(e.message || 'Failed to subscribe');
    }
    setIsLoading(false);
  };

  const unsubscribe = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      await subscription?.unsubscribe();
      await supabase.functions.invoke('send-push-notification', {
        body: { action: 'unsubscribe', customerId }
      });
      setIsSubscribed(false);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
  };

  if (isLoading) {
    return <div className="flex items-center gap-2 text-gray-500"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BellRing className="w-5 h-5 text-orange-500" /> Push Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">Get notified when your driver is nearby, delivery is complete, and for invoice reminders.</p>
        
        {error && <div className="flex items-center gap-2 text-red-600 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>}
        
        {permission === 'denied' ? (
          <div className="bg-red-50 p-3 rounded-lg text-sm text-red-700">
            <p className="font-medium">Notifications Blocked</p>
            <p>Please enable notifications in your browser settings.</p>
          </div>
        ) : isSubscribed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-green-600"><Check className="w-5 h-5" /> <span>Notifications enabled</span></div>
            <Button variant="outline" size="sm" onClick={unsubscribe}><BellOff className="w-4 h-4 mr-2" /> Disable</Button>
          </div>
        ) : (
          <Button onClick={requestPermission} className="w-full bg-orange-500 hover:bg-orange-600">
            <Bell className="w-4 h-4 mr-2" /> Enable Notifications
          </Button>
        )}
        
        <div className="border-t pt-4 space-y-3">
          <p className="text-sm font-medium">You'll be notified for:</p>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Driver within 5 minutes</li>
            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Delivery completed</li>
            <li className="flex items-center gap-2"><div className="w-2 h-2 bg-orange-500 rounded-full" /> Invoice reminders</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

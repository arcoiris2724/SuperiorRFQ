
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Settings, FileText, Mail, Loader2, Check, MessageSquare, Star, Bell, Send } from 'lucide-react';

interface AdminSettingsProps { onClose: () => void; }

export default function AdminSettings({ onClose }: AdminSettingsProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sendingReminders, setSendingReminders] = useState(false);
  const [autoInvoice, setAutoInvoice] = useState({ enabled: true, trigger_statuses: ['approved', 'scheduled'], send_email: true });
  const [smsSettings, setSmsSettings] = useState({
    enabled: false, delivery_scheduled: true, delivery_on_way: true, delivery_complete: true,
    pickup_scheduled: true, pickup_on_way: true, pickup_complete: true,
    invoice_created: true, invoice_due: true, invoice_overdue: true
  });
  const [reviewSettings, setReviewSettings] = useState({ enabled: true, send_email: true, send_sms: true });
  const [pushSettings, setPushSettings] = useState({ enabled: true, driver_nearby: true, delivery_complete: true, invoice_reminders: true });

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke('admin-quotes', { body: { action: 'get-settings' } });
    if (data?.settings) {
      if (data.settings.auto_invoice) setAutoInvoice(data.settings.auto_invoice);
      if (data.settings.sms_notifications) setSmsSettings(data.settings.sms_notifications);
      if (data.settings.review_requests) setReviewSettings(data.settings.review_requests);
      if (data.settings.push_notifications) setPushSettings(data.settings.push_notifications);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase.functions.invoke('admin-quotes', { body: { action: 'update-setting', settingKey: 'auto_invoice', settingValue: autoInvoice } });
    await supabase.functions.invoke('admin-quotes', { body: { action: 'update-setting', settingKey: 'sms_notifications', settingValue: smsSettings } });
    await supabase.functions.invoke('admin-quotes', { body: { action: 'update-setting', settingKey: 'review_requests', settingValue: reviewSettings } });
    await supabase.functions.invoke('admin-quotes', { body: { action: 'update-setting', settingKey: 'push_notifications', settingValue: pushSettings } });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sendInvoiceReminders = async () => {
    setSendingReminders(true);
    await supabase.functions.invoke('send-push-notification', { body: { action: 'send-invoice-reminders' } });
    setSendingReminders(false);
    alert('Invoice reminders sent!');
  };

  const toggleStatus = (status: string) => {
    setAutoInvoice(prev => ({
      ...prev, trigger_statuses: prev.trigger_statuses.includes(status)
        ? prev.trigger_statuses.filter(s => s !== status) : [...prev.trigger_statuses, status]
    }));
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8"><Loader2 className="w-8 h-8 animate-spin text-[#1A8B06]" /></div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3"><Settings className="w-6 h-6 text-[#1A8B06]" /><h2 className="text-xl font-bold">Admin Settings</h2></div>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>

        <div className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><Bell className="w-5 h-5 text-purple-600" /><CardTitle className="text-lg">Push Notifications</CardTitle></div>
              <CardDescription>Browser notifications for customers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Enable Push Notifications</span>
                <Switch checked={pushSettings.enabled} onCheckedChange={v => setPushSettings(p => ({ ...p, enabled: v }))} />
              </div>
              {pushSettings.enabled && (
                <div className="space-y-3 pt-2 border-t">
                  {[['driver_nearby', 'Driver nearby (5 min)'], ['delivery_complete', 'Delivery complete'], ['invoice_reminders', 'Invoice reminders']].map(([k, l]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-sm">{l}</span>
                      <Switch checked={pushSettings[k as keyof typeof pushSettings] as boolean} onCheckedChange={v => setPushSettings(p => ({ ...p, [k]: v }))} />
                    </div>
                  ))}
                  <div className="pt-3 border-t">
                    <Button variant="outline" size="sm" onClick={sendInvoiceReminders} disabled={sendingReminders}>
                      {sendingReminders ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                      Send Invoice Reminders Now
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /><CardTitle className="text-lg">Auto-Invoice</CardTitle></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Enable Auto-Invoice</span>
                <Switch checked={autoInvoice.enabled} onCheckedChange={v => setAutoInvoice(p => ({ ...p, enabled: v }))} />
              </div>
              {autoInvoice.enabled && (
                <>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Trigger on:</p>
                    <div className="flex flex-wrap gap-2">
                      {['approved', 'scheduled', 'delivered', 'completed'].map(s => (
                        <Badge key={s} variant={autoInvoice.trigger_statuses.includes(s) ? 'default' : 'outline'}
                          className={`cursor-pointer ${autoInvoice.trigger_statuses.includes(s) ? 'bg-[#1A8B06]' : ''}`}
                          onClick={() => toggleStatus(s)}>{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /><span className="text-sm">Email invoice</span></div>
                    <Switch checked={autoInvoice.send_email} onCheckedChange={v => setAutoInvoice(p => ({ ...p, send_email: v }))} />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /><CardTitle className="text-lg">Review Requests</CardTitle></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Enable Review Requests</span>
                <Switch checked={reviewSettings.enabled} onCheckedChange={v => setReviewSettings(p => ({ ...p, enabled: v }))} />
              </div>
              {reviewSettings.enabled && (
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Send email request</span>
                    <Switch checked={reviewSettings.send_email} onCheckedChange={v => setReviewSettings(p => ({ ...p, send_email: v }))} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Send SMS request</span>
                    <Switch checked={reviewSettings.send_sms} onCheckedChange={v => setReviewSettings(p => ({ ...p, send_sms: v }))} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-green-600" /><CardTitle className="text-lg">SMS Notifications</CardTitle></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Enable SMS</span>
                <Switch checked={smsSettings.enabled} onCheckedChange={v => setSmsSettings(p => ({ ...p, enabled: v }))} />
              </div>
              {smsSettings.enabled && (
                <div className="space-y-3 pt-2 border-t text-sm">
                  <p className="font-medium text-gray-700">Delivery</p>
                  {[['delivery_scheduled', 'Scheduled'], ['delivery_on_way', 'On way'], ['delivery_complete', 'Complete']].map(([k, l]) => (
                    <div key={k} className="flex items-center justify-between"><span>{l}</span><Switch checked={smsSettings[k as keyof typeof smsSettings] as boolean} onCheckedChange={v => setSmsSettings(p => ({ ...p, [k]: v }))} /></div>
                  ))}
                  <p className="font-medium text-gray-700 pt-2">Pickup</p>
                  {[['pickup_scheduled', 'Scheduled'], ['pickup_on_way', 'On way'], ['pickup_complete', 'Complete']].map(([k, l]) => (
                    <div key={k} className="flex items-center justify-between"><span>{l}</span><Switch checked={smsSettings[k as keyof typeof smsSettings] as boolean} onCheckedChange={v => setSmsSettings(p => ({ ...p, [k]: v }))} /></div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#1A8B06] hover:bg-[#106203]">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : saved ? <Check className="w-4 h-4 mr-2" /> : null}
            {saved ? 'Saved!' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}

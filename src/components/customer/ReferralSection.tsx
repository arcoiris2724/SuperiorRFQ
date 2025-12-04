
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { Gift, Copy, Check, Users, DollarSign, Share2, Loader2, TrendingUp } from 'lucide-react';

interface ReferralInfo {
  referral_code: string;
  credit_balance: number;
  total_referrals: number;
  total_earned: number;
}

interface Transaction {
  id: string;
  transaction_type: string;
  amount: number;
  description: string;
  created_at: string;
}

interface ReferredCustomer {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface Props {
  customerId: string;
  customerName: string;
}

export default function ReferralSection({ customerId, customerName }: Props) {
  const [referral, setReferral] = useState<ReferralInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [referredCustomers, setReferredCustomers] = useState<ReferredCustomer[]>([]);
  const [bonusAmounts, setBonusAmounts] = useState({ referrer: 25, referee: 15 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    fetchReferralInfo();
  }, [customerId]);

  const fetchReferralInfo = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('customer-referrals', {
        body: { action: 'get-referral-info', customerId, customerName }
      });
      if (data?.referral) {
        setReferral(data.referral);
        setTransactions(data.transactions || []);
        setReferredCustomers(data.referredCustomers || []);
        setBonusAmounts(data.bonusAmounts || { referrer: 25, referee: 15 });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const copyCode = () => {
    if (referral) {
      navigator.clipboard.writeText(referral.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyLink = () => {
    if (referral) {
      const link = `${window.location.origin}/customer/login?ref=${referral.referral_code}`;
      navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Card><CardContent className="p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
      </CardContent></Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Referral Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Credit Balance', value: `$${referral?.credit_balance?.toFixed(2) || '0.00'}`, icon: DollarSign, color: 'bg-green-500' },
          { label: 'Total Referrals', value: referral?.total_referrals || 0, icon: Users, color: 'bg-blue-500' },
          { label: 'Total Earned', value: `$${referral?.total_earned?.toFixed(2) || '0.00'}`, icon: TrendingUp, color: 'bg-purple-500' },
          { label: 'You Give', value: `$${bonusAmounts.referee}`, icon: Gift, color: 'bg-orange-500' }
        ].map((stat, i) => (
          <Card key={i}><CardContent className="p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </CardContent></Card>
        ))}
      </div>

      {/* Referral Code Card */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader><CardTitle className="flex items-center gap-2"><Gift className="w-5 h-5 text-orange-500" /> Share & Earn</CardTitle></CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">Give friends <strong>${bonusAmounts.referee}</strong> off their first order. You'll get <strong>${bonusAmounts.referrer}</strong> in credits when they sign up!</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-sm text-gray-500 mb-1 block">Your Referral Code</label>
              <div className="flex gap-2">
                <Input value={referral?.referral_code || ''} readOnly className="font-mono text-lg font-bold bg-white" />
                <Button variant="outline" onClick={copyCode}>{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-500 mb-1 block">Share Link</label>
              <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={copyLink}>
                <Share2 className="w-4 h-4 mr-2" /> {linkCopied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {transactions.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.slice(0, 5).map(t => (
                <div key={t.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{t.description}</p>
                    <p className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-bold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referred Friends */}
      {referredCustomers.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-lg">Friends You've Referred</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {referredCustomers.map(c => (
                <div key={c.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-sm">{c.name?.charAt(0) || '?'}</span>
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

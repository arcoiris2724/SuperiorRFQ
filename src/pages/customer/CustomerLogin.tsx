
import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCustomer } from '@/contexts/CustomerContext';
import { supabase } from '@/lib/supabase';
import { Truck, ArrowLeft, Loader2, Gift, Check, X } from 'lucide-react';

export default function CustomerLogin() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ email: '', password: '', name: '', phone: '', referralCode: '' });
  const [referralValid, setReferralValid] = useState<boolean | null>(null);
  const [referralBonus, setReferralBonus] = useState(0);
  const [referrerName, setReferrerName] = useState('');
  const { login } = useCustomer();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      setSignupData(prev => ({ ...prev, referralCode: refCode }));
      validateReferralCode(refCode);
    }
  }, [searchParams]);

  const validateReferralCode = async (code: string) => {
    if (!code || code.length < 4) { setReferralValid(null); return; }
    try {
      const { data } = await supabase.functions.invoke('customer-referrals', {
        body: { action: 'validate-code', referralCode: code }
      });
      setReferralValid(data?.valid || false);
      setReferralBonus(data?.bonus || 0);
      setReferrerName(data?.referrerName || '');
    } catch { setReferralValid(false); }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-auth', {
        body: { action: 'login', ...loginData }
      });
      if (error || data?.error) throw new Error(data?.error || 'Login failed');
      login(data.customer);
      await supabase.functions.invoke('customer-quotes', {
        body: { action: 'link-quotes', customerId: data.customer.id, email: data.customer.email }
      });
      toast({ title: 'Welcome back!', description: `Logged in as ${data.customer.name}` });
      navigate('/customer/dashboard');
    } catch (err: any) {
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    } finally { setIsLoading(false); }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-auth', {
        body: { action: 'signup', ...signupData }
      });
      if (error || data?.error) throw new Error(data?.error || 'Signup failed');
      login(data.customer);
      await supabase.functions.invoke('customer-quotes', {
        body: { action: 'link-quotes', customerId: data.customer.id, email: data.customer.email }
      });
      const bonusMsg = data.referralBonus > 0 ? ` You received $${data.referralBonus} in credits!` : '';
      toast({ title: 'Account Created!', description: `Welcome to Dumpster Rental.${bonusMsg}` });
      navigate('/customer/dashboard');
    } catch (err: any) {
      toast({ title: 'Signup Failed', description: err.message, variant: 'destructive' });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Customer Portal</CardTitle>
            <CardDescription>Manage your quotes and deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={searchParams.get('ref') ? 'signup' : 'login'}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div><Label>Email</Label><Input type="email" required value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} /></div>
                  <div><Label>Password</Label><Input type="password" required value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} /></div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Login
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div><Label>Full Name</Label><Input required value={signupData.name} onChange={e => setSignupData({...signupData, name: e.target.value})} /></div>
                  <div><Label>Email</Label><Input type="email" required value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})} /></div>
                  <div><Label>Phone</Label><Input type="tel" value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})} /></div>
                  <div><Label>Password</Label><Input type="password" required minLength={6} value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})} /></div>
                  <div>
                    <Label className="flex items-center gap-1"><Gift className="w-4 h-4 text-orange-500" /> Referral Code (optional)</Label>
                    <div className="relative">
                      <Input placeholder="Enter code" value={signupData.referralCode} onChange={e => { setSignupData({...signupData, referralCode: e.target.value}); validateReferralCode(e.target.value); }} className={referralValid === true ? 'border-green-500 pr-10' : referralValid === false ? 'border-red-500 pr-10' : ''} />
                      {referralValid === true && <Check className="w-5 h-5 text-green-500 absolute right-3 top-2.5" />}
                      {referralValid === false && <X className="w-5 h-5 text-red-500 absolute right-3 top-2.5" />}
                    </div>
                    {referralValid && <p className="text-sm text-green-600 mt-1">You'll get ${referralBonus} credit from {referrerName}!</p>}
                  </div>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useQuote } from './QuoteContext';
import { paymentMethods, materials, locations, rentalPeriods } from '@/data/dumpsterData';
import { CheckCircle, Loader2, AlertCircle, Calendar, Copy, Check, Mail, Receipt, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import PhotoUpload from './PhotoUpload';
import { formatTaxRate } from '@/utils/taxCalculator';
import { useCustomer } from '@/contexts/CustomerContext';

const generateRefNumber = () => {
  const prefix = 'SW';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const PaymentStep: React.FC = () => {
  const { setPayment, quote, setStep, setContactInfo, setPhotos, resetQuote, getDurationModifier, getTaxInfo, setReferralDiscount } = useQuote();
  const { customer } = useCustomer();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [creditBalance, setCreditBalance] = useState(0);
  const [applyCredits, setApplyCredits] = useState(false);

  const taxInfo = getTaxInfo();
  const locationData = locations.find(l => l.id === quote.location);
  const materialData = materials.find(m => m.id === quote.material);
  const paymentData = paymentMethods.find(p => p.id === quote.payment);
  const durationData = rentalPeriods.find(d => d.id === quote.rentalPeriod);

  useEffect(() => {
    if (customer) {
      setName(customer.name || '');
      setEmail(customer.email || '');
      setPhone(customer.phone || '');
      fetchCredits();
    }
  }, [customer]);

  const fetchCredits = async () => {
    if (!customer) return;
    try {
      const { data } = await supabase.functions.invoke('customer-referrals', {
        body: { action: 'get-referral-info', customerId: customer.id, customerName: customer.name }
      });
      setCreditBalance(data?.referral?.credit_balance || 0);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (applyCredits && creditBalance > 0) {
      setReferralDiscount(creditBalance);
    } else {
      setReferralDiscount(0);
    }
  }, [applyCredits, creditBalance]);

  const copyRef = () => {
    navigator.clipboard.writeText(refNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const ref = generateRefNumber();

    try {
      const discountAmount = applyCredits ? Math.min(creditBalance, taxInfo?.total || 0) : 0;
      const { error: dbError } = await supabase.from('quotes').insert({
        reference_number: ref, location: locationData?.name || quote.location,
        material: materialData?.name || quote.material, size: quote.size,
        rental_period: durationData?.name || '7 Days', rental_days: durationData?.days || 7,
        payment_method: paymentData?.name || quote.payment, customer_name: name,
        customer_email: email, customer_phone: phone, 
        base_price: taxInfo?.subtotal || 0,
        duration_modifier: getDurationModifier(), 
        tax_amount: taxInfo?.tax || 0,
        tax_rate: taxInfo?.taxRate || 0,
        county: taxInfo?.countyName || 'Unknown',
        total_price: taxInfo?.total || 0, 
        referral_discount: discountAmount,
        status: 'pending',
        photos: quote.photos,
        customer_id: customer?.id || null
      });
      if (dbError) throw dbError;

      // Use credits if applied
      if (discountAmount > 0 && customer) {
        await supabase.functions.invoke('customer-referrals', {
          body: { action: 'use-credits', customerId: customer.id, amount: discountAmount }
        });
      }

      const { error: emailError } = await supabase.functions.invoke('send-quote-email', {
        body: {
          referenceNumber: ref, customerName: name, customerEmail: email, customerPhone: phone,
          location: locationData?.name || quote.location, material: materialData?.name || quote.material,
          size: quote.size, rentalPeriod: durationData?.name || '7 Days', rentalDays: durationData?.days || 7,
          paymentMethod: paymentData?.name || quote.payment, 
          basePrice: taxInfo?.subtotal || 0, 
          durationModifier: getDurationModifier(),
          taxAmount: taxInfo?.tax || 0, taxRate: taxInfo?.taxRate || 0,
          county: taxInfo?.countyName || 'Unknown',
          totalPrice: taxInfo?.total || 0, 
          referralDiscount: discountAmount,
          photos: quote.photos
        }
      });
      setEmailSent(!emailError);
      setRefNumber(ref);
      setContactInfo(name, email, phone);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit quote. Please try again.');
    } finally { setLoading(false); }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-[#2DB742] mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[#1A8B06] mb-2">Quote Submitted!</h3>
        <p className="text-gray-600 mb-2">Thank you, {name}! We'll contact you shortly.</p>
        {emailSent && <p className="text-sm text-green-600 flex items-center justify-center gap-1 mb-4"><Mail className="w-4 h-4" /> Confirmation email sent to {email}</p>}
        <div className="bg-[#1A8B06] text-white rounded-lg p-4 mb-4 max-w-sm mx-auto">
          <p className="text-sm opacity-80 mb-1">Your Reference Number</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl font-mono font-bold">{refNumber}</span>
            <button onClick={copyRef} className="p-1 hover:bg-white/20 rounded">{copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}</button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <a href="/track" className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800">Track Your Quote</a>
          <button onClick={resetQuote} className="px-6 py-3 bg-[#1A8B06] text-white rounded-lg hover:bg-[#106203]">Get Another Quote</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Select Payment Method</h3>
      <div className="space-y-3 mb-6">
        {paymentMethods.map((pm) => (
          <button key={pm.id} onClick={() => setPayment(pm.id)}
            className={`w-full p-4 border-2 rounded-lg text-left transition-all hover:border-[#2DB742] ${quote.payment === pm.id ? 'border-[#1A8B06] bg-green-50' : 'border-gray-200 bg-white'}`}>
            <div className="font-semibold text-[#106203]">{pm.name}</div>
            <div className="text-sm text-gray-500">{pm.description}</div>
          </button>
        ))}
      </div>
      <button onClick={() => setStep(4)} className="mb-6 px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">Back</button>

      {quote.payment && taxInfo && (
        <div className="border-2 border-[#2DB742] rounded-lg p-6 bg-green-50">
          <h4 className="text-xl font-bold text-[#106203] mb-4">Your Quote</h4>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-[#1A8B06]">Size:</span><span>{quote.size} Yard</span></div>
            <div className="flex justify-between"><span className="text-[#1A8B06]">Duration:</span><span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{durationData?.name}</span></div>
          </div>
          <div className="border-t border-[#2DB742] pt-3 space-y-2 mb-4">
            <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span><span className="font-medium">${taxInfo.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-600 flex items-center gap-1"><Receipt className="w-3 h-3" />Sales Tax ({formatTaxRate(taxInfo.taxRate)}):</span><span className="font-medium">${taxInfo.tax.toFixed(2)}</span></div>
            <div className="text-xs text-gray-500 italic">{taxInfo.countyName}</div>
            {creditBalance > 0 && (
              <div className="flex items-center justify-between bg-orange-50 p-2 rounded border border-orange-200">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={applyCredits} onChange={e => setApplyCredits(e.target.checked)} className="rounded" />
                  <Gift className="w-4 h-4 text-orange-500" />
                  <span>Apply ${creditBalance.toFixed(2)} referral credits</span>
                </label>
              </div>
            )}
            {taxInfo.referralDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600"><span>Referral Discount:</span><span>-${taxInfo.referralDiscount.toFixed(2)}</span></div>
            )}
          </div>
          <div className="border-t border-[#2DB742] pt-3 flex justify-between items-center mb-6">
            <span className="font-bold text-lg">Total:</span>
            <span className="text-2xl font-bold text-[#1A8B06]">${taxInfo.total.toFixed(2)}</span>
          </div>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"><AlertCircle className="w-5 h-5" /><span>{error}</span></div>}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" required placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-lg" disabled={loading} />
            <input type="email" required placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" disabled={loading} />
            <input type="tel" required placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 border rounded-lg" disabled={loading} />
            <div className="pt-2"><PhotoUpload photos={quote.photos} onPhotosChange={setPhotos} maxPhotos={5} /></div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-[#1A8B06] text-white font-semibold rounded-lg hover:bg-[#106203] disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Submit Quote Request'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

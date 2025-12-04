import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Truck, Lock } from 'lucide-react';

export default function DriverLogin() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data, error: err } = await supabase.functions.invoke('driver-auth', {
      body: { action: 'login', pin }
    });

    setLoading(false);

    if (data?.success) {
      localStorage.setItem('driverToken', data.token);
      navigate('/driver/dashboard');
    } else {
      setError(err?.message || data?.error || 'Invalid PIN');
    }
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) setPin(pin + digit);
  };

  const handleBackspace = () => setPin(pin.slice(0, -1));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A8B06] to-[#106203] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Truck className="w-10 h-10 text-[#1A8B06]" />
          </div>
          <h1 className="text-3xl font-bold text-white">Driver Portal</h1>
          <p className="text-white/80 mt-2">Enter your PIN to view today's route</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
                pin.length > i ? 'border-[#1A8B06] bg-[#1A8B06]/10' : 'border-gray-300'
              }`}>
                {pin.length > i ? '●' : ''}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center mb-4 font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 mb-4">
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((digit) => (
              <Button key={digit} type="button" variant="outline"
                className={`h-16 text-2xl font-bold ${digit === '' ? 'invisible' : ''}`}
                onClick={() => digit === '⌫' ? handleBackspace() : handlePinInput(digit)}
                disabled={digit === ''}>
                {digit}
              </Button>
            ))}
          </div>

          <Button type="submit" disabled={pin.length !== 4 || loading}
            className="w-full h-14 text-lg font-bold bg-[#1A8B06] hover:bg-[#106203]">
            {loading ? 'Verifying...' : 'Start Route'}
          </Button>
        </form>

        <p className="text-center text-white/60 text-sm mt-6">
          Superior Waste Services © 2024
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useQuote } from './QuoteContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone } from 'lucide-react';
import PhotoUpload from './PhotoUpload';

const ContactStep: React.FC = () => {
  const { quote, setContactInfo, setPhotos, setStep } = useQuote();
  const [name, setName] = useState(quote.name);
  const [email, setEmail] = useState(quote.email);
  const [phone, setPhone] = useState(quote.phone);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email';
    if (!phone.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) newErrors.phone = 'Enter 10-digit phone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      setContactInfo(name, email, phone);
      setStep(6);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
        <p className="text-gray-600 mt-2">We'll use this to send your quote and coordinate delivery</p>
      </div>

      <div className="max-w-md mx-auto space-y-5">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Full Name
          </Label>
          <Input
            id="name"
            placeholder="John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mt-2 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" /> Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(516) 555-1234"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`mt-2 ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div className="pt-4 border-t">
          <PhotoUpload photos={quote.photos} onPhotosChange={setPhotos} maxPhotos={5} />
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => setStep(4)} size="lg">Back</Button>
        <Button onClick={handleContinue} size="lg" className="px-8">Review Quote</Button>
      </div>
    </div>
  );
};

export default ContactStep;

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { pricing } from '@/data/pricingData';
import { rentalPeriods } from '@/data/dumpsterData';
import { detectCounty, calculateTax, CountyType } from '@/utils/taxCalculator';

interface AddressData {
  address: string;
  lat: number;
  lng: number;
  components: Record<string, string>;
}

interface TaxInfo {
  subtotal: number;
  tax: number;
  taxRate: number;
  countyName: string;
  total: number;
  referralDiscount: number;
}

interface QuoteState {
  step: number;
  location: string | null;
  material: string | null;
  size: string | null;
  rentalPeriod: string | null;
  payment: string | null;
  name: string;
  email: string;
  phone: string;
  photos: string[];
  deliveryAddress: AddressData | null;
  referralDiscount: number;
}

interface QuoteContextType {
  quote: QuoteState;
  setStep: (step: number) => void;
  setLocation: (location: string) => void;
  setMaterial: (material: string) => void;
  setSize: (size: string) => void;
  setRentalPeriod: (period: string) => void;
  setPayment: (payment: string) => void;
  setContactInfo: (name: string, email: string, phone: string) => void;
  setPhotos: (photos: string[]) => void;
  setDeliveryAddress: (address: AddressData | null) => void;
  setReferralDiscount: (amount: number) => void;
  resetQuote: () => void;
  getPrice: () => number | null;
  getDurationModifier: () => number;
  getCounty: () => CountyType;
  getTaxInfo: () => TaxInfo | null;
  nextStep: () => void;
  prevStep: () => void;
}

const initialState: QuoteState = {
  step: 1,
  location: null,
  material: null,
  size: null,
  rentalPeriod: '7-day',
  payment: null,
  name: '',
  email: '',
  phone: '',
  photos: [],
  deliveryAddress: null,
  referralDiscount: 0
};

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuote = () => {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuote must be used within QuoteProvider');
  return context;
};

export const QuoteProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quote, setQuote] = useState<QuoteState>(initialState);

  const setStep = (step: number) => setQuote(prev => ({ ...prev, step }));
  const setLocation = (location: string) => setQuote(prev => ({ ...prev, location, step: 2 }));
  const setMaterial = (material: string) => setQuote(prev => ({ ...prev, material, step: 3 }));
  const setSize = (size: string) => setQuote(prev => ({ ...prev, size, step: 4 }));
  const setRentalPeriod = (rentalPeriod: string) => setQuote(prev => ({ ...prev, rentalPeriod }));
  const setPayment = (payment: string) => setQuote(prev => ({ ...prev, payment }));
  const setContactInfo = (name: string, email: string, phone: string) => 
    setQuote(prev => ({ ...prev, name, email, phone }));
  const setPhotos = (photos: string[]) => setQuote(prev => ({ ...prev, photos }));
  const setDeliveryAddress = (deliveryAddress: AddressData | null) => 
    setQuote(prev => ({ ...prev, deliveryAddress }));
  const setReferralDiscount = (referralDiscount: number) => 
    setQuote(prev => ({ ...prev, referralDiscount }));
  const resetQuote = () => setQuote(initialState);
  const nextStep = () => setQuote(prev => ({ ...prev, step: Math.min(prev.step + 1, 6) }));
  const prevStep = () => setQuote(prev => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

  const getDurationModifier = (): number => {
    const period = rentalPeriods.find(p => p.id === quote.rentalPeriod);
    return period?.priceModifier || 0;
  };

  const getPrice = (): number | null => {
    const { location, material, size, payment } = quote;
    if (!location || !material || !size || !payment) return null;
    try {
      const basePrice = pricing[location]?.[material]?.[size]?.[payment] || null;
      if (basePrice === null) return null;
      return basePrice + getDurationModifier();
    } catch { return null; }
  };

  const getCounty = (): CountyType => detectCounty(quote.deliveryAddress?.components);

  const getTaxInfo = (): TaxInfo | null => {
    const subtotal = getPrice();
    if (subtotal === null) return null;
    const county = getCounty();
    const { tax, rate, countyName } = calculateTax(subtotal, county);
    const discount = Math.min(quote.referralDiscount, subtotal + tax);
    return { subtotal, tax, taxRate: rate, countyName, total: subtotal + tax - discount, referralDiscount: discount };
  };

  return (
    <QuoteContext.Provider value={{
      quote, setStep, setLocation, setMaterial, setSize, setRentalPeriod, setPayment,
      setContactInfo, setPhotos, setDeliveryAddress, setReferralDiscount, resetQuote, 
      getPrice, getDurationModifier, getCounty, getTaxInfo, nextStep, prevStep
    }}>
      {children}
    </QuoteContext.Provider>
  );
};

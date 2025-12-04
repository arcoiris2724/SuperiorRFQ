// NY Sales Tax Rates for Nassau and Suffolk Counties
export const TAX_RATES = {
  nassau: {
    name: 'Nassau County',
    stateRate: 0.04,      // 4.00%
    localRate: 0.04875,   // 4.875%
    totalRate: 0.08875    // 8.875%
  },
  suffolk: {
    name: 'Suffolk County',
    stateRate: 0.04,      // 4.00%
    localRate: 0.0475,    // 4.75%
    totalRate: 0.0875     // 8.75%
  }
};

export type CountyType = 'nassau' | 'suffolk' | null;

export const detectCounty = (addressComponents: Record<string, string> | undefined): CountyType => {
  if (!addressComponents) return null;
  
  // Check administrative_area_level_2 (county) from Google Places
  const county = addressComponents['administrative_area_level_2']?.toLowerCase() || '';
  const fullAddress = Object.values(addressComponents).join(' ').toLowerCase();
  
  if (county.includes('nassau') || fullAddress.includes('nassau')) {
    return 'nassau';
  }
  if (county.includes('suffolk') || fullAddress.includes('suffolk')) {
    return 'suffolk';
  }
  
  return null;
};

export const calculateTax = (subtotal: number, county: CountyType): { tax: number; rate: number; countyName: string } => {
  if (!county) {
    // Default to Suffolk if county can't be determined
    return {
      tax: subtotal * TAX_RATES.suffolk.totalRate,
      rate: TAX_RATES.suffolk.totalRate,
      countyName: 'Suffolk County (default)'
    };
  }
  
  const taxInfo = TAX_RATES[county];
  return {
    tax: subtotal * taxInfo.totalRate,
    rate: taxInfo.totalRate,
    countyName: taxInfo.name
  };
};

export const formatTaxRate = (rate: number): string => {
  return `${(rate * 100).toFixed(3)}%`;
};

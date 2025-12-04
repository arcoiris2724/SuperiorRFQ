export const locations = [
  { id: 'nassau-suffolk', name: 'Nassau/Suffolk County', description: 'Main service area' },
  { id: 'east-riverhead', name: 'East of Riverhead', description: 'Extended service area' }
];

export const materials = [
  { id: 'construction-demo', name: 'Construction Demo', sizes: ['5', '10', '15', '20', '30', '40'] },
  { id: 'clean-concrete', name: 'Clean Concrete', sizes: ['10', '15', '20'] },
  { id: 'clean-dirt', name: 'Clean Dirt', sizes: ['10', '15', '20'] },
  { id: 'clean-brick', name: 'Clean Brick Only', sizes: ['5', '10', '15', '20'] },
  { id: 'asphalt', name: 'Asphalt Only', sizes: ['5', '10', '15', '20'] },
  { id: 'trees-brush', name: 'Trees/Brush Only', sizes: ['10', '15', '20', '30', '40'] },
  { id: 'mixed', name: 'Mixed Asph/Conc/Dirt/Brick', sizes: ['5', '10', '15', '20'] }
];

export const rentalPeriods = [
  { id: '3-day', name: '3 Days', days: 3, priceModifier: -25 },
  { id: '7-day', name: '7 Days', days: 7, priceModifier: 0 },
  { id: '14-day', name: '14 Days', days: 14, priceModifier: 50 },
  { id: '30-day', name: '30 Days', days: 30, priceModifier: 125 }
];

export const paymentMethods = [
  { id: 'cash', name: 'Cash', description: 'Best price' },
  { id: 'debit', name: 'Debit Card', description: 'Includes tax' },
  { id: 'credit', name: 'Credit Card', description: 'Includes tax + processing' }
];

export const logoUrl = 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764690675656_c710e04c.jpg';

export const contactInfo = {
  phone: '631-580-5800',
  email: 'RFQ@superiorwaste.com',
  address: '442 Tate Street, Holbrook NY 11741'
};

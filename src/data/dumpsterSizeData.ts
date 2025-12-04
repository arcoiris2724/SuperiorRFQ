export interface DumpsterSize {
  id: string;
  name: string;
  yards: number;
  image: string;
  dimensions: string;
  weightLimit: string;
  idealFor: string[];
  fitsItems: string[];
  basePrice: number;
  truckLoads: string;
}

export const dumpsterSizes: DumpsterSize[] = [
  {
    id: '5-yard',
    name: '5 Yard Dumpster',
    yards: 5,
    image: 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763250702_cd6b1483.png',
    dimensions: "6' L x 4' W x 3' H",
    weightLimit: '1 ton (2,000 lbs)',
    idealFor: ['Small bathroom remodel', 'Garage cleanout', 'Small landscaping'],
    fitsItems: ['20 trash bags', '1 room of furniture', 'Small appliances'],
    basePrice: 295,
    truckLoads: '1-2 pickup truck loads'
  },
  {
    id: '10-yard',
    name: '10 Yard Dumpster',
    yards: 10,
    image: 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763250702_cd6b1483.png',
    dimensions: "11' L x 8' W x 2' H",
    weightLimit: '2 tons (4,000 lbs)',
    idealFor: ['Kitchen remodel', 'Basement cleanout', 'Deck removal'],
    fitsItems: ['40 trash bags', '2-3 rooms of furniture', 'Small deck debris'],
    basePrice: 395,
    truckLoads: '3-4 pickup truck loads'
  },
  {
    id: '15-yard',
    name: '15 Yard Dumpster',
    yards: 15,
    image: 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763275846_e510c5fc.png',
    dimensions: "11' L x 8' W x 4' H",
    weightLimit: '3 tons (6,000 lbs)',
    idealFor: ['Large room renovation', 'Roof tear-off (up to 1,500 sq ft)', 'Estate cleanout'],
    fitsItems: ['60 trash bags', '4-5 rooms of furniture', 'Medium construction debris'],
    basePrice: 450,
    truckLoads: '5-6 pickup truck loads'
  }
];

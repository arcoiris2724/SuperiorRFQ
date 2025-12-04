import { DumpsterSize } from './dumpsterSizeData';

export const largeDumpsterSizes: DumpsterSize[] = [
  {
    id: '20-yard',
    name: '20 Yard Dumpster',
    yards: 20,
    image: 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763296038_5ec263dc.png',
    dimensions: "22' L x 8' W x 4' H",
    weightLimit: '4 tons (8,000 lbs)',
    idealFor: ['Full home cleanout', 'Medium construction project', 'Roof replacement'],
    fitsItems: ['80 trash bags', 'Full house furniture', 'Large appliances'],
    basePrice: 525,
    truckLoads: '7-8 pickup truck loads'
  },
  {
    id: '30-yard',
    name: '30 Yard Dumpster',
    yards: 30,
    image: 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763313403_24c24105.png',
    dimensions: "22' L x 8' W x 6' H",
    weightLimit: '5 tons (10,000 lbs)',
    idealFor: ['New construction', 'Major renovation', 'Commercial cleanout'],
    fitsItems: ['120 trash bags', 'Multiple rooms of demo debris', 'Large landscaping projects'],
    basePrice: 625,
    truckLoads: '10-12 pickup truck loads'
  },
  {
    id: '40-yard',
    name: '40 Yard Dumpster',
    yards: 40,
    image: 'https://d64gsuwffb70l.cloudfront.net/6917af11eb66b8b0c2b0bc86_1764763333996_c92ac688.png',
    dimensions: "24' L x 8' W x 8' H",
    weightLimit: '6 tons (12,000 lbs)',
    idealFor: ['Large commercial projects', 'Major demolition', 'Industrial cleanout'],
    fitsItems: ['160+ trash bags', 'Entire building demo', 'Large-scale construction waste'],
    basePrice: 750,
    truckLoads: '15+ pickup truck loads'
  }
];

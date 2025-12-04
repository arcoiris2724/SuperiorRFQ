// Complete pricing: [location][material][size][payment]
export const pricing: Record<string, Record<string, Record<string, Record<string, number>>>> = {
  'nassau-suffolk': {
    'construction-demo': {
      '5': { cash: 425, debit: 461.66, credit: 475.46 },
      '10': { cash: 440, debit: 477.95, credit: 492.24 },
      '15': { cash: 540, debit: 586.58, credit: 604.12 },
      '20': { cash: 660, debit: 716.93, credit: 738.37 },
      '30': { cash: 760, debit: 825.55, credit: 850.23 },
      '40': { cash: 1000, debit: 1086.25, credit: 1118.73 }
    },
    'clean-concrete': {
      '10': { cash: 600, debit: 651.75, credit: 671.24 },
      '15': { cash: 675, debit: 733.22, credit: 755.14 },
      '20': { cash: 800, debit: 869.00, credit: 894.98 }
    },
    'clean-dirt': {
      '10': { cash: 750, debit: 814.69, credit: 839.05 },
      '15': { cash: 850, debit: 923.32, credit: 950.93 },
      '20': { cash: 1200, debit: 1303.50, credit: 1342.47 }
    },
    'clean-brick': {
      '5': { cash: 575, debit: 624.60, credit: 643.28 },
      '10': { cash: 825, debit: 896.16, credit: 922.96 },
      '15': { cash: 1075, debit: 1167.72, credit: 1202.63 },
      '20': { cash: 1625, debit: 1765.16, credit: 1817.94 }
    },
    'asphalt': {
      '5': { cash: 650, debit: 706.07, credit: 727.18 },
      '10': { cash: 750, debit: 814.69, credit: 839.05 },
      '15': { cash: 1075, debit: 1167.72, credit: 1202.63 },
      '20': { cash: 1400, debit: 1520.75, credit: 1566.22 }
    },
    'trees-brush': {
      '10': { cash: 525, debit: 570.29, credit: 587.34 },
      '15': { cash: 625, debit: 678.91, credit: 699.21 },
      '20': { cash: 725, debit: 787.54, credit: 811.09 },
      '30': { cash: 925, debit: 1004.79, credit: 1034.83 },
      '40': { cash: 1200, debit: 1303.50, credit: 1342.47 }
    },
    'mixed': {
      '5': { cash: 650, debit: 706.07, credit: 727.18 },
      '10': { cash: 975, debit: 1059.10, credit: 1090.77 },
      '15': { cash: 1300, debit: 1412.13, credit: 1454.35 },
      '20': { cash: 1625, debit: 1765.16, credit: 1817.94 }
    }
  },
  'east-riverhead': {
    'construction-demo': {
      '5': { cash: 475, debit: 515.97, credit: 531.40 },
      '10': { cash: 490, debit: 532.26, credit: 548.18 },
      '15': { cash: 590, debit: 640.89, credit: 660.05 },
      '20': { cash: 700, debit: 760.38, credit: 783.12 },
      '30': { cash: 810, debit: 879.86, credit: 906.18 },
      '40': { cash: 1050, debit: 1140.56, credit: 1174.67 }
    },
    'clean-concrete': {
      '10': { cash: 625, debit: 678.91, credit: 699.21 },
      '15': { cash: 700, debit: 760.38, credit: 783.12 },
      '20': { cash: 825, debit: 896.16, credit: 922.95 }
    },
    'clean-dirt': {
      '10': { cash: 775, debit: 841.45, credit: 866.61 },
      '15': { cash: 875, debit: 950.47, credit: 978.89 },
      '20': { cash: 1300, debit: 1412.13, credit: 1454.35 }
    },
    'clean-brick': {
      '5': { cash: 625, debit: 678.91, credit: 699.21 },
      '10': { cash: 875, debit: 950.47, credit: 978.89 },
      '15': { cash: 1125, debit: 1222.04, credit: 1258.58 },
      '20': { cash: 1725, debit: 1873.78, credit: 1929.81 }
    },
    'asphalt': {
      '5': { cash: 675, debit: 733.22, credit: 755.14 },
      '10': { cash: 775, debit: 841.84, credit: 867.01 },
      '15': { cash: 1125, debit: 1222.03, credit: 1258.57 },
      '20': { cash: 1500, debit: 1629.38, credit: 1678.10 }
    },
    'trees-brush': {
      '10': { cash: 575, debit: 624.60, credit: 643.28 },
      '15': { cash: 675, debit: 733.22, credit: 755.14 },
      '20': { cash: 775, debit: 841.85, credit: 867.02 },
      '30': { cash: 975, debit: 1059.10, credit: 1090.77 },
      '40': { cash: 1250, debit: 1357.82, credit: 1398.42 }
    },
    'mixed': {
      '5': { cash: 700, debit: 760.38, credit: 783.12 },
      '10': { cash: 1025, debit: 1113.41, credit: 1146.70 },
      '15': { cash: 1350, debit: 1466.44, credit: 1510.29 },
      '20': { cash: 1675, debit: 1819.47, credit: 1873.87 }
    }
  }
};

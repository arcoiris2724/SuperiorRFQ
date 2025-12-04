export interface FAQItem {
  q: string;
  a: string;
  category?: string;
}

export const faqs: FAQItem[] = [
  {
    q: 'How much does it cost to rent a dumpster?',
    a: 'The cost of renting a dumpster varies based on factors such as the size of the dumpster, the type of debris, the weight of the debris, and the rental period. For an accurate quote, please contact us directly or use our RFQ page.',
    category: 'Pricing'
  },
  {
    q: 'What sizes of dumpsters are available?',
    a: 'We offer a range of dumpster sizes to suit different projects, including 5-yard, 10-yard, 15-yard, 20-yard, 30-yard, and 40-yard dumpsters. Our team can help you choose the right size based on your specific needs.',
    category: 'Sizes'
  },
  {
    q: 'How do I know what size dumpster I need?',
    a: 'Choosing the right dumpster size depends on the scope of your project. For smaller cleanouts or remodeling jobs, a 5-yard or 10-yard dumpster may suffice. Larger projects like major renovations or construction may require a 30-yard or 40-yard dumpster.',
    category: 'Sizes'
  },
  {
    q: 'How long can I keep the dumpster?',
    a: 'The rental period for our dumpsters typically ranges from 7 to 10 days. If you need the dumpster for a longer period, please let us know, and we can arrange an extended rental.',
    category: 'Rental'
  },
  {
    q: 'How much do you charge to extend the rental?',
    a: 'The roll-off rental comes with a seven to ten day window. If you need one extra day, reach out and we\'ll do our best to accommodate you. For a few extra days, we charge $50 – $100 per week depending on the dumpster size.',
    category: 'Pricing'
  },
  {
    q: 'Is there a fee if I go over my weight limit?',
    a: 'Yes, we charge $115 per ton over the allotted weight limit.',
    category: 'Pricing'
  },
  {
    q: 'What can I put in the dumpster?',
    a: 'You can dispose of most household and construction debris in our dumpsters. However, hazardous materials such as chemicals, paint, batteries, and certain electronics are not allowed. Please contact us for a complete list of prohibited items.',
    category: 'Materials'
  },
  {
    q: 'What types of materials does SWS accept?',
    a: 'We handle a wide range of materials from Mattresses, to Roof Shingles, Concrete Debris to Soil and Electronic Equipment. Contact us for information about unacceptable materials.',
    category: 'Materials'
  }
];

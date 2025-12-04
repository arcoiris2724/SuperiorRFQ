import React from 'react';
import { Truck, Clock, DollarSign, Recycle, Phone, Shield, MapPin, Star } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Same-day and next-day delivery available throughout Long Island'
  },
  {
    icon: DollarSign,
    title: 'Transparent Pricing',
    description: 'No hidden fees. Your quote includes delivery, pickup, and disposal'
  },
  {
    icon: Clock,
    title: 'Flexible Rentals',
    description: 'Keep your dumpster from 3 to 30 days based on your project needs'
  },
  {
    icon: Recycle,
    title: 'Eco-Friendly',
    description: 'We sort and recycle materials to minimize landfill impact'
  },
  {
    icon: MapPin,
    title: 'Local Service',
    description: 'Family-owned business serving Nassau & Suffolk for 18+ years'
  },
  {
    icon: Shield,
    title: 'Fully Licensed',
    description: 'Licensed, bonded, and insured for your complete protection'
  },
  {
    icon: Phone,
    title: '24/7 Support',
    description: 'Our team is always available to help with your rental needs'
  },
  {
    icon: Star,
    title: '5-Star Rated',
    description: 'Over 2,000 satisfied customers and counting'
  }
];

const Features: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Island Dumpsters?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We make dumpster rental easy with reliable service and competitive pricing
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

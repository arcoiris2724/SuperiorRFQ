import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqs } from '@/data/faqData';
import { morefaqs } from '@/data/faqDataMore';

const allFaqs = [...faqs, ...morefaqs];
const categories = ['All', 'Pricing', 'Sizes', 'Rental', 'Materials', 'Delivery', 'Services', 'General'];

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  
  const filteredFaqs = activeCategory === 'All' 
    ? allFaqs 
    : allFaqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            Everything you need to know about our dumpster rental service
          </p>
          <p className="text-gray-500">
            Can't find an answer? Email us at <a href="mailto:rfq@superiorwaste.com" className="text-green-600 hover:underline font-medium">rfq@superiorwaste.com</a>
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-green-50 border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <Accordion type="single" collapsible className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white rounded-lg border px-6 shadow-sm"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center bg-green-50 rounded-xl p-8 border border-green-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">First Time Customer?</h3>
          <p className="text-gray-600 mb-4">Get $1 off per yard on your first rental!</p>
          <p className="text-sm text-gray-500">Add "1st Time" note in your quote request</p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

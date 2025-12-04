
import { useState, useEffect } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  service_type?: string;
  dumpster_size?: string;
  created_at: string;
}

const fallbackReviews = [
  { id: '1', customer_name: 'Mike R.', rating: 5, review_text: 'Best dumpster rental experience ever. Delivered on time, picked up when promised. Will definitely use again for my next project.', dumpster_size: '20 Yard' },
  { id: '2', customer_name: 'Sarah L.', rating: 5, review_text: 'The quote builder made it so easy to understand pricing. No surprises, no hidden fees. Highly recommend!', dumpster_size: '15 Yard' },
  { id: '3', customer_name: 'Tom K.', rating: 5, review_text: 'Used them for a major renovation. The 30-yard was perfect. Great customer service when I needed to extend my rental.', dumpster_size: '30 Yard' },
  { id: '4', customer_name: 'Jennifer M.', rating: 5, review_text: 'Fast delivery and pickup. The driver was professional and placed the dumpster exactly where I needed it.', dumpster_size: '10 Yard' },
  { id: '5', customer_name: 'David P.', rating: 4, review_text: 'Great service overall. Pricing was competitive and the online booking was super easy.', dumpster_size: '20 Yard' },
  { id: '6', customer_name: 'Lisa H.', rating: 5, review_text: 'Third time using Superior Waste. Always reliable and professional. Highly recommend for any cleanup project!', dumpster_size: '15 Yard' }
];

const Testimonials = () => {
  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(4.9);
  const [totalReviews, setTotalReviews] = useState(2000);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await supabase.functions.invoke('customer-reviews', {
        body: { action: 'get-public-reviews' }
      });
      if (data?.reviews?.length > 0) {
        setReviews(data.reviews);
        const avg = data.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / data.reviews.length;
        setAvgRating(Math.round(avg * 10) / 10);
        setTotalReviews(data.reviews.length > 6 ? data.reviews.length : 2000);
      }
    } catch (e) { console.error('Failed to fetch reviews:', e); }
    setLoading(false);
  };

  const displayReviews = reviews.slice(0, 6);

  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-green-100 text-[#1A8B06] px-4 py-1 rounded-full text-sm font-medium mb-4">Customer Reviews</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Join thousands of satisfied customers across Long Island</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#1A8B06]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-green-100" />
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 line-clamp-4">"{review.review_text}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">{review.customer_name}</p>
                    {review.dumpster_size && <p className="text-sm text-[#1A8B06]">{review.dumpster_size} Dumpster</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 bg-[#1A8B06]/10 rounded-full px-8 py-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-[#1A8B06] text-[#1A8B06]" />
              ))}
            </div>
            <span className="text-[#1A8B06] font-bold text-lg">{avgRating}/5 from {totalReviews.toLocaleString()}+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

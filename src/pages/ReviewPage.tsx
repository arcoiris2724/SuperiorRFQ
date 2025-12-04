
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Star, Loader2, CheckCircle, AlertCircle, Truck } from 'lucide-react';

export default function ReviewPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (!token) { setError('Invalid review link'); setLoading(false); }
    else setLoading(false);
  }, [token]);

  const handleSubmit = async () => {
    if (rating === 0) { setError('Please select a rating'); return; }
    setSubmitting(true); setError('');
    
    const { data, error: submitError } = await supabase.functions.invoke('customer-reviews', {
      body: { action: 'submit-review', token, rating, review_text: reviewText }
    });

    if (submitError || data?.error) {
      setError(data?.error || 'Failed to submit review');
      setSubmitting(false);
    } else {
      setSubmitted(true);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[#1A8B06]" />
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="pt-8 pb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your review has been submitted successfully. We appreciate your feedback!</p>
          <Button onClick={() => navigate('/')} className="bg-[#1A8B06] hover:bg-[#106203]">Return Home</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#1A8B06] text-white px-4 py-2 rounded-full mb-4">
            <Truck className="w-5 h-5" /><span className="font-semibold">Superior Waste</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">How was your experience?</h1>
          <p className="text-gray-600 mt-2">Your feedback helps us improve our service</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>Rate your dumpster rental experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Your Rating</label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110">
                    <Star className={`w-10 h-10 ${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {rating === 1 && 'Poor'}{rating === 2 && 'Fair'}{rating === 3 && 'Good'}{rating === 4 && 'Very Good'}{rating === 5 && 'Excellent'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review (Optional)</label>
              <Textarea placeholder="Tell us about your experience..." value={reviewText}
                onChange={(e) => setReviewText(e.target.value)} rows={4} />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5" /><span className="text-sm">{error}</span>
              </div>
            )}

            <Button onClick={handleSubmit} disabled={submitting} className="w-full bg-[#1A8B06] hover:bg-[#106203]">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting...</> : 'Submit Review'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

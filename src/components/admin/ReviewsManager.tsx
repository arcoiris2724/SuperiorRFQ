
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Loader2, Check, X, Eye, EyeOff, Award, RefreshCw } from 'lucide-react';

interface Review {
  id: string;
  customer_name: string;
  customer_email: string;
  rating: number;
  review_text: string;
  dumpster_size: string;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function ReviewsManager({ onClose }: { onClose: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase.functions.invoke('customer-reviews', { body: { action: 'get-all-reviews' } });
    if (data?.reviews) setReviews(data.reviews);
    setLoading(false);
  };

  const toggleApproval = async (reviewId: string, isApproved: boolean) => {
    setUpdating(reviewId);
    await supabase.functions.invoke('customer-reviews', { body: { action: 'approve-review', review_id: reviewId, is_approved: isApproved } });
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, is_approved: isApproved } : r));
    setUpdating(null);
  };

  const toggleFeatured = async (reviewId: string, isFeatured: boolean) => {
    setUpdating(reviewId);
    await supabase.functions.invoke('customer-reviews', { body: { action: 'feature-review', review_id: reviewId, is_featured: isFeatured } });
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, is_featured: isFeatured } : r));
    setUpdating(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold">Manage Reviews</h2>
            <Badge variant="outline">{reviews.length} total</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchReviews}><RefreshCw className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#1A8B06]" /></div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No reviews yet</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className={`${!review.is_approved ? 'border-orange-200 bg-orange-50/50' : ''} ${review.is_featured ? 'border-yellow-300 bg-yellow-50/50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold">{review.customer_name}</span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          {review.dumpster_size && <Badge variant="outline" className="text-xs">{review.dumpster_size}</Badge>}
                          {review.is_featured && <Badge className="bg-yellow-500"><Award className="w-3 h-3 mr-1" />Featured</Badge>}
                          {!review.is_approved && <Badge variant="outline" className="text-orange-600 border-orange-300">Pending</Badge>}
                        </div>
                        <p className="text-gray-700 text-sm">{review.review_text || <span className="italic text-gray-400">No review text</span>}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col gap-2 min-w-[140px]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            {review.is_approved ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                            Visible
                          </span>
                          <Switch checked={review.is_approved} disabled={updating === review.id}
                            onCheckedChange={(v) => toggleApproval(review.id, v)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center gap-1"><Award className="w-3 h-3" />Featured</span>
                          <Switch checked={review.is_featured} disabled={updating === review.id || !review.is_approved}
                            onCheckedChange={(v) => toggleFeatured(review.id, v)} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Star, MessageSquare, Send, Loader2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  rating: number;
  comment: string;
  tenant: {
    name: string;
    profile?: {
      photo?: string;
    };
  };
  createdAt: string;
}

export default function PropertyReviews({ propertyId }: { propertyId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuthStore();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/reviews/${propertyId}`);
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load reviews", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (propertyId) fetchReviews();
  }, [propertyId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a star rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post('/reviews', {
        propertyId,
        rating,
        content: comment
      });

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setReviews([response.data.data, ...reviews]);
        setRating(0);
        setComment("");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="animate-pulse h-32 bg-slate-100 rounded-3xl mt-8"></div>;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200/60">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-sky-500" /> Reviews & Ratings
      </h2>

      {isAuthenticated && user?.role === "TENANT" && (
        <div className="bg-sky-50/50 backdrop-blur-xl p-6 rounded-3xl border border-sky-100 shadow-sm mb-8">
          <h3 className="font-bold text-slate-800 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      star <= (hoverRating || rating) 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-slate-300"
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-slate-500">
                {rating > 0 ? `${rating} out of 5 stars` : "Select a rating"}
              </span>
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience about this property..."
              className="w-full bg-white border border-slate-200 min-h-30 resize-none rounded-2xl focus:ring-2 focus:ring-sky-500 focus:border-transparent p-4 outline-none transition-all"
            />

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting || !rating || !comment.trim()}
                className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-sky-200 transition-all"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="w-5 h-5 mr-2" /> Submit Review</>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No reviews yet for this property.</p>
            {!isAuthenticated || user?.role !== "TENANT" ? (
              <p className="text-sm text-slate-400 mt-1">Tenants can leave a review after their stay.</p>
            ) : null}
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-sky-100 flex items-center justify-center border-2 border-white shadow-sm">
                    {review.tenant?.profile?.photo ? (
                      <img src={review.tenant.profile.photo} alt={review.tenant.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sky-600 font-bold text-lg">{review.tenant?.name?.charAt(0) || "U"}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{review.tenant?.name || "Anonymous Tenant"}</h4>
                    <p className="text-xs font-medium text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100 shadow-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-yellow-700 text-sm">{review.rating}</span>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm bg-white/40 p-4 rounded-2xl border border-slate-50">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
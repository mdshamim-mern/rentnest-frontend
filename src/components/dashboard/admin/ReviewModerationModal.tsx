"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Trash2, X, Star } from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  id: string;
  rating: number;
  comment: string;
  tenant: {
    name: string;
  };
  createdAt: string;
}

interface ReviewModerationModalProps {
  propertyId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModerationModal({ propertyId, isOpen, onClose }: ReviewModerationModalProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && propertyId) {
      fetchReviews();
    }
  }, [isOpen, propertyId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/reviews/${propertyId}`);
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const response = await axiosInstance.delete(`/reviews/${reviewId}`);
      if (response.data.success) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter((r) => r.id !== reviewId));
      }
    } catch (error) {
      toast.error("Failed to delete review");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Property Reviews Moderation</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12 text-slate-500">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No reviews found for this property.
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-4 border border-slate-100 bg-white rounded-2xl shadow-sm relative group">
                  <div className="flex justify-between items-start mb-2 pr-10">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{review.tenant?.name || "Unknown Tenant"}</h4>
                      <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-700 text-xs">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{review.comment}</p>
                  
                  <Button 
                    onClick={() => handleDelete(review.id)}
                    variant="destructive"
                    size="icon"
                    className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
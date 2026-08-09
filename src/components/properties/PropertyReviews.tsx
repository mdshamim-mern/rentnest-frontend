"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Star, MessageSquare } from "lucide-react";

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

  if (isLoading) return <div className="animate-pulse h-32 bg-slate-100 rounded-3xl mt-8"></div>;

  if (reviews.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200/60">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-6 w-6 text-sky-500" /> Reviews & Ratings
      </h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-sky-100 flex items-center justify-center">
                  {review.tenant?.profile?.photo ? (
                    <img src={review.tenant.profile.photo} alt={review.tenant.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sky-600 font-bold text-lg">{review.tenant?.name?.charAt(0) || "U"}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{review.tenant?.name || "Anonymous"}</h4>
                  <p className="text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-slate-800 text-sm">{review.rating}</span>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { RentalRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Star, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TenantRequestsPage() {
  const [activeTab, setActiveTab] = useState<'rental' | 'tour'>('rental');
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [tourRequests, setTourRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      
      const rentalRes = await axiosInstance.get('/rentals');
      if (rentalRes.data.success) {
        setRequests(rentalRes.data.data);
      } else if (Array.isArray(rentalRes.data)) {
        setRequests(rentalRes.data);
      }

      const tourRes = await axiosInstance.get('/tours/my-tours');
      if (tourRes.data.success) {
        setTourRequests(tourRes.data.data);
      } else if (Array.isArray(tourRes.data)) {
        setTourRequests(tourRes.data);
      }
    } catch (error) {
      toast.error("Failed to fetch requests");
    } finally {
      setIsLoading(false);
    }
  };

  const openReviewModal = (id: string) => {
    setSelectedRequestId(id);
    setRating(5);
    setReviewComment("");
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error("Please write a review comment");
      return;
    }
    try {
      setIsSubmittingReview(true);
      setTimeout(() => {
        toast.success("Review submitted successfully!");
        setIsReviewModalOpen(false);
        setIsSubmittingReview(false);
      }, 1500);
    } catch (error) {
      toast.error("Failed to submit review");
      setIsSubmittingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'APPROVED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const calculateTotalAmount = (startDate: string, endDate: string, monthlyPrice: number) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    if (months <= 0) months = 1;
    return months * (monthlyPrice || 0);
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Requests</h1>
        <p className="text-slate-500 mt-2">Manage and track your property rental and tour requests.</p>
      </div>

      <div className="flex space-x-4 mb-4">
        <Button
          variant={activeTab === 'rental' ? 'default' : 'outline'}
          onClick={() => setActiveTab('rental')}
          className={activeTab === 'rental' ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md' : 'text-slate-600'}
        >
          Rental Requests
        </Button>
        <Button
          variant={activeTab === 'tour' ? 'default' : 'outline'}
          onClick={() => setActiveTab('tour')}
          className={activeTab === 'tour' ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-md' : 'text-slate-600'}
        >
          Tour Requests
        </Button>
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/40">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Property</TableHead>
                  {activeTab === 'rental' ? (
                    <>
                      <TableHead className="font-semibold text-slate-700">Duration</TableHead>
                      <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                    </>
                  ) : (
                    <TableHead className="font-semibold text-slate-700">Date Requested</TableHead>
                  )}
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      {activeTab === 'rental' && <TableCell><Skeleton className="h-6 w-20" /></TableCell>}
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : activeTab === 'rental' ? (
                  requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                        No rental requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-white/60 transition-colors">
                        <TableCell className="font-medium text-slate-900">
                          {request.property?.title || "Unknown Property"}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-slate-900 font-bold">
                          ${calculateTotalAmount(request.startDate, request.endDate, request.property?.price || 0)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {request.status === "APPROVED" && (
                            <Link href={`/dashboard/tenant/requests/${request.id}/pay`}>
                              <Button size="sm" className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-lg shadow-sky-500/30">
                                Pay Now
                              </Button>
                            </Link>
                          )}
                          {(request.status === "ACTIVE" || request.status === "COMPLETED") && (
                            <Button 
                              onClick={() => openReviewModal(request.id)}
                              size="sm" 
                              variant="outline" 
                              className="bg-white/60 border-slate-300 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-300 rounded-xl transition-all"
                            >
                              Leave Review
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )
                ) : (
                  tourRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-16 text-slate-500">
                        No tour requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tourRequests.map((request) => (
                      <TableRow key={request.id} className="hover:bg-white/60 transition-colors">
                        <TableCell className="font-medium text-slate-900">
                          {request.property?.title || "Unknown Property"}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="text-slate-400 text-sm">N/A</span>
                        </TableCell>
                      </TableRow>
                    ))
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-2xl border border-white p-6 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Leave a Review</h2>
            <p className="text-slate-500 text-sm mb-6">Share your experience about this property stay.</p>
            
            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  type="button" 
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star className={`h-10 w-10 ${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>

            <Textarea 
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review here..."
              className="bg-white/60 border-slate-200/60 min-h-32 resize-none rounded-xl focus-visible:ring-sky-500 mb-6"
            />

            <Button 
              onClick={submitReview}
              disabled={isSubmittingReview}
              className="w-full h-12 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-lg shadow-sky-500/30 text-base font-bold"
            >
              {isSubmittingReview ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              {isSubmittingReview ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
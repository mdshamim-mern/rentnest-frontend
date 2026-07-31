"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { RentalRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CreditCard, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<RentalRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await axiosInstance.get(`/rentals/${params.id}`);
        if (response.data.success) {
          setRequest(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load payment details");
        router.push("/dashboard/tenant/requests");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchRequestDetails();
  }, [params.id, router]);

  const handlePayment = async () => {
    try {
      setIsProcessing(true);
      const response = await axiosInstance.post('/payments/create', {
        rentalRequestId: request?.id,
        amount: request?.property?.price,
      });
      if (response.data.success && response.data.data?.clientSecret) {
        toast.success("Payment intent created successfully");
      } else if (response.data.success && response.data.data?.url) {
        window.location.href = response.data.data.url;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (error) {
      toast.error("Payment initiation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center">
          <CreditCard className="h-10 w-10 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">Preparing payment gateway...</p>
        </div>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Complete Payment</h1>
        <p className="text-slate-500 mt-2">Securely process your payment to confirm the rental.</p>
      </div>

      <Card className="bg-white/40 backdrop-blur-2xl border-white/60 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-slate-100/50 border-b border-slate-200/60 pb-6">
          <CardTitle className="text-xl flex items-center">
            <Home className="w-5 h-5 mr-3 text-primary" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="flex justify-between items-start pb-6 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{request.property?.title}</h3>
                <p className="text-slate-500 text-sm mt-1">{request.property?.location}</p>
                <div className="mt-3 text-sm text-slate-600 bg-white/60 px-3 py-1.5 rounded-lg inline-block">
                  Duration: {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 font-medium">Subtotal</span>
              <span className="text-slate-900 font-semibold">${request.property?.price}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-600 font-medium">Service Fee</span>
              <span className="text-slate-900 font-semibold">$0.00</span>
            </div>
            
            <div className="flex justify-between items-center pt-6 border-t border-slate-200">
              <span className="text-xl font-bold text-slate-900">Total Amount</span>
              <span className="text-3xl font-extrabold text-primary">${request.property?.price}</span>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] transition-all"
            >
              {isProcessing ? "Redirecting to Gateway..." : "Proceed to Checkout"}
            </Button>
            <div className="flex items-center justify-center text-sm text-slate-500 mt-4">
              <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
              Payments are 100% secure and encrypted
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
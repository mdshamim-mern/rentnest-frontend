"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { axiosInstance } from "@/lib/api/axiosInstance";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing your payment confirmation...");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      const rentalRequestId = searchParams.get('rentalRequestId');
      const amount = searchParams.get('amount');

      if (rentalRequestId && amount && !isVerified) {
        try {
          await axiosInstance.post('/payments/save', {
            rentalRequestId,
            amount: Number(amount),
            transactionId: "txn_stripe_" + Date.now().toString(),
            status: 'PAID'
          });
          setStatus("Thank you for your payment. Your rental request has been confirmed successfully.");
          setIsVerified(true);
        } catch (error) {
          console.error("Error saving payment", error);
          setStatus("Payment confirmed, but there was an issue saving to your dashboard.");
          setIsVerified(true);
        }
      } else if (!rentalRequestId) {
         setStatus("Thank you for your payment. Your rental request has been confirmed successfully.");
         setIsVerified(true);
      }
    };

    confirmPayment();
  }, [searchParams, isVerified]);

  return (
    <Card className="w-full max-w-md bg-white/40 backdrop-blur-2xl border-white/60 shadow-2xl rounded-3xl text-center overflow-hidden">
      <div className="bg-green-500/10 py-10">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
          {isVerified ? (
            <CheckCircle className="w-12 h-12 text-white" />
          ) : (
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          )}
        </div>
      </div>
      <CardContent className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            {isVerified ? "Payment Successful!" : "Confirming..."}
          </h1>
          <p className="text-slate-600 text-lg">
            {status}
          </p>
        </div>
        {isVerified && (
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/dashboard/tenant/payments">
              <Button className="w-full h-12 text-base font-semibold rounded-xl bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/30 transition-colors">
                View Payment History
              </Button>
            </Link>
            <Link href="/dashboard/tenant">
              <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl bg-white/50 border-slate-300 hover:bg-white/80">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin text-sky-500 w-12 h-12" /></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
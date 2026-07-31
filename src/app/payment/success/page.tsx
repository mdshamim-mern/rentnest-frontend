"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/40 backdrop-blur-2xl border-white/60 shadow-2xl rounded-3xl text-center overflow-hidden">
        <div className="bg-green-500/10 py-10">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <CardContent className="p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-600 text-lg">
              Thank you for your payment. Your rental request has been confirmed successfully.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/dashboard/tenant/requests">
              <Button className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-colors">
                View My Requests
              </Button>
            </Link>
            <Link href="/dashboard/tenant">
              <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-xl bg-white/50 border-slate-300 hover:bg-white/80">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
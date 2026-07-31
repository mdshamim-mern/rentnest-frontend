"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/40 backdrop-blur-2xl border-white/60 shadow-2xl rounded-3xl text-center overflow-hidden">
        <div className="bg-red-500/10 py-10">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
            <XCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <CardContent className="p-8 space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Cancelled</h1>
            <p className="text-slate-600 text-lg">
              The payment process was interrupted. No charges were made to your account.
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/dashboard/tenant/requests">
              <Button className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-colors">
                Try Payment Again
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
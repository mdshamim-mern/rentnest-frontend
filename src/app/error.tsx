"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong!</h2>
          <p className="text-slate-600">
            An unexpected error has occurred. Please try again or contact support if the issue persists.
          </p>
        </div>
        <Button
          onClick={() => reset()}
          className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
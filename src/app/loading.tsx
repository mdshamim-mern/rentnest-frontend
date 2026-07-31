import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl p-8 flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-slate-900">Loading...</h2>
        <p className="text-slate-500 text-sm mt-2">Please wait while we prepare the content.</p>
      </div>
    </div>
  );
}
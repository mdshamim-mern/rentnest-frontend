import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-3xl p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <FileQuestion className="w-10 h-10 text-slate-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">404 - Not Found</h2>
          <p className="text-slate-600">
            Oops! The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link href="/">
          <Button className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 rounded-xl transition-all hover:scale-[1.02]">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
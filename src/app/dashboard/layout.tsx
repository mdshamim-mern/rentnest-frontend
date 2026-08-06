"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full bg-slate-50/50">
      <div className="w-full flex min-h-[calc(100vh-5rem)] relative">
        <div className="hidden md:block sticky top-20 h-[calc(100vh-5rem)] z-10 shrink-0">
          <Sidebar />
        </div>

        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div 
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full pt-16 bg-slate-50">
            <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="md:hidden flex items-center justify-between py-4 px-4 bg-slate-50/90 backdrop-blur-xl border-b border-slate-200/50 sticky top-16 z-30">
            <span className="font-semibold text-slate-900">Dashboard Menu</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          <main className="flex-1 py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 lg:py-10 lg:px-10 overflow-x-hidden">
            <div className="h-full w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
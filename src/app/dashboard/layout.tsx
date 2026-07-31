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
    <div className="flex min-h-[calc(100vh-5rem)] bg-slate-50/50 relative">
      <div className="hidden md:block sticky top-20 h-[calc(100vh-5rem)] z-10">
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
        <div className="h-full pt-16">
          <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="md:hidden flex items-center justify-between p-4 bg-white/60 backdrop-blur-xl border-b border-white/60 sticky top-16 z-30">
          <span className="font-semibold text-slate-900">Dashboard Menu</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-x-hidden">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, Building, LayoutDashboard, LogOut, Info, PhoneCall, PlusCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('auth-storage');
    logout();
    window.location.href = "/login";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Properties", href: "/properties", icon: <Building className="w-4 h-4 mr-2" /> },
    { name: "About", href: "/about", icon: <Info className="w-4 h-4 mr-2" /> },
    { name: "Contact", href: "/contact", icon: <PhoneCall className="w-4 h-4 mr-2" /> },
  ];

  const isDashboard = pathname?.startsWith("/dashboard");

  const renderListPropertyBtn = (isMobile = false) => {
    if (isDashboard) return null;

    const btnClass = isMobile 
      ? "w-full bg-sky-500 hover:bg-sky-600 text-white mt-2" 
      : "bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20";

    if (!isAuthenticated) {
      return (
        <Link href="/login?redirect=/dashboard/landlord/properties/new" onClick={() => setIsOpen(false)}>
          <Button className={btnClass}>
            List Your Property
          </Button>
        </Link>
      );
    }
    
    if (isAuthenticated && user?.role === "LANDLORD") {
      return (
        <Link href="/dashboard/landlord/properties/new" onClick={() => setIsOpen(false)}>
          <Button className={btnClass}>
            <PlusCircle className="w-4 h-4 mr-2" />
            List Your Property
          </Button>
        </Link>
      );
    }

    return null;
  };

  if (!isMounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-xl font-extrabold tracking-tighter text-slate-900 flex items-center gap-2">
              <span className="bg-primary text-white rounded-lg flex items-center justify-center text-sm font-bold w-8 h-8">RN</span>
              <span className="text-xl font-black">RentNest</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center bg-slate-50 border border-slate-100 rounded-full p-1 shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-4 py-2 rounded-full text-[15px] font-bold transition-all duration-300 ${
                  pathname === link.href
                    ? "bg-white text-primary shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {renderListPropertyBtn()}
            
            {isAuthenticated ? (
              <>
                <Link href={`/dashboard/${user?.role?.toLowerCase()}`}>
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-slate-200 text-[15px] font-semibold h-10 px-4 rounded-xl">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive" className="shadow-lg shadow-red-500/20 text-[15px] font-semibold h-10 px-4 rounded-xl">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900 text-[15px] font-semibold h-10 px-4 rounded-xl">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  pathname === link.href
                    ? "bg-white text-primary shadow-sm border border-slate-100"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
              {renderListPropertyBtn(true)}
              
              {isAuthenticated ? (
                <>
                  <Link href={`/dashboard/${user?.role?.toLowerCase()}`} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start h-12 rounded-xl font-semibold">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="destructive" className="w-full justify-start h-12 rounded-xl font-semibold">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center h-12 rounded-xl font-semibold">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center h-12 rounded-xl font-semibold">
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
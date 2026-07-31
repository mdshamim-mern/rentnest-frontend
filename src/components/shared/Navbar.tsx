"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Home, Building, LayoutDashboard, LogOut } from "lucide-react";
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
    router.push("/login");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "Properties", href: "/properties", icon: <Building className="w-4 h-4 mr-2" /> },
  ];

  if (!isMounted) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-slate-900 flex items-center gap-2">
              <span className="bg-primary text-white p-1.5 rounded-lg">RN</span>
              RentNest
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-slate-600 hover:text-primary hover:bg-slate-100/50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <Link href={`/dashboard/${user?.role?.toLowerCase()}`}>
                  <Button variant="outline" className="bg-white/50 backdrop-blur-sm border-slate-200">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="destructive" className="shadow-lg shadow-red-500/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="shadow-lg shadow-primary/20">
                    Register
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
                className={`flex items-center px-4 py-3 rounded-xl text-base font-medium ${
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-slate-600 hover:text-primary hover:bg-slate-50"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link href={`/dashboard/${user?.role?.toLowerCase()}`} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button onClick={() => { handleLogout(); setIsOpen(false); }} variant="destructive" className="w-full justify-start">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full justify-center">
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
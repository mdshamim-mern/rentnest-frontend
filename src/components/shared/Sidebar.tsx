"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  FileText, 
  PlusCircle, 
  CreditCard 
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const adminLinks = [
    { name: "Overview", href: "/dashboard/admin", icon: <LayoutDashboard className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "Users", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "Properties", href: "/dashboard/admin/properties", icon: <Building className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "All Requests", href: "/dashboard/admin/requests", icon: <FileText className="w-5 h-5 mr-3 shrink-0" /> },
  ];

  const landlordLinks = [
    { name: "Overview", href: "/dashboard/landlord", icon: <LayoutDashboard className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "My Properties", href: "/dashboard/landlord/properties", icon: <Building className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "Add Property", href: "/dashboard/landlord/properties/new", icon: <PlusCircle className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "Rental Requests", href: "/dashboard/landlord/requests", icon: <FileText className="w-5 h-5 mr-3 shrink-0" /> },
  ];

  const tenantLinks = [
    { name: "Overview", href: "/dashboard/tenant", icon: <LayoutDashboard className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "My Requests", href: "/dashboard/tenant/requests", icon: <FileText className="w-5 h-5 mr-3 shrink-0" /> },
    { name: "Payment History", href: "/dashboard/tenant/payments", icon: <CreditCard className="w-5 h-5 mr-3 shrink-0" /> },
  ];

  let links = tenantLinks;
  if (user?.role === "ADMIN") links = adminLinks;
  if (user?.role === "LANDLORD") links = landlordLinks;

  return (
    <div className="h-full flex flex-col bg-white/40 backdrop-blur-2xl border-r border-white/60 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] w-64 md:w-72 shrink-0">
      <div className="p-6">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Menu
        </h2>
        <nav className="space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={onNavigate}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                    : "text-slate-600 hover:bg-white/60 hover:text-primary hover:scale-[1.02]"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-200/50">
        <div className="flex items-center bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/60">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
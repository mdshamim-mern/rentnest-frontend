"use client";
import { useSyncExternalStore, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import Sidebar from "@/components/shared/Sidebar";
import { useAuthStore } from "@/lib/store/authStore";
import "./workspace.css";

const subscribe = () => () => {};
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const mounted=useSyncExternalStore(subscribe,()=>true,()=>false);
  const dialog=useRef<HTMLDialogElement>(null);
  const {isAuthenticated,user}=useAuthStore();
  const router=useRouter();
  const pathname=usePathname();
  useEffect(()=>{if(mounted && !isAuthenticated) router.replace('/login');},[mounted,isAuthenticated,router]);
  useEffect(()=>{dialog.current?.close();},[pathname]);
  if(!mounted || !isAuthenticated) return <div className="p-12 text-center" role="status">Opening your workspace…</div>;
  return <div className="dashboard-workspace"><div className="workspace-shell">
    <aside className="workspace-desktop-sidebar"><Sidebar /></aside>
    <dialog ref={dialog} className="workspace-drawer" aria-label="Dashboard navigation" onClick={event=>{if(event.target===dialog.current)dialog.current.close();}}><div className="drawer-content"><div className="drawer-heading"><strong>Your workspace</strong><button aria-label="Close dashboard navigation" onClick={()=>dialog.current?.close()}><X size={22} /></button></div><Sidebar onNavigate={()=>dialog.current?.close()} /></div></dialog>
    <div className="workspace-main"><div className="workspace-mobile-bar"><span><LayoutDashboard size={20} />{user?.role.toLowerCase()} workspace</span><button aria-label="Open dashboard navigation" onClick={()=>dialog.current?.showModal()}><Menu size={22} />Menu</button></div><div className="workspace-content">{["admin.demo@rentnest.example","landlord.demo@rentnest.example"].includes(user?.email || "") && <div className="demo-notice" role="status"><strong>{user?.role === "LANDLORD" ? "Landlord" : "Admin"} demo workspace</strong> · Sample data only. Explore the dashboard, search, filters and charts. Changes are disabled.</div>}{children}</div></div>
  </div></div>;
}

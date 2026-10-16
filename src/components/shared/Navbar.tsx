"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, House, Building2, LayoutDashboard, LogOut, Info, PhoneCall, Plus, ArrowUpRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
const subscribe = () => () => {};
const links = [{name:'Home',href:'/',icon:House},{name:'Properties',href:'/properties',icon:Building2},{name:'About',href:'/about',icon:Info},{name:'Contact',href:'/contact',icon:PhoneCall}];
export default function Navbar(){
 const mounted=useSyncExternalStore(subscribe,()=>true,()=>false);
 const {isAuthenticated,user,logout}=useAuthStore();
 const authenticated=mounted&&isAuthenticated;
 const [open,setOpen]=useState(false);
 const toggle=useRef<HTMLButtonElement>(null);
 const pathname=usePathname();
 const dashboard='/dashboard/'+(user?.role?.toLowerCase()||'tenant');
 const canList=!pathname.startsWith('/dashboard')&&(!authenticated||user?.role==='LANDLORD');
 const close=()=>setOpen(false);
 useEffect(()=>{if(!open)return;const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);toggle.current?.focus();}};document.addEventListener('keydown',escape);return()=>document.removeEventListener('keydown',escape);},[open]);
 const signOut=()=>{logout();window.location.href='/login';};
 const actions=<>{canList&&<Link className="nav-action nav-list" href={authenticated?'/dashboard/landlord/properties/new':'/login?redirect=/dashboard/landlord/properties/new'} onClick={close}><Plus size={18}/>List your property</Link>}{authenticated?<><Link className="nav-action nav-account" href={dashboard} onClick={close}><LayoutDashboard size={18}/>Dashboard</Link><button className="nav-action nav-logout" onClick={signOut}><LogOut size={18}/>Logout</button></>:<Link className="nav-action nav-account" href="/login" onClick={close}>Log in<ArrowUpRight size={18}/></Link>}</>;
 return <nav className="rentnest-nav" aria-label="Main navigation"><div className="nav-shell"><Link href="/" className="nav-brand" onClick={close} aria-label="RentNest home"><span className="nav-brand-icon"><House size={23}/></span><span>RentNest<span className="brand-dot">.</span><small>FIND YOUR PLACE</small></span></Link><div className="nav-desktop-links">{links.map(({name,href,icon:Icon})=><Link key={href} href={href} aria-current={pathname===href?'page':undefined}><Icon size={18}/>{name}</Link>)}</div><div className="nav-desktop-actions">{actions}</div><button ref={toggle} className="nav-menu-toggle" aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="main-mobile-menu" onClick={()=>setOpen(!open)}>{open?<X size={23}/>:<Menu size={23}/>}</button></div>{open&&<div id="main-mobile-menu" className="nav-mobile-menu"><span className="nav-menu-caption">EXPLORE RENTNEST</span><div className="nav-mobile-links">{links.map(({name,href,icon:Icon})=><Link key={href} href={href} onClick={close} aria-current={pathname===href?'page':undefined}><Icon size={20}/>{name}<ArrowUpRight size={16}/></Link>)}</div><div className="nav-mobile-actions">{actions}{!authenticated&&<Link href="/register" className="nav-action nav-register" onClick={close}>Create an account<ArrowUpRight size={18}/></Link>}</div></div>}</nav>;
}

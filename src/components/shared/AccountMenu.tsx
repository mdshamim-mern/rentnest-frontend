"use client";
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {ChevronDown,UserRound,LogOut,LifeBuoy} from 'lucide-react';
import {useAuthStore} from '@/lib/store/authStore';
export default function AccountMenu({onNavigate}:{onNavigate?:()=>void}){
 const {user,logout}=useAuthStore();const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{if(!open)return;const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false);};const key=(event:KeyboardEvent)=>{if(event.key==='Escape'){setOpen(false);trigger.current?.focus();}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',key);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',key);};},[open]);
 const base='/dashboard/'+(user?.role.toLowerCase()||'tenant');const close=()=>{setOpen(false);onNavigate?.();};
 return <div ref={root} className="account-menu" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false);}}><button ref={trigger} className="nav-action nav-account" aria-expanded={open} aria-label="Account menu" onClick={()=>setOpen(!open)}><span className="account-avatar">{user?.name?.charAt(0)||<UserRound size={18}/>}</span><span className="account-name">{user?.name?.split(' ')[0]||'Account'}</span><ChevronDown size={16}/></button>{open&&<div className="account-popover"><strong>{user?.name}</strong><small>{user?.role.toLowerCase()} account</small><Link href={base+'/profile'} onClick={close}><UserRound size={18}/>Profile settings</Link><Link href="/help" onClick={close}><LifeBuoy size={18}/>Help center</Link><button onClick={()=>{close();logout();window.location.href='/login';}}><LogOut size={18}/>Logout</button></div>}</div>;
}

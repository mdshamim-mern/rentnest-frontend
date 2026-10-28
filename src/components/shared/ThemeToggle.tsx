"use client";
import {useSyncExternalStore} from 'react';
import {Sun,Moon} from 'lucide-react';
const subscribe=(notify:()=>void)=>{window.addEventListener('rentnest-theme',notify);const sync=(e:StorageEvent)=>{if(e.key==='rentnest-theme'){document.documentElement.classList.toggle('dark',e.newValue==='dark');notify();}};window.addEventListener('storage',sync);return()=>{window.removeEventListener('rentnest-theme',notify);window.removeEventListener('storage',sync);}};
const snapshot=()=>document.documentElement.classList.contains('dark');
export default function ThemeToggle(){
 const dark=useSyncExternalStore(subscribe,snapshot,()=>false);
 function choose(value:boolean){document.documentElement.classList.toggle('dark',value);try{localStorage.setItem('rentnest-theme',value?'dark':'light');}catch{} window.dispatchEvent(new Event('rentnest-theme'));}
 return <div className="theme-switch" role="group" aria-label="Color theme"><button type="button" aria-label="Light mode" aria-pressed={!dark} onClick={()=>choose(false)}><Sun size={18}/><span>Light</span></button><button type="button" aria-label="Dark mode" aria-pressed={dark} onClick={()=>choose(true)}><Moon size={18}/><span>Dark</span></button></div>;
}

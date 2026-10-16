"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import { axiosInstance } from "@/lib/api/axiosInstance";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types";

export default function SavedHomesPage() {
  const ids = useFavoritesStore(state => state.ids);
  const [properties,setProperties] = useState<Property[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(false);
  const [retry,setRetry] = useState(0);
  const [search,setSearch] = useState('');
  useEffect(()=>{
    const controller=new AbortController();
    axiosInstance.get('/properties',{signal:controller.signal}).then(res=>setProperties(res.data.data)).catch(()=>{if(!controller.signal.aborted)setError(true);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return ()=>controller.abort();
  },[retry]);
  const saved=properties.filter(p=>ids.includes(p.id));
  const visible=saved.filter(p=>(p.title+' '+p.location).toLowerCase().includes(search.trim().toLowerCase()));
  return <div className="space-y-6"><header className="workspace-heading"><div><span className="workspace-eyebrow">YOUR SHORTLIST</span><h1>Homes worth coming back to.</h1><p>Your favorites are saved on this browser. Keep exploring until you find your fit.</p></div><Link href="/properties" className="primary-link">Explore homes<Search size={18}/></Link></header>
    <div className="dashboard-filter-bar"><label className="workspace-search"><Search size={18}/><input aria-label="Search saved homes" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search your saved homes…"/></label><span>{visible.length} saved homes</span></div>
    {loading?<div className="workspace-empty" role="status">Loading saved homes…</div>:error?<div className="workspace-error" role="alert">Couldn&apos;t load your homes.<button onClick={()=>{setLoading(true);setError(false);setRetry(v=>v+1);}}>Try again</button></div>:visible.length?<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">{visible.map(p=><PropertyCard key={p.id} property={p}/>)}</div>:<div className="workspace-empty glass rounded-2xl"><Heart size={32}/><h2 className="text-xl font-bold">{saved.length?'No matching saved homes':'Keep the homes you love close.'}</h2><p>{saved.length?'Try another title or location.':'Tap the heart on a property to add it to your shortlist.'}</p><Link href="/properties">Explore properties</Link></div>}
  </div>;
}

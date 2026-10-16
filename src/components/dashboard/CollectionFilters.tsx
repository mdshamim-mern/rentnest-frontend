"use client";
import { Search, RotateCcw } from "lucide-react";

export default function CollectionFilters({ search, onSearch, value, onValue, options, count, placeholder = 'Search records…', label = 'Filter records' }: {
  search: string; onSearch: (value:string)=>void; value: string; onValue:(value:string)=>void;
  options:{value:string;label:string}[]; count:number; placeholder?:string; label?:string;
}) {
  return <div className="dashboard-filter-bar"><label className="workspace-search"><Search size={18}/><input aria-label={placeholder} placeholder={placeholder} value={search} onChange={e=>onSearch(e.target.value)}/></label><select aria-label={label} value={value} onChange={e=>onValue(e.target.value)}><option value="all">All records</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select><span aria-live="polite">{count} result{count===1?'':'s'}</span>{(search||value!=='all')&&<button onClick={()=>{onSearch('');onValue('all');}} className="inline-flex items-center gap-2"><RotateCcw size={15}/>Reset</button>}</div>;
}

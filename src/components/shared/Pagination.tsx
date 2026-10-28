"use client";
import {useState} from 'react';
import {ChevronLeft,ChevronRight} from 'lucide-react';
export function usePagination<T>(items:T[],resetKey:string,pageSize=8){
 const [state,setState]=useState({key:resetKey,page:1,size:pageSize});
 if(state.key!==resetKey)setState({...state,key:resetKey,page:1});
 const pages=Math.max(1,Math.ceil(items.length/state.size));
 const page=state.key===resetKey?Math.max(1,Math.min(state.page,pages)):1;
 const setPage=(next:number)=>setState({key:resetKey,page:Math.max(1,Math.min(next,pages)),size:state.size});
 const setSize=(size:number)=>setState({key:resetKey,page:1,size});
 return {items:items.slice((page-1)*state.size,page*state.size),page,pages,total:items.length,size:state.size,setPage,setSize};
}
export default function Pagination({page,pages,total,size,setPage,setSize}:{page:number;pages:number;total:number;size:number;setPage:(p:number)=>void;setSize:(s:number)=>void}){
 return <nav className="pagination-bar" aria-label="Results pagination"><span role="status">{total?((page-1)*size+1)+'–'+Math.min(page*size,total):'0'} of {total} results</span><label>Per page<select value={size} onChange={e=>setSize(Number(e.target.value))}>{[8,12,24,48].map(n=><option key={n}>{n}</option>)}</select></label><div><button aria-label="Previous page" disabled={page<=1} onClick={()=>setPage(page-1)}><ChevronLeft size={19}/></button><span>Page {page} of {pages}</span><button aria-label="Next page" disabled={page>=pages} onClick={()=>setPage(page+1)}><ChevronRight size={19}/></button></div></nav>;
}

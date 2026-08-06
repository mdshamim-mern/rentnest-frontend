"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Calendar, MapPin, Trash2, User as UserIcon, Building } from "lucide-react";
import { getSavedSearches, deleteSavedSearch } from "@/lib/api/savedSearch.api";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";
import Link from "next/link";

interface SavedSearchData {
  id: string;
  searchTerm: string;
  selectedLocation: string;
  searchMode: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminSavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("TENANT");
  const { user } = useAuthStore();

  const fetchSearches = async () => {
    if (!user) return;
    
    try {
      const response = await getSavedSearches();
      if (response.success) {
        setSearches(response.data);
      }
    } catch (error) {
      console.error("Failed to load saved searches");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSearches();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSavedSearch(id);
      toast.dismiss();
      toast.success("Saved search deleted");
      fetchSearches();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to delete search");
    }
  };

  const filteredSearches = searches.filter((search) => search.user?.role === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">All Saved Searches</h1>
        <p className="text-slate-500 mt-1">View and manage all users' saved property searches.</p>
      </div>

      <div className="flex gap-3 border-b border-slate-200 pb-2 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("TENANT")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === "TENANT" ? "bg-sky-100 text-sky-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Tenant Searches
        </button>
        <button 
          onClick={() => setActiveTab("LANDLORD")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === "LANDLORD" ? "bg-sky-100 text-sky-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Landlord Searches
        </button>
        <button 
          onClick={() => setActiveTab("ADMIN")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${activeTab === "ADMIN" ? "bg-sky-100 text-sky-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
        >
          Admin Searches
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-sky-500 h-10 w-10" />
        </div>
      ) : filteredSearches.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-100 text-center shadow-sm max-w-2xl mx-auto mt-8">
          <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Search className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No saved searches yet</h3>
          <p className="text-slate-500 mt-2 mb-6">No {activeTab.toLowerCase()} users have saved any searches yet.</p>
          <Link href="/properties" className="inline-flex items-center justify-center px-6 py-2.5 bg-sky-500 text-white font-medium rounded-xl hover:bg-sky-600 transition-colors shadow-sm hover:shadow">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSearches.map((search) => (
            <div key={search.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col h-full">
              <button 
                onClick={() => handleDelete(search.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-10"
                title="Delete Search"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${search.searchMode === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'}`}>
                    {search.searchMode || 'classic'}
                  </span>
                </div>
                <div className="flex items-center text-xs font-medium text-slate-400 mr-8">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {new Date(search.createdAt).toLocaleDateString()}
                </div>
              </div>

              {search.user && (
                <div className="mb-4 pb-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <span className="bg-slate-100 p-1.5 rounded-full inline-block">
                      <UserIcon className="h-3.5 w-3.5 text-slate-600" />
                    </span>
                    {search.user.name}
                  </p>
                  <p className="text-xs text-slate-500 ml-8">{search.user.email}</p>
                </div>
              )}
              
              <div className="space-y-4 mt-2 grow">
                {search.searchTerm && (
                  <p className="font-medium text-slate-800 flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Search className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                    <span className="italic text-sm">"{search.searchTerm}"</span>
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {search.selectedLocation && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {search.selectedLocation}
                    </span>
                  )}
                  {search.propertyType && search.propertyType !== 'all' && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg">
                      <Building className="h-3.5 w-3.5 text-slate-400" />
                      {search.propertyType}
                    </span>
                  )}
                  {(search.minPrice || search.maxPrice) && (
                    <span className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium px-2.5 py-1.5 rounded-lg">
                      <span className="text-slate-400 font-bold">$</span>
                      {search.minPrice ? `${search.minPrice}` : '0'} - {search.maxPrice ? `${search.maxPrice}` : 'Any'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link 
                  href={`/properties?location=${search.selectedLocation || ''}&type=${search.propertyType || ''}`} 
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 py-2.5 rounded-xl transition-colors"
                >
                  <Search className="h-4 w-4" />
                  View Search Results
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
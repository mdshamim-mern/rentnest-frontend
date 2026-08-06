"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Calendar, MapPin, Trash2 } from "lucide-react";
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
  beds?: string;
  baths?: string;
  selectedCategory?: string;
  createdAt: string;
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearchData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchSearches = async () => {
    if (!user) return;
    
    try {
      const userId = user.id || (user as any).userId;
      const response = await getSavedSearches(userId);
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
      toast.success("Saved search deleted");
      fetchSearches();
    } catch (error) {
      toast.error("Failed to delete search");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Saved Searches</h1>
        <p className="text-slate-500 mt-1">View and manage your saved property searches.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-sky-500 h-10 w-10" />
        </div>
      ) : searches.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center shadow-sm">
          <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No saved searches yet</h3>
          <p className="text-slate-500 mt-1 mb-4">When you save a search from the properties page, it will appear here.</p>
          <Link href="/properties" className="inline-flex items-center justify-center px-4 py-2 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searches.map((search) => (
            <div key={search.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative group">
              <button 
                onClick={() => handleDelete(search.id)}
                className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${search.searchMode === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-sky-100 text-sky-700'}`}>
                    {search.searchMode || 'classic'} Search
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-400 mr-8">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(search.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                {search.searchTerm && (
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    "{search.searchTerm}"
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {search.selectedLocation && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">
                      <MapPin className="h-3 w-3" />
                      {search.selectedLocation}
                    </span>
                  )}
                  {search.propertyType && search.propertyType !== 'all' && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">
                      Type: {search.propertyType}
                    </span>
                  )}
                  {(search.minPrice || search.maxPrice) && (
                    <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">
                      Price: {search.minPrice ? `$${search.minPrice}` : '$0'} - {search.maxPrice ? `$${search.maxPrice}` : 'Any'}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link 
                  href={`/properties?location=${search.selectedLocation || ''}&type=${search.propertyType || ''}&minPrice=${search.minPrice || ''}&maxPrice=${search.maxPrice || ''}&beds=${search.beds || ''}&baths=${search.baths || ''}&searchMode=${search.searchMode || ''}&categoryId=${search.selectedCategory || ''}`} 
                  className="w-full block text-center text-sm font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 py-2 rounded-xl transition-colors"
                >
                  Search Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
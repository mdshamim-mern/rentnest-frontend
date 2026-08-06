"use client";

import { useState, useEffect } from "react";
import { Loader2, Search, Calendar, MapPin, Trash2 } from "lucide-react";
import { getSavedSearches, deleteSavedSearch } from "@/lib/api/savedSearch.api";
import { useAuthStore } from "@/lib/store/authStore";
import toast from "react-hot-toast";

interface SavedSearchData {
  id: string;
  searchTerm: string;
  selectedLocation: string;
  searchMode: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
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
          <p className="text-slate-500 mt-1">When you save a search from the properties page, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {searches.map((search) => (
            <div key={search.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative">
              <button 
                onClick={() => handleDelete(search.id)}
                className="absolute top-4 right-4 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {search.searchMode || 'classic'} Search
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-400 mr-8">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(search.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="space-y-2">
                {search.searchTerm && (
                  <p className="font-semibold text-slate-800 flex items-center gap-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    "{search.searchTerm}"
                  </p>
                )}
                {search.selectedLocation && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {search.selectedLocation}
                  </p>
                )}
                {search.propertyType && search.propertyType !== 'all' && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="font-medium">Type:</span> {search.propertyType}
                  </p>
                )}
                {(search.minPrice || search.maxPrice) && (
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="font-medium">Price:</span> 
                    {search.minPrice ? `$${search.minPrice}` : '$0'} - {search.maxPrice ? `$${search.maxPrice}` : 'Any'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Loader2, Search, Calendar, MapPin } from "lucide-react";

interface SavedSearch {
  id: string;
  searchTerm: string;
  selectedLocation: string;
  searchMode: string;
  createdAt: string;
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const response = await axiosInstance.get('/saved-searches');
        if (response.data.success) {
          setSearches(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load saved searches");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSearches();
  }, []);

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
            <div key={search.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-sky-100 text-sky-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {search.searchMode} Search
                  </span>
                </div>
                <div className="flex items-center text-xs text-slate-400">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
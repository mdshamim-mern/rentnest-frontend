"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property, Category } from "@/types";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PropertyCard from "@/components/properties/PropertyCard";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const params = selectedCategory !== "all" ? { categoryId: selectedCategory } : {};
        const response = await axiosInstance.get('/properties', { params });
        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to fetch properties");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperties();
  }, [selectedCategory]);

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMinPrice = minPrice === "" || p.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || p.price <= Number(maxPrice);
    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white/60 backdrop-blur-2xl border border-white/60 p-6 rounded-3xl shadow-xl shadow-sky-100/40 mb-12 flex flex-col xl:flex-row gap-4 items-center">
          <div className="relative grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-500 h-5 w-5" />
            <Input 
              placeholder="Search by title or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 bg-white/80 border-white/50 rounded-2xl text-base shadow-sm focus-visible:ring-sky-500"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
            <div className="flex gap-2 w-full sm:w-auto">
              <Input 
                type="number" 
                placeholder="Min $" 
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-14 w-full sm:w-28 bg-white/80 border-white/50 rounded-2xl shadow-sm focus-visible:ring-sky-500"
              />
              <Input 
                type="number" 
                placeholder="Max $" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-14 w-full sm:w-28 bg-white/80 border-white/50 rounded-2xl shadow-sm focus-visible:ring-sky-500"
              />
            </div>
            <div className="w-full sm:w-56">
              <Select value={selectedCategory} onValueChange={(val) => setSelectedCategory(val || "all")}>
                <SelectTrigger className="h-14 bg-white/80 border-white/50 rounded-2xl text-base shadow-sm focus:ring-sky-500">
                  <SlidersHorizontal className="mr-2 h-4 w-4 text-sky-500 shrink-0" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-white/90 backdrop-blur-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-sky-500 h-12 w-12" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-sky-100/30">
            <h3 className="text-2xl font-bold text-slate-800">No properties found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
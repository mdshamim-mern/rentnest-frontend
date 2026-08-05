"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property, Category } from "@/types";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyMap from "@/components/properties/PropertyMap";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchMode, setSearchMode] = useState("classic");
  const [viewMode, setViewMode] = useState("list");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [beds, setBeds] = useState("all");
  const [baths, setBaths] = useState("all");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newBuilds, setNewBuilds] = useState("all");
  const [moreOptions, setMoreOptions] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const params: any = {};
        if (selectedCategory !== "all") params.categoryId = selectedCategory;
        if (propertyType !== "all") params.propertyType = propertyType;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minArea) params.minArea = minArea;
        if (maxArea) params.maxArea = maxArea;
        if (beds && beds !== "all") params.beds = beds;
        if (baths && baths !== "all") params.baths = baths;
        if (amenities.length > 0) params.amenities = amenities.join(',');
        if (newBuilds && newBuilds !== "all") params.newBuilds = newBuilds;
        if (selectedLocation) params.location = selectedLocation;
        if (searchTerm) params.searchTerm = searchTerm;
        if (searchMode) params.searchMode = searchMode;

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
  }, [selectedCategory, propertyType, minPrice, maxPrice, minArea, maxArea, beds, baths, amenities, newBuilds, selectedLocation, searchTerm, searchMode]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSearchMode("classic");
    setViewMode("list");
    setSelectedCategory("all");
    setPropertyType("all");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setMaxArea("");
    setBeds("all");
    setBaths("all");
    setAmenities([]);
    setNewBuilds("all");
    setMoreOptions([]);
  };

  const handleSaveSearch = async () => {
    try {
      const searchPayload = {
        searchTerm,
        selectedLocation,
        searchMode,
        selectedCategory,
        propertyType,
        minPrice,
        maxPrice,
        beds,
        baths
      };
      const res = await axiosInstance.post('/saved-searches', searchPayload);
      if (res.data.success) {
        toast.success("Search Saved Successfully!");
      }
    } catch (error) {
      toast.success("Search Saved Successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PropertyFilters 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
          searchMode={searchMode} setSearchMode={setSearchMode}
          viewMode={viewMode} setViewMode={setViewMode}
          selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          propertyType={propertyType} setPropertyType={setPropertyType}
          minPrice={minPrice} setMinPrice={setMinPrice}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          minArea={minArea} setMinArea={setMinArea}
          maxArea={maxArea} setMaxArea={setMaxArea}
          beds={beds} setBeds={setBeds}
          baths={baths} setBaths={setBaths}
          amenities={amenities} setAmenities={setAmenities}
          newBuilds={newBuilds} setNewBuilds={setNewBuilds}
          moreOptions={moreOptions} setMoreOptions={setMoreOptions}
          categories={categories}
          onReset={handleResetFilters}
          onSaveSearch={handleSaveSearch}
        />

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-sky-500 h-12 w-12" />
          </div>
        ) : viewMode === "map" ? (
          <PropertyMap properties={properties} />
        ) : properties.length === 0 ? (
          <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-sky-100/30">
            <h3 className="text-2xl font-bold text-slate-800">No properties found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
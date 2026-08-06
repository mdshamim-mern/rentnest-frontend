"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property, Category } from "@/types";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyMap from "@/components/properties/PropertyMap";
import toast from "react-hot-toast";

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
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
  const [rentFor, setRentFor] = useState("all");
  const [furnished, setFurnished] = useState("all");

  useEffect(() => {
    const loc = searchParams.get('location');
    const type = searchParams.get('type');
    const minP = searchParams.get('minPrice');
    const maxP = searchParams.get('maxPrice');
    const bds = searchParams.get('beds');
    const bths = searchParams.get('baths');
    const mode = searchParams.get('searchMode');
    const cat = searchParams.get('categoryId');
    
    if (loc) setSelectedLocation(loc);
    if (type) setPropertyType(type);
    if (minP) setMinPrice(minP);
    if (maxP) setMaxPrice(maxP);
    if (bds) setBeds(bds);
    if (bths) setBaths(bths);
    if (mode) setSearchMode(mode);
    if (cat) setSelectedCategory(cat);
    
    setIsReady(true);
  }, [searchParams]);

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
    if (!isReady) return;

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
        if (rentFor && rentFor !== "all") params.rentFor = rentFor;
        if (furnished && furnished !== "all") params.furnished = furnished;
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
  }, [selectedCategory, propertyType, minPrice, maxPrice, minArea, maxArea, beds, baths, amenities, rentFor, furnished, selectedLocation, searchTerm, searchMode, isReady]);

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
    setRentFor("all");
    setFurnished("all");
  };

  const handleSaveSearch = async () => {
    
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-8 pb-24">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
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
          rentFor={rentFor} setRentFor={setRentFor}
          furnished={furnished} setFurnished={setFurnished}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property, Category } from "@/types";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyFilters from "@/components/properties/PropertyFilters";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/properties/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-150 bg-slate-100 animate-pulse rounded-3xl flex items-center justify-center">
      <Loader2 className="animate-spin text-sky-500 h-10 w-10" />
    </div>
  ),
});

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sort, setSort] = useState("newest");
  const [onlySaved, setOnlySaved] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [retry, setRetry] = useState(0);
  const favorites = useFavoritesStore(state=>state.ids);
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
    const type = searchParams.get('type') || searchParams.get('propertyType');
    const minP = searchParams.get('minPrice');
    const maxP = searchParams.get('maxPrice');
    const bds = searchParams.get('beds');
    const bths = searchParams.get('baths');
    const mode = searchParams.get('searchMode');
    const cat = searchParams.get('categoryId');
    const minA = searchParams.get('minArea');
    const maxA = searchParams.get('maxArea');
    const rFor = searchParams.get('rentFor');
    const furn = searchParams.get('furnished');
    const amens = searchParams.get('amenities');
    
    if (loc) setSelectedLocation(loc);
    if (type) setPropertyType(type);
    if (minP) setMinPrice(minP);
    if (maxP) setMaxPrice(maxP);
    if (bds) setBeds(bds);
    if (bths) setBaths(bths);
    if (mode) setSearchMode(mode);
    if (cat) setSelectedCategory(cat);
    if (minA) setMinArea(minA);
    if (maxA) setMaxArea(maxA);
    if (rFor) setRentFor(rFor);
    if (furn) setFurnished(furn);
    if (amens) setAmenities(amens.split(','));
    
    setIsReady(true);

    if (searchParams.toString() !== "") {
      router.replace('/properties', { scroll: false });
    }
  }, [searchParams, router]);

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

    const controller = new AbortController();
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setFetchError(false);
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

        if (searchMode) params.searchMode = searchMode;

        const response = await axiosInstance.get('/properties', { params, signal: controller.signal });
        if (response.data.success) {
          setProperties(response.data.data);
        }
      } catch (error) {
        if (!controller.signal.aborted) { setFetchError(true); setProperties([]); }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchProperties, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [selectedCategory, propertyType, minPrice, maxPrice, minArea, maxArea, beds, baths, amenities, rentFor, furnished, selectedLocation, searchMode, isReady, retry]);

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
    router.replace('/properties', { scroll: false });
  };

  const visibleProperties = useMemo(() => {
    const list = onlySaved ? properties.filter(p=>favorites.includes(p.id)) : [...properties];
    return list.sort((a,b) => sort === "price-low" ? a.price-b.price : sort === "price-high" ? b.price-a.price : sort === "area" ? (b.floorArea||0)-(a.floorArea||0) : new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime());
  }, [properties, onlySaved, favorites, sort]);

  return (
    <div className="properties-page min-h-screen pt-8 pb-24">
      <div className="site-width">
        <div className="property-heading"><div><span className="eyebrow">A SPACE FOR YOUR NEXT CHAPTER</span><h1>Find your kind of home.</h1><p>Explore the possibilities. Make the right move.</p></div><span className="eyebrow">RENTNEST / PROPERTIES</span></div>
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
        />

        <div className="results-toolbar"><div aria-live="polite">{isLoading ? "Finding your next home…" : `${visibleProperties.length} properties found`}<label className="ml-4 inline-flex gap-2 items-center"><input type="checkbox" checked={onlySaved} onChange={e=>setOnlySaved(e.target.checked)} />Saved homes</label></div><select aria-label="Sort properties" value={sort} onChange={e=>setSort(e.target.value)}><option value="newest">Newest first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="area">Largest area</option></select></div>
        {fetchError ? <div className="glass p-12 rounded-2xl text-center" role="alert"><h2 className="text-xl font-semibold">We couldn’t load the properties.</h2><p className="my-4 text-slate-500">Please check your connection and try again.</p><button className="primary-link" onClick={()=>setRetry(v=>v+1)}>Try again</button></div> : isLoading ? (
          <div className="flex justify-center items-center py-32">
            <Loader2 className="animate-spin text-sky-500 h-12 w-12" />
          </div>
        ) : viewMode === "map" ? (
          <PropertyMap properties={visibleProperties} />
        ) : visibleProperties.length === 0 ? (
          <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg shadow-sky-100/30">
            <h3 className="text-2xl font-bold text-slate-800">No properties found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p><button className="text-link mt-5" onClick={()=>{handleResetFilters();setOnlySaved(false);}}>Reset filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {visibleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
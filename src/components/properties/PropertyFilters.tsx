import { Search, Map, List, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import { useState, useRef } from "react";
import MainFilterButton from "./FilterUI/MainFilterButton";
import DropdownMenu from "./FilterUI/DropdownMenu";
import RangeInput from "./FilterUI/RangeInput";
import toast from "react-hot-toast";
import Link from "next/link";
import { saveSearch } from "@/lib/api/savedSearch.api";
import { useAuthStore } from "@/lib/store/authStore";

interface PropertyFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  searchMode: string;
  setSearchMode: (value: string) => void;
  viewMode: string;
  setViewMode: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  minArea: string;
  setMinArea: (value: string) => void;
  maxArea: string;
  setMaxArea: (value: string) => void;
  beds: string;
  setBeds: (value: string) => void;
  baths: string;
  setBaths: (value: string) => void;
  amenities: string[];
  setAmenities: (value: string[]) => void;
  rentFor: string;
  setRentFor: (value: string) => void;
  furnished: string;
  setFurnished: (value: string) => void;
  categories: Category[];
  onReset: () => void;
  onSaveSearch?: () => void;
}

export default function PropertyFilters(props: PropertyFiltersProps) {
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);
  const { user } = useAuthStore();

  const handleSaveSearchClick = async () => {
    if (isSavingRef.current) return;
    
    if (!user) {
      toast.dismiss();
      toast.error("Please login to save your search");
      return;
    }

    isSavingRef.current = true;
    setIsSaving(true);
    
    try {
      const searchData = {
        userId: user.id || (user as any).userId,
        searchTerm: props.searchTerm,
        selectedLocation: props.selectedLocation,
        searchMode: props.searchMode,
        selectedCategory: props.selectedCategory,
        propertyType: props.propertyType,
        minPrice: props.minPrice,
        maxPrice: props.maxPrice,
        beds: props.beds,
        baths: props.baths,
        minArea: props.minArea,
        maxArea: props.maxArea,
        rentFor: props.rentFor,
        furnished: props.furnished,
        amenities: props.amenities,
      };

      await saveSearch(searchData);
      toast.dismiss();
      toast.success("Search Saved Successfully!");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to save search. Please try again.");
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleSearchSubmit = async () => {
    if (!props.searchTerm) return;

    if (props.searchMode === "ai") {
      const loadingToastId = toast.loading("✨ AI is analyzing your request...");
      
      try {
        const response = await fetch('/api/ai-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: props.searchTerm })
        });
        
        const data = await response.json();
        
        let filtersApplied = 0;

        props.setSelectedCategory("all");
        props.setPropertyType("all");
        props.setMinPrice("");
        props.setMaxPrice("");
        props.setMinArea("");
        props.setMaxArea("");
        props.setBeds("all");
        props.setBaths("all");
        props.setRentFor("all");
        props.setFurnished("all");
        props.setSelectedLocation("");

        if (data.location) {
          props.setSelectedLocation(data.location);
          filtersApplied++;
        }
        if (data.propertyType) {
          props.setPropertyType(data.propertyType);
          filtersApplied++;
        }
        if (data.beds) {
          props.setBeds(data.beds);
          filtersApplied++;
        }
        if (data.maxPrice) {
          props.setMaxPrice(data.maxPrice);
          filtersApplied++;
        }

        props.setSearchTerm("");
        toast.dismiss(loadingToastId);

        if (filtersApplied > 0) {
          toast.success(`✨ AI Magic: Applied ${filtersApplied} filters!`);
        } else {
          toast.error("Couldn't understand. Try '2 bed apartment in Banani'");
        }
      } catch (error) {
        toast.dismiss(loadingToastId);
        toast.error("AI service error. Please try again.");
      }
    } else {
      props.setSelectedLocation(props.searchTerm);
      props.setSearchTerm("");
      toast.dismiss();
      toast.success("Location updated!");
    }
  };

  return (
    <div className="relative z-50 bg-white/60 backdrop-blur-2xl border border-white/60 p-6 rounded-3xl shadow-xl shadow-sky-100/40 mb-12 flex flex-col gap-6">
      
      <div className="flex flex-col xl:flex-row gap-4 items-center justify-between w-full">
        <div className="flex items-center gap-1 bg-white/80 p-1 rounded-full border border-white/50 shadow-sm w-full xl:w-auto h-12">
          <button 
            onClick={() => props.setSearchMode("ai")}
            className={`whitespace-nowrap px-5 h-full rounded-full text-sm font-semibold transition-colors ${props.searchMode === "ai" ? "bg-sky-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            AI Search
          </button>
          <button 
            onClick={() => {
              props.setSearchMode("classic");
              props.setSearchTerm("");
            }}
            className={`whitespace-nowrap px-5 h-full rounded-full text-sm font-semibold transition-colors ${props.searchMode === "classic" ? "bg-sky-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Classic
          </button>
        </div>
        
        <div className="relative grow w-full h-12">
          <Input 
            placeholder={props.searchMode === "ai" ? "Try: '2 bed apartment in Dhanmondi under 50k'" : "Search your location..."} 
            value={props.searchTerm}
            onChange={(e) => props.setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            className="pl-6 pr-24 h-full bg-white/80 border-white/50 rounded-2xl text-base text-slate-800 shadow-sm focus-visible:ring-sky-500 w-full"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 h-9">
            {props.searchTerm && (
              <button onClick={() => props.setSearchTerm("")} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors h-full flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={handleSearchSubmit}
              className="flex items-center justify-center px-3 h-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-sm transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
          <button 
            onClick={handleSaveSearchClick}
            disabled={isSaving}
            className="whitespace-nowrap h-12 px-6 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold hover:bg-slate-50 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Search"}
          </button>
          <div className="flex items-center gap-1 bg-white/80 p-1 rounded-2xl border border-white/50 shadow-sm h-12">
            <button 
              onClick={() => props.setViewMode("list")}
              className={`flex items-center gap-2 px-4 h-full rounded-xl text-sm font-semibold transition-colors ${props.viewMode === "list" ? "bg-white shadow-md text-slate-900" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <List className={`h-4 w-4 ${props.viewMode === "list" ? "text-sky-500" : ""}`} /> List
            </button>
            <button 
              onClick={() => props.setViewMode("map")}
              className={`flex items-center gap-2 px-4 h-full rounded-xl text-sm font-semibold transition-colors ${props.viewMode === "map" ? "bg-white shadow-md text-slate-900" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Map className={`h-4 w-4 ${props.viewMode === "map" ? "text-sky-500" : ""}`} /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 font-medium px-2">
        <Link href="/" className="hover:text-sky-500 cursor-pointer transition-colors">Back to Home</Link>
        <span>|</span>
        <span className="hover:text-sky-500 cursor-pointer transition-colors">Property Search</span>
        <span>/</span>
        <span className="text-slate-800 font-bold">{props.selectedLocation || "All Locations"}</span>
        <span>/</span>
        <div className="relative flex items-center">
          <DropdownMenu 
            label="Choose Location" 
            value={props.selectedLocation} 
            onChange={props.setSelectedLocation}
            type="single"
            options={[
              { label: "All Locations", value: "" },
              { label: "Dhanmondi", value: "Dhanmondi" },
              { label: "Mohammadpur", value: "Mohammadpur" },
              { label: "Gulshan", value: "Gulshan" },
              { label: "Banani", value: "Banani" },
              { label: "Uttara", value: "Uttara" },
              { label: "Bashundhara", value: "Bashundhara" },
              { label: "Mirpur", value: "Mirpur" },
              { label: "Shyamoli", value: "Shyamoli" },
              { label: "Badda", value: "Badda" },
              { label: "Khilgaon", value: "Khilgaon" }
            ]} 
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <MainFilterButton onReset={props.onReset} />

        <DropdownMenu 
          label="Property Type" 
          value={props.propertyType} 
          onChange={props.setPropertyType}
          type="single"
          options={[
            { label: "All Types", value: "all" },
            { label: "Apartment", value: "Apartment" },
            { label: "Villa", value: "Villa" },
            { label: "Duplex", value: "Duplex" },
            { label: "Penthouse", value: "Penthouse" },
            { label: "Townhouse", value: "Townhouse" },
            { label: "Studio", value: "Studio" }
          ]} 
        />

       <DropdownMenu 
          label="Property Category" 
          value={props.selectedCategory} 
          onChange={props.setSelectedCategory}
          type="single"
          options={[
            { label: "All Categories", value: "all" },
            ...props.categories.map((c: any) => ({ label: c.name, value: c.id }))
          ]} 
        />

        <div className="relative">
          <button 
            onClick={() => {
              setIsPricingOpen(!isPricingOpen);
              setIsAreaOpen(false);
            }}
            className="h-10 px-4 flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 rounded-full text-sm font-medium text-slate-700 transition-colors shadow-sm"
          >
            Pricing ($) <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <div className={`absolute top-full left-0 mt-2 z-100 ${isPricingOpen ? 'block' : 'hidden'}`}>
            <RangeInput 
              minVal={props.minPrice} setMinVal={props.setMinPrice} 
              maxVal={props.maxPrice} setMaxVal={props.setMaxPrice} 
              placeholder="Price" 
              maxAllowed={100000}
              step={500}
              onClose={() => setIsPricingOpen(false)}
            />
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => {
              setIsAreaOpen(!isAreaOpen);
              setIsPricingOpen(false);
            }}
            className="h-10 px-4 flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 rounded-full text-sm font-medium text-slate-700 transition-colors shadow-sm"
          >
            Area (sqft) <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <div className={`absolute top-full left-0 mt-2 z-100 ${isAreaOpen ? 'block' : 'hidden'}`}>
            <RangeInput 
              minVal={props.minArea} setMinVal={props.setMinArea} 
              maxVal={props.maxArea} setMaxVal={props.setMaxArea} 
              placeholder="Sqft" 
              maxAllowed={10000}
              step={100}
              onClose={() => setIsAreaOpen(false)}
            />
          </div>
        </div>

        <DropdownMenu 
          label="Beds" 
          value={props.beds} 
          onChange={props.setBeds}
          type="grid"
          options={[
            { label: "Studio", value: "studio" }, { label: "1", value: "1" },
            { label: "2", value: "2" }, { label: "3", value: "3" },
            { label: "4", value: "4" }, { label: "5+", value: "5+" }
          ]} 
        />

        <DropdownMenu 
          label="Baths" 
          value={props.baths} 
          onChange={props.setBaths}
          type="grid"
          options={[
            { label: "1", value: "1" }, { label: "2", value: "2" }, 
            { label: "3", value: "3" }, { label: "4+", value: "4+" }
          ]} 
        />

        <DropdownMenu 
          label="Rent For" 
          value={props.rentFor} 
          onChange={props.setRentFor}
          type="single"
          options={[
            { label: "Any", value: "all" },
            { label: "Family", value: "Family" },
            { label: "Bachelor", value: "Bachelor" }
          ]} 
        />

        <DropdownMenu 
          label="Furnished" 
          value={props.furnished} 
          onChange={props.setFurnished}
          type="single"
          options={[
            { label: "Any", value: "all" },
            { label: "Fully Furnished", value: "Fully Furnished" },
            { label: "Semi Furnished", value: "Semi Furnished" },
            { label: "Unfurnished", value: "Unfurnished" }
          ]} 
        />

        <DropdownMenu 
          label="Amenities" 
          value={props.amenities} 
          onChange={props.setAmenities}
          type="multiple"
          options={[
            { label: "Security Guard", value: "Security Guard" },
            { label: "CCTV Camera", value: "CCTV Camera" },
            { label: "Generator", value: "Generator" },
            { label: "Community Hall", value: "Community Hall" },
            { label: "Prayer Room", value: "Prayer Room" },
            { label: "GYM", value: "GYM" },
            { label: "Swimming Pool", value: "Swimming Pool" },
            { label: "Barbeque Area", value: "Barbeque Area" },
            { label: "Garden", value: "Garden" },
            { label: "Intercom", value: "Intercom" },
            { label: "Fire Exit", value: "Fire Exit" },
            { label: "Fire Exitinguisher", value: "Fire Exitinguisher" },
            { label: "Wi-Fi Connectivity", value: "Wi-Fi Connectivity" },
            { label: "WASA Connection", value: "WASA Connection" },
            { label: "Submersible Pump", value: "Submersible Pump" }
          ]} 
        />

      </div>
    </div>
  );
}
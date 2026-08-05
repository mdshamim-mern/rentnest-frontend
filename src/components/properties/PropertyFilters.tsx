import { Search, Map, List, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import MainFilterButton from "./FilterUI/MainFilterButton";
import DropdownMenu from "./FilterUI/DropdownMenu";
import RangeInput from "./FilterUI/RangeInput";
import toast from "react-hot-toast";
import Link from "next/link";

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
  newBuilds: string;
  setNewBuilds: (value: string) => void;
  moreOptions: string[];
  setMoreOptions: (value: string[]) => void;
  categories: Category[];
  onReset: () => void;
  onSaveSearch: () => void;
}

export default function PropertyFilters(props: PropertyFiltersProps) {
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
            onClick={() => props.setSearchMode("classic")}
            className={`whitespace-nowrap px-5 h-full rounded-full text-sm font-semibold transition-colors ${props.searchMode === "classic" ? "bg-sky-500 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
          >
            Classic
          </button>
        </div>
        
        <div className="relative grow w-full h-12">
          <Input 
            placeholder="Search your location..." 
            value={props.searchTerm}
            onChange={(e) => props.setSearchTerm(e.target.value)}
            className="pl-6 pr-24 h-full bg-white/80 border-white/50 rounded-2xl text-base text-slate-800 shadow-sm focus-visible:ring-sky-500 w-full"
          />
          <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 h-9">
            {props.searchTerm && (
              <button onClick={() => props.setSearchTerm("")} className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors h-full flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            )}
            <button 
              onClick={() => {
                if (props.searchTerm) {
                  props.setSelectedLocation(props.searchTerm);
                  toast.success("Location updated!");
                }
              }}
              className="flex items-center justify-center px-3 h-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-sm transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-end">
          <button 
            onClick={props.onSaveSearch}
            className="whitespace-nowrap h-12 px-6 bg-white border border-slate-200 rounded-2xl text-slate-800 font-bold hover:bg-slate-50 shadow-sm transition-colors"
          >
            Save Search
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
              { label: "Dhanmondi, Dhaka", value: "Dhanmondi" },
              { label: "Mohammadpur, Dhaka", value: "Mohammadpur" },
              { label: "Gulshan, Dhaka", value: "Gulshan" },
              { label: "Banani, Dhaka", value: "Banani" },
              { label: "Uttara, Dhaka", value: "Uttara" },
              { label: "Bashundhara, Dhaka", value: "Bashundhara" },
              { label: "Mirpur, Dhaka", value: "Mirpur" },
              { label: "Shyamoli, Dhaka", value: "Shyamoli" },
              { label: "Badda, Dhaka", value: "Badda" },
              { label: "Khilgaon, Dhaka", value: "Khilgaon" }
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
            { label: "Apartment", value: "apartment" },
            { label: "Villa", value: "villa" },
            { label: "Duplex", value: "duplex" },
            { label: "Penthouse", value: "penthouse" },
            { label: "Townhouse", value: "townhouse" },
            { label: "Studio", value: "studio" }
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

        <div className="group relative">
          <button className="h-10 px-4 flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 rounded-full text-sm font-medium text-slate-700 transition-colors shadow-sm">
            Pricing <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-100">
            <RangeInput 
              minVal={props.minPrice} setMinVal={props.setMinPrice} 
              maxVal={props.maxPrice} setMaxVal={props.setMaxPrice} 
              placeholder="Price" 
            />
          </div>
        </div>

        <div className="group relative">
          <button className="h-10 px-4 flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 rounded-full text-sm font-medium text-slate-700 transition-colors shadow-sm">
            Area (sqft) <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>
          <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-100">
            <RangeInput 
              minVal={props.minArea} setMinVal={props.setMinArea} 
              maxVal={props.maxArea} setMaxVal={props.setMaxArea} 
              placeholder="Sqft" 
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
          label="Amenities" 
          value={props.amenities} 
          onChange={props.setAmenities}
          type="multiple"
          options={[
            { label: "Swimming Pool", value: "pool" },
            { label: "Gym", value: "gym" },
            { label: "Parking", value: "parking" },
            { label: "Balcony", value: "balcony" },
            { label: "Elevator", value: "elevator" },
            { label: "Security", value: "security" },
            { label: "Garden", value: "garden" },
            { label: "Furnished", value: "furnished" }
          ]} 
        />

        <DropdownMenu 
          label="New Builds" 
          value={props.newBuilds} 
          onChange={props.setNewBuilds}
          type="single"
          options={[
            { label: "Any", value: "all" },
            { label: "Yes / Brand New", value: "yes" },
            { label: "No / Pre-owned", value: "no" },
            { label: "Under Construction", value: "under_construction" },
            { label: "Ready to Move", value: "ready" }
          ]} 
        />

        <DropdownMenu 
          label="More Options" 
          value={props.moreOptions} 
          onChange={props.setMoreOptions}
          type="multiple"
          options={[
            { label: "Year Built", value: "year_built" },
            { label: "Floor Level", value: "floor_level" },
            { label: "Pet Friendly", value: "pet_friendly" },
            { label: "Virtual Tour Available", value: "virtual_tour" }
          ]} 
        />
      </div>
    </div>
  );
}
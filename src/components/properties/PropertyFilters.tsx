import { Search, Map, List, ChevronDown, X, SlidersHorizontal, BookmarkPlus, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Category } from "@/types";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";



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
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);


  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const isSavingRef = useRef(false);
  const { user } = useAuthStore();

  useEffect(() => {
    if (isHydrated) return;
    
    const loc = searchParams.get("selectedLocation") || searchParams.get("location");
    if (loc) props.setSelectedLocation(loc);
    
    const cat = searchParams.get("selectedCategory") || searchParams.get("categoryId");
    if (cat) props.setSelectedCategory(cat);
    
    const pType = searchParams.get("propertyType");
    if (pType) props.setPropertyType(pType);
    
    const minP = searchParams.get("minPrice");
    if (minP) props.setMinPrice(minP);
    
    const maxP = searchParams.get("maxPrice");
    if (maxP) props.setMaxPrice(maxP);
    
    const minA = searchParams.get("minArea");
    if (minA) props.setMinArea(minA);
    
    const maxA = searchParams.get("maxArea");
    if (maxA) props.setMaxArea(maxA);
    
    const bed = searchParams.get("beds");
    if (bed) props.setBeds(bed);
    
    const bath = searchParams.get("baths");
    if (bath) props.setBaths(bath);
    
    const rFor = searchParams.get("rentFor");
    if (rFor) props.setRentFor(rFor);
    
    const furn = searchParams.get("furnished");
    if (furn) props.setFurnished(furn);
    
    const amen = searchParams.get("amenities");
    if (amen) props.setAmenities(amen.split(","));
    
    const mode = searchParams.get("searchMode");
    if (mode) props.setSearchMode(mode);
    
    const term = searchParams.get("searchTerm");
    if (term) props.setSearchTerm(term);

    setIsHydrated(true);
  }, [searchParams, isHydrated, props]);

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
      const searchData: any = {
        userId: user.id || (user as any).userId,
        searchMode: props.searchMode,
      };

      if (props.searchTerm) searchData.searchTerm = props.searchTerm;
      if (props.selectedLocation && props.selectedLocation !== "all") searchData.selectedLocation = props.selectedLocation;
      if (props.selectedCategory && props.selectedCategory !== "all") searchData.selectedCategory = props.selectedCategory;
      if (props.propertyType && props.propertyType !== "all") searchData.propertyType = props.propertyType;
      if (props.minPrice) searchData.minPrice = props.minPrice;
      if (props.maxPrice) searchData.maxPrice = props.maxPrice;
      if (props.beds && props.beds !== "all") searchData.beds = props.beds;
      if (props.baths && props.baths !== "all") searchData.baths = props.baths;
      if (props.minArea) searchData.minArea = props.minArea;
      if (props.maxArea) searchData.maxArea = props.maxArea;
      if (props.rentFor && props.rentFor !== "all") searchData.rentFor = props.rentFor;
      if (props.furnished && props.furnished !== "all") searchData.furnished = props.furnished;
      if (props.amenities && props.amenities.length > 0) searchData.amenities = props.amenities.join(",");

      await saveSearch(searchData);
      toast.dismiss();
      toast.success("Search Saved Successfully!");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || error.message || "Failed to save search. Please try again.");
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleSearchSubmit = async () => {
    if (!props.searchTerm.trim()) return;

    if (props.searchMode === "ai") {
      const loadingToastId = toast.loading("✨ AI is analyzing your request...");
      
      try {
        const response = await fetch('/api/ai-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: props.searchTerm })
        });
        
        const payload = await response.json();
        if (!response.ok || !payload.success || payload.source !== 'ai') throw new Error(payload.error || 'AI search is unavailable. Please use Classic search.');
        const aiData = payload.data;
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
        props.setAmenities([]);

        if (aiData.location) {
          let loc = aiData.location.trim();
          loc = loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase();
          if (loc === "Gulsan") loc = "Gulshan";
          if (loc === "Bonani") loc = "Banani";
          props.setSelectedLocation(loc);
          filtersApplied++;
        }
        
        if (aiData.propertyType) {
          let pType = aiData.propertyType.trim();
          pType = pType.charAt(0).toUpperCase() + pType.slice(1).toLowerCase();
          props.setPropertyType(pType);
          filtersApplied++;
        }
        
        if (aiData.beds) {
          const bedVal = String(aiData.beds).replace(/[^0-9+]/g, '');
          if (bedVal) {
            props.setBeds(bedVal);
            filtersApplied++;
          }
        }
        
        if (aiData.maxPrice || aiData.price) {
          const priceVal = String(aiData.maxPrice || aiData.price).replace(/[^0-9]/g, '');
          if (priceVal) {
            props.setMaxPrice(priceVal);
            filtersApplied++;
          }
        }

        props.setSearchTerm("");
        toast.dismiss(loadingToastId);

        if (filtersApplied > 0) {
          toast.success(`✨ AI Magic: Applied ${filtersApplied} filters!`);
        } else {
          toast.error("Couldn't understand. Try '2 bed apartment in Banani'");
        }
      } catch (error: any) {
        toast.dismiss();
        toast.error(error.message || "AI service error. Please try again.", { duration: 6000 });
      }
    } else {
      let formattedLocation = props.searchTerm.trim();
      formattedLocation = formattedLocation.charAt(0).toUpperCase() + formattedLocation.slice(1).toLowerCase();
      if (formattedLocation === "Gulsan") formattedLocation = "Gulshan";
      if (formattedLocation === "Bonani") formattedLocation = "Banani";
      
      props.setSelectedLocation(formattedLocation);
      props.setSearchTerm("");
      toast.dismiss();
      toast.success("Location updated!");
    }
  };

  const select = (label: string, value: string, change: (value: string) => void, options: { label: string; value: string }[]) => <label className="filter-field"><span>{label}</span><select aria-label={label} value={value} onChange={e => change(e.target.value)}>{options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
  const options = (all: string, values: string[]) => [{label: all,value:'all'}, ...values.map(value => ({label:value,value}))];
  const active = [props.selectedLocation, props.propertyType !== 'all' && props.propertyType, props.selectedCategory !== 'all' && props.categories.find(c=>c.id===props.selectedCategory)?.name, props.minPrice && 'From $'+props.minPrice, props.maxPrice && 'Up to $'+props.maxPrice, props.beds !== 'all' && props.beds+' beds', props.baths !== 'all' && props.baths+' baths', props.minArea && 'From '+props.minArea+' sqft', props.maxArea && 'Up to '+props.maxArea+' sqft', props.rentFor !== 'all' && props.rentFor, props.furnished !== 'all' && props.furnished, ...props.amenities].filter(Boolean);
  return <section className="filter-panel glass" aria-label="Search and filter properties">
    <div className="filter-panel-heading"><div><span className="filter-heading-icon"><SlidersHorizontal size={23}/></span><div><h2>Find a place that fits.</h2><p>Your neighborhood. Your budget. Your next home.</p></div></div><span className="filter-live-badge"><span/>Live results</span></div>
    <div className="filter-search-row"><div className="search-mode"><button aria-pressed={props.searchMode==='classic'} onClick={()=>props.setSearchMode('classic')}>Classic</button><button aria-pressed={props.searchMode==='ai'} onClick={()=>props.setSearchMode('ai')}><Sparkles size={16}/>AI search</button></div>
      <form onSubmit={e=>{e.preventDefault();handleSearchSubmit();}} className="filter-search-input"><Search size={18} /><input aria-label="Search location or describe your home" value={props.searchTerm} onChange={e=>props.setSearchTerm(e.target.value)} placeholder={props.searchMode==='ai'?'Try: 2 bed apartment in Banani under $800':'Search a city or neighborhood…'} /><button aria-label="Search properties" type="submit"><Search size={18} /></button></form>
      <button className="save-search-button" onClick={handleSaveSearchClick} disabled={isSaving}><BookmarkPlus size={18}/>{isSaving?'Saving…':'Save search'}</button>
    </div>
    <div className="filter-fields">
      {select('Location',props.selectedLocation,props.setSelectedLocation,[{label:'All locations',value:''},...['Dhanmondi','Mohammadpur','Gulshan','Banani','Uttara','Bashundhara','Mirpur','Shyamoli','Badda','Khilgaon'].map(value=>({label:value,value})),...props.selectedLocation && !['Dhanmondi','Mohammadpur','Gulshan','Banani','Uttara','Bashundhara','Mirpur','Shyamoli','Badda','Khilgaon'].includes(props.selectedLocation)?[{label:props.selectedLocation,value:props.selectedLocation}]:[]])}
      {select('Property type',props.propertyType,props.setPropertyType,options('Any type',['Apartment','Villa','Duplex','Penthouse','Townhouse','Studio']))}
      <label className="filter-field"><span>Min rent ($)</span><input aria-label="Minimum rent" type="number" min="0" value={props.minPrice} placeholder="No minimum" onChange={e=>props.setMinPrice(e.target.value)} /></label>
      <label className="filter-field"><span>Max rent ($)</span><input aria-label="Maximum rent" type="number" min="0" value={props.maxPrice} placeholder="No maximum" onChange={e=>props.setMaxPrice(e.target.value)} /></label>
      {select('Bedrooms',props.beds,props.setBeds,options('Any beds',['studio','1','2','3','4','5+']))}
      <button className="more-filters" aria-expanded={expanded} aria-controls="advanced-filters" onClick={()=>setExpanded(!expanded)}><SlidersHorizontal size={17}/>{expanded?"Fewer filters":"More filters"}<ChevronDown size={16} /></button>
    </div>
    {expanded && <div className="advanced-filters" id="advanced-filters"><div className="filter-fields">
      {select('Category',props.selectedCategory,props.setSelectedCategory,[{label:'All categories',value:'all'},...props.categories.map(c=>({label:c.name,value:c.id}))])}
      {select('Bathrooms',props.baths,props.setBaths,options('Any baths',['1','2','3','4','5+']))}
      {select('Rent for',props.rentFor,props.setRentFor,options('Anyone',['Family','Bachelor']))}
      {select('Furnishing',props.furnished,props.setFurnished,options('Any furnishing',['Fully Furnished','Semi Furnished','Unfurnished']))}
      <label className="filter-field"><span>Min area (sqft)</span><input aria-label="Minimum area" type="number" min="0" value={props.minArea} placeholder="No minimum" onChange={e=>props.setMinArea(e.target.value)} /></label>
      <label className="filter-field"><span>Max area (sqft)</span><input aria-label="Maximum area" type="number" min="0" value={props.maxArea} placeholder="No maximum" onChange={e=>props.setMaxArea(e.target.value)} /></label>
    </div><fieldset className="amenity-options"><legend>Amenities</legend>{['Security Guard','CCTV Camera','Generator','Community Hall','Prayer Room','GYM','Swimming Pool','Barbeque Area','Garden','Intercom','Fire Exit','Fire Exitinguisher','Wi-Fi Connectivity','WASA Connection','Submersible Pump'].map(item=><label key={item}><input type="checkbox" checked={props.amenities.includes(item)} onChange={e=>props.setAmenities(e.target.checked?[...props.amenities,item]:props.amenities.filter(a=>a!==item))} />{item}</label>)}</fieldset></div>}
    {(props.minPrice && props.maxPrice && Number(props.minPrice)>Number(props.maxPrice) || props.minArea && props.maxArea && Number(props.minArea)>Number(props.maxArea)) && <p role="alert" className="text-sm text-red-600 mt-3">Minimum must be less than or equal to maximum.</p>}
    <div className="filter-bottom"><div className="active-filters">{active.length ? <><span>{active.length} active</span>{active.map((item,i)=><span className="filter-chip" key={i}>{item}</span>)}<button onClick={props.onReset}>Clear all <X size={13} /></button></> : <span className="filter-hint">Select your preferences. Results update automatically.</span>}</div><div className="view-toggle"><button aria-label="List view" aria-pressed={props.viewMode==='list'} onClick={()=>props.setViewMode('list')}><List size={16} />List</button><button aria-label="Map view" aria-pressed={props.viewMode==='map'} onClick={()=>props.setViewMode('map')}><Map size={16} />Map</button></div></div>
  </section>;
}

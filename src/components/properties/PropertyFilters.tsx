import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types";

interface PropertyFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  categories: Category[];
}

export default function PropertyFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  categories,
}: PropertyFiltersProps) {
  return (
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
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
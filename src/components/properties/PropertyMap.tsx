"use client";

import { Property } from "@/types";
import { Building } from "lucide-react";

interface PropertyMapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  return (
    <div className="w-full h-150 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/50 shadow-lg flex flex-col items-center justify-center p-6">
      <div className="bg-sky-100 p-4 rounded-full mb-4">
        <Building className="h-10 w-10 text-sky-600" />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-2">Interactive Map View</h3>
      <p className="text-slate-500 text-center max-w-md mb-6">
        Showing {properties.length} properties on the map. Explore locations and neighborhood stats interactively.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full overflow-y-auto max-h-87.5 p-2">
        {properties.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <img src={p.image || ""} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <h4 className="font-bold text-sm text-slate-900 truncate max-w-45">{p.title}</h4>
              <p className="text-xs text-sky-600 font-semibold">${p.price}/month</p>
              <p className="text-xs text-slate-500 truncate max-w-45">{p.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
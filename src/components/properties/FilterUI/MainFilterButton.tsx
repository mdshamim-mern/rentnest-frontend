import { useState } from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

interface MainFilterButtonProps {
  onReset: () => void;
}

export default function MainFilterButton({ onReset }: MainFilterButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="h-10 px-5 flex items-center gap-2 bg-sky-500 hover:bg-sky-600 border border-sky-500 rounded-full text-sm font-bold text-white shadow-md transition-all hover:shadow-lg"
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span>Filters</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-sky-500" />
                All Filters
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 text-slate-600">
              <p className="mb-4">All available filters are displayed on the main bar for quick access.</p>
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 text-sm text-sky-800">
                You can manage Property Type, Pricing, Area, Rooms, Beds, Baths, Amenities, and New Builds directly from the quick access menu.
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => {
                  onReset();
                  setIsModalOpen(false);
                }}
                className="flex-1 h-12 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors"
              >
                <RotateCcw className="h-4 w-4" /> Clear All
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 h-12 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl shadow-lg shadow-sky-200 transition-colors"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
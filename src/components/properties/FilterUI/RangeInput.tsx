import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface RangeInputProps {
  minVal: string;
  maxVal: string;
  setMinVal: (val: string) => void;
  setMaxVal: (val: string) => void;
  placeholder?: string;
  maxAllowed?: number;
  step?: number;
  onClose?: () => void;
}

export default function RangeInput({ minVal, maxVal, setMinVal, setMaxVal, placeholder = "Value", maxAllowed = 100000, step = 100, onClose }: RangeInputProps) {
  const [localMin, setLocalMin] = useState(minVal);
  const [localMax, setLocalMax] = useState(maxVal);
  const [sliderVal, setSliderVal] = useState(Number(maxVal) || (maxAllowed / 2));

  useEffect(() => {
    setLocalMin(minVal);
    setLocalMax(maxVal);
    setSliderVal(Number(maxVal) || (maxAllowed / 2));
  }, [minVal, maxVal, maxAllowed]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderVal(Number(e.target.value));
    setLocalMax(e.target.value);
  };

  const handleApply = () => {
    setMinVal(localMin);
    setMaxVal(localMax);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 min-w-70 z-50">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">MINIMUM</label>
          <Input 
            type="number" 
            placeholder={`Min ${placeholder}`}
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-sky-500 text-slate-800 w-full"
          />
        </div>
        <div className="text-slate-300 font-bold mt-5">-</div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-slate-500 ml-1 mb-1 block">MAXIMUM</label>
          <Input 
            type="number" 
            placeholder={`Max ${placeholder}`}
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="h-10 bg-slate-50 border-slate-200 rounded-xl focus-visible:ring-sky-500 text-slate-800 w-full"
          />
        </div>
      </div>
      
      <div className="px-1 py-2">
        <input 
          type="range" 
          min="0" 
          max={maxAllowed} 
          step={step}
          value={sliderVal} 
          onChange={handleSliderChange}
          className="w-full accent-sky-500"
        />
        <div className="flex justify-between text-xs font-medium text-slate-400 mt-2">
          <span>0</span>
          <span>{maxAllowed.toLocaleString()}+</span>
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full h-10 bg-slate-900 hover:bg-sky-500 text-white font-bold rounded-xl transition-colors"
      >
        Apply Range
      </button>
    </div>
  );
}
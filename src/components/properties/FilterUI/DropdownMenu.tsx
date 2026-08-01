import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface DropdownMenuProps {
  label: string;
  value: string | string[];
  onChange: (val: any) => void;
  options: { label: string; value: string }[];
  type: "single" | "multiple" | "grid";
}

export default function DropdownMenu({ label, value, onChange, options, type }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSingleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const handleMultipleSelect = (val: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (currentValues.includes(val)) {
      onChange(currentValues.filter((v) => v !== val));
    } else {
      onChange([...currentValues, val]);
    }
  };

  const isSelected = (val: string) => {
    if (Array.isArray(value)) return value.includes(val);
    return value === val;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`h-10 px-4 flex items-center gap-2 rounded-full text-sm font-medium transition-colors shadow-sm border ${isOpen || (Array.isArray(value) ? value.length > 0 : value !== "all" && value !== "" && value !== "United Arab Emirates / Dubai") ? "bg-sky-50 border-sky-300 text-sky-700" : "bg-white border-slate-200 text-slate-700 hover:border-sky-300 hover:bg-sky-50"}`}
      >
        <span>{label}</span>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-100 min-w-60 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 animate-in fade-in zoom-in-95">
          
          {type === "single" && (
            <div className="flex flex-col gap-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSingleSelect(opt.value)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors ${isSelected(opt.value) ? "bg-sky-50 text-sky-700" : "hover:bg-slate-50 text-slate-700"}`}
                >
                  {opt.label}
                  {isSelected(opt.value) && <Check className="h-4 w-4 text-sky-600" />}
                </button>
              ))}
            </div>
          )}

          {type === "multiple" && (
            <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
              {options.map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 cursor-pointer">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected(opt.value) ? "bg-sky-500 border-sky-500" : "border-slate-300 bg-white"}`}>
                    {isSelected(opt.value) && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                  <input type="checkbox" className="hidden" checked={isSelected(opt.value)} onChange={() => handleMultipleSelect(opt.value)} />
                </label>
              ))}
            </div>
          )}

          {type === "grid" && (
            <div className="grid grid-cols-3 gap-2 p-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    if (Array.isArray(value)) {
                      handleMultipleSelect(opt.value);
                    } else {
                      handleSingleSelect(opt.value);
                    }
                  }}
                  className={`h-10 rounded-xl text-sm font-semibold transition-colors border ${isSelected(opt.value) ? "bg-sky-500 text-white border-sky-500" : "bg-white text-slate-600 border-slate-200 hover:border-sky-300 hover:bg-sky-50"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
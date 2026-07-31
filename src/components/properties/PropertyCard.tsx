"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, BedDouble, Bath, SquareSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = (property as any).image 
    ? [(property as any).image] 
    : ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link href={`/properties/${property.id}`}>
      <Card 
        className="group overflow-hidden bg-white/60 backdrop-blur-xl border border-white/50 shadow-lg shadow-sky-100/40 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-500 rounded-[2rem] cursor-pointer hover:-translate-y-2 flex flex-col h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-72 w-full bg-slate-100 overflow-hidden rounded-t-[2rem] p-3">
          <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {isHovered && images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-1.5 rounded-full text-slate-700 hover:text-sky-600 hover:bg-white transition-colors z-20 shadow-md"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md p-1.5 rounded-full text-slate-700 hover:text-sky-600 hover:bg-white transition-colors z-20 shadow-md"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60'}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="bg-white/80 backdrop-blur-md p-2.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-colors shadow-sm"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute top-4 left-4 z-20">
              <div className="bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-sm border border-white/20">
                {property.category?.name || "Property"}
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 grow flex flex-col">
          <div className="flex justify-between items-start mb-2 gap-4">
            <h3 className="text-xl font-extrabold text-slate-900 line-clamp-2 leading-tight group-hover:text-sky-600 transition-colors">
              {property.title}
            </h3>
          </div>
          
          <div className="flex items-center text-slate-500 mb-5">
            <MapPin className="h-4 w-4 mr-1 shrink-0 text-sky-500" />
            <span className="text-sm truncate font-medium">{property.location}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600 text-sm font-medium mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><BedDouble className="h-4 w-4" /> 3</div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><Bath className="h-4 w-4" /> 2</div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg"><SquareSquare className="h-4 w-4" /> 1800</div>
          </div>
          
          <div className="mt-auto flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-slate-900">${property.price}</span>
              <span className="text-slate-500 text-sm font-medium"> / mo</span>
            </div>
            <Button className="rounded-xl px-6 bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white transition-colors font-bold shadow-none hover:shadow-lg hover:shadow-sky-500/30">
              Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
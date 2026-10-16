"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, BedDouble, Bath, SquareSquare, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { Property } from "@/types";
import { useFavoritesStore } from "@/lib/store/favoritesStore";
import toast from "react-hot-toast";
export default function PropertyCard({ property }: { property: Property }) {
  const [index, setIndex] = useState(0);
  const [mounted,setMounted] = useState(false);
  const { ids, toggle } = useFavoritesStore();
  useEffect(() => setMounted(true), []);
  const favorite = mounted && ids.includes(property.id);
  const images = [...new Set([property.image, ...(property.images || [])].filter(Boolean))] as string[];
  if (!images.length) images.push('/property-placeholder.svg');
  return <article className="property-card glass">
    <div className="property-card-image">
      <Link href={'/properties/' + property.id} aria-label={'View ' + property.title}><Image src={images[index % images.length]} alt={property.title} fill unoptimized sizes="(max-width: 767px) 100vw, (max-width: 1100px) 50vw, 33vw" onError={e => { e.currentTarget.src = '/property-placeholder.svg'; }} /></Link>
      <span className="property-badge">{property.propertyType || property.category?.name || 'Property'}</span>
      <button className="favorite-button" aria-label={(favorite ? 'Unsave ' : 'Save ') + property.title} aria-pressed={favorite} onClick={() => { toggle(property.id); toast.success(favorite ? 'Removed from saved homes' : 'Saved on this device'); }}><Heart size={17} fill={favorite ? 'currentColor' : 'none'} /></button>
      {images.length > 1 && <><button className="photo-arrow prev" aria-label="Previous photo" onClick={() => setIndex((index - 1 + images.length) % images.length)}><ChevronLeft size={16} /></button><button className="photo-arrow next" aria-label="Next photo" onClick={() => setIndex((index + 1) % images.length)}><ChevronRight size={16} /></button><span className="photo-count">{index + 1} / {images.length}</span></>}
    </div>
    <div className="property-card-body"><Link href={'/properties/' + property.id}><h3>{property.title}</h3></Link><p className="property-card-location"><MapPin size={14} />{property.location}</p>
      <div className="property-specs"><span><BedDouble size={15} />{property.bedrooms ?? '—'} beds</span><span><Bath size={15} />{property.bathrooms ?? '—'} baths</span><span><SquareSquare size={15} />{property.floorArea?.toLocaleString() ?? '—'} sqft</span></div>
      <div className="property-card-bottom"><div><strong>$ {property.price.toLocaleString()}</strong><small> / {property.rentType === 'Per Year' ? 'year' : 'month'}</small></div><Link href={'/properties/' + property.id} aria-label={'View details of ' + property.title}><ArrowUpRight size={20} /></Link></div>
    </div>
  </article>;
}

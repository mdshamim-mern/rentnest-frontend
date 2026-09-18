"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPropertyById } from "@/lib/api/properties.api";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  MapPin, User, CheckCircle2, Home, Share, Calendar, BedDouble, Bath, SquareSquare, 
  MessageSquare, Phone, MessageCircle, Info, ChevronRight, Check, X, ChevronLeft, 
  Flame, Car, ArrowUpDown, Armchair, Compass, Wrench, Users, Wind, Layers, ShieldCheck, 
  Cctv, Zap, Building2, Droplet, Wifi, AlertTriangle, Speaker
} from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { axiosInstance } from "@/lib/api/axiosInstance";
import toast from "react-hot-toast";
import PropertyCard from "@/components/properties/PropertyCard";
import PropertyReviews from "@/components/properties/PropertyReviews";

const getAmenityIcon = (amenityName: string) => {
  const name = amenityName.toLowerCase();
  if (name.includes('cctv')) return <Cctv className="h-4 w-4 text-sky-600" />;
  if (name.includes('security') || name.includes('guard')) return <ShieldCheck className="h-4 w-4 text-sky-600" />;
  if (name.includes('generator') || name.includes('power')) return <Zap className="h-4 w-4 text-sky-600" />;
  if (name.includes('hall') || name.includes('community')) return <Building2 className="h-4 w-4 text-sky-600" />;
  if (name.includes('pump') || name.includes('wasa') || name.includes('water')) return <Droplet className="h-4 w-4 text-sky-600" />;
  if (name.includes('wifi') || name.includes('internet')) return <Wifi className="h-4 w-4 text-sky-600" />;
  if (name.includes('fire')) return <AlertTriangle className="h-4 w-4 text-sky-600" />;
  if (name.includes('intercom')) return <Speaker className="h-4 w-4 text-sky-600" />;
  return <Check className="h-4 w-4 text-sky-600" />;
};

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTourLoading, setIsTourLoading] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const fallbackImage = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000";

  useEffect(() => {
    const fetchPropertyAndSimilar = async () => {
      try {
        const res = await getPropertyById(params.id as string);
        if (res.success) {
            setProperty(res.data);
            
            const similarRes = await axiosInstance.get('/properties', {
                 params: { categoryId: res.data.categoryId }
            });
            if (similarRes.data.success) {
                const filtered = similarRes.data.data.filter((p: Property) => p.id !== res.data.id).slice(0, 3);
                setSimilarProperties(filtered);
            }
        }
      } catch (error) {
        toast.error("Failed to load property details");
        router.push("/properties");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchPropertyAndSimilar();
  }, [params.id, router]);

  const handleRequest = () => {
    if (!isAuthenticated) {
      toast.error("Please login to request this property");
      router.push("/login");
      return;
    }
    if (user?.role !== "TENANT") {
      toast.error("Only tenants can request properties");
      return;
    }
    router.push(`/dashboard/tenant/requests/new?propertyId=${property?.id}`);
  };

  const handleScheduleTour = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to schedule a tour");
      router.push("/login");
      return;
    }
    if (user?.role !== "TENANT") {
      toast.error("Only tenants can schedule tours");
      return;
    }

    try {
      setIsTourLoading(true);
      const res = await axiosInstance.post('/tours', { propertyId: property?.id });
      if (res.data?.success || res.status === 201) {
        toast.success("Tour requested successfully! Landlord will be notified.");
      }
    } catch (error) {
      toast.error("Failed to request tour.");
    } finally {
      setIsTourLoading(false);
    }
  };

  const handleEmail = () => {
    const email = (property?.landlord as any)?.email || "admin@rentnest.com";
    window.location.href = `mailto:${email}?subject=Inquiry about ${property?.title}`;
  };

  const handlePhone = () => {
    const phone = (property?.landlord as any)?.phone || (property?.landlord as any)?.profile?.phone || "+8801234567890";
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    const whatsapp = (property?.landlord as any)?.whatsapp || (property?.landlord as any)?.profile?.whatsapp || (property?.landlord as any)?.phone || "+8801234567890";
    const cleanNumber = whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Property link copied to clipboard!");
  };

  const nextPhoto = () => {
    const images = property?.images || [];
    if (images.length > 0) {
      setCurrentPhotoIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevPhoto = () => {
    const images = property?.images || [];
    if (images.length > 0) {
      setCurrentPhotoIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  if (isLoading) {  
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="animate-pulse flex flex-col items-center">
          <Home className="h-16 w-16 text-sky-300 mb-6 animate-bounce" />
          <p className="text-slate-500 font-medium">Loading premium details...</p>
        </div>
      </div>
    );
  }
  if (!property) return null;

  const propertyImages = property.images || [];
  const smallImage1 = propertyImages.length > 0 ? propertyImages[0] : fallbackImage;
  const smallImage2 = propertyImages.length > 1 ? propertyImages[1] : fallbackImage;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50/40 to-slate-100 py-12">
      
      {isPhotoModalOpen && propertyImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 backdrop-blur-sm">
          <button 
            onClick={() => setIsPhotoModalOpen(false)} 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <X className="h-10 w-10" />
          </button>
          <button onClick={prevPhoto} className="absolute left-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <ChevronLeft className="h-12 w-12" />
          </button>
          <div className="relative w-full max-w-5xl h-[80vh]">
             <Image 
               src={propertyImages[currentPhotoIndex] || fallbackImage} 
               alt={`Property Photo ${currentPhotoIndex + 1}`} 
               fill 
               className="object-contain" 
             />
          </div>
          <button onClick={nextPhoto} className="absolute right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all">
            <ChevronRight className="h-12 w-12" />
          </button>
          <div className="absolute bottom-6 flex gap-3 bg-black/40 px-4 py-2 rounded-full">
             {propertyImages.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setCurrentPhotoIndex(idx)} 
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${currentPhotoIndex === idx ? 'bg-sky-500 scale-125' : 'bg-white/50 hover:bg-white'}`} 
                />
             ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[50vh] md:h-[60vh] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-sky-100/50">
          <div className="md:col-span-2 relative h-full group">
            <Image 
              src={property.image || fallbackImage} 
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />  
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-sky-500/90 backdrop-blur-md w-fit px-4 py-1.5 rounded-full text-white text-sm font-bold tracking-wider uppercase mb-3 shadow-lg">
                {property.propertyType || property.category?.name || "Premium"}
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
                {property.title}
              </h1>
              <div className="flex items-center text-white/90 text-lg font-medium">
                <MapPin className="h-5 w-5 mr-2 shrink-0 text-sky-400" />
                {property.location}
              </div>
            </div>
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            <div className="relative w-full h-full overflow-hidden group">
              <Image 
                src={smallImage1} 
                alt="Interior view 1" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="relative w-full h-full overflow-hidden group cursor-pointer" onClick={() => setIsPhotoModalOpen(true)}>
              <Image 
                src={smallImage2} 
                alt="Interior view 2" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/50 transition-colors flex items-center justify-center">
                <span className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full font-bold text-slate-900 hover:bg-sky-500 hover:text-white transition-colors">
                  View All Photos
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/50 shadow-sm">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-full"><BedDouble className="h-5 w-5" /></div>
                <div><p className="text-sm text-slate-500 font-medium">Bedrooms</p><p className="font-bold text-slate-900">{property.bedrooms || "-"} Beds</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/50 shadow-sm">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-full"><Bath className="h-5 w-5" /></div>
                <div><p className="text-sm text-slate-500 font-medium">Bathrooms</p><p className="font-bold text-slate-900">{property.bathrooms || "-"} Baths</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/50 shadow-sm">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-full"><SquareSquare className="h-5 w-5" /></div>
                <div><p className="text-sm text-slate-500 font-medium">Area</p><p className="font-bold text-slate-900">{property.floorArea ? `${property.floorArea} sqft` : "-"}</p></div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><Info className="h-6 w-6 text-sky-500" /> Property Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/50 shadow-sm">
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Users className="h-4 w-4 text-sky-500"/> Rent For</p>
                    <p className="font-bold text-slate-800">{property.rentFor?.join(', ') || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Wind className="h-4 w-4 text-sky-500"/> Balcony</p>
                    <p className="font-bold text-slate-800">{property.balcony || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Layers className="h-4 w-4 text-sky-500"/> Floor Available On</p>
                    <p className="font-bold text-slate-800">{property.floorLevel || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Flame className="h-4 w-4 text-sky-500"/> Gas</p>
                    <p className="font-bold text-slate-800">{property.gas || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Car className="h-4 w-4 text-sky-500"/> Parking</p>
                    <p className="font-bold text-slate-800">{property.parking || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><ArrowUpDown className="h-4 w-4 text-sky-500"/> Lift</p>
                    <p className="font-bold text-slate-800">{property.lift || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Armchair className="h-4 w-4 text-sky-500"/> Furnished</p>
                    <p className="font-bold text-slate-800">{property.furnished || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Compass className="h-4 w-4 text-sky-500"/> Facing</p>
                    <p className="font-bold text-slate-800">{property.facing || "-"}</p>
                 </div>
                 <div>
                    <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1.5"><Wrench className="h-4 w-4 text-sky-500"/> Service Charge</p>
                    <p className="font-bold text-slate-800">{property.serviceCharge ? `$ ${property.serviceCharge}` : "-"}</p>
                 </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2"><CheckCircle2 className="h-6 w-6 text-sky-500" /> Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities && property.amenities.length > 0 ? (
                      property.amenities.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-white/60 p-4 rounded-2xl border border-white/50 shadow-sm">
                              <div className="bg-sky-100 p-1.5 rounded-full">
                                  {getAmenityIcon(item)}
                              </div>
                              <span className="font-medium text-slate-700">{item}</span>
                          </div>
                      ))
                  ) : (
                      <p className="text-slate-500 italic col-span-full">No specific amenities listed.</p>
                  )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Description</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap bg-white/40 p-8 rounded-3xl border border-white/50 shadow-sm">
                {property.description}
              </p>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-sky-500" /> Local Area Information
                </h2>
                <a href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`} target="_blank" rel="noreferrer">
                   <Button variant="outline" className="rounded-xl border-sky-200 text-sky-600 hover:bg-sky-50">
                     <MapPin className="mr-2 h-4 w-4" /> Open in Maps
                   </Button>
                </a>
              </div>
              <div className="w-full h-96 bg-slate-200 rounded-3xl overflow-hidden relative border border-white/50 shadow-md">
                 <iframe 
                    title="Property Location"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                 />
              </div>
            </div>
            
            <PropertyReviews propertyId={property.id} />

          </div>
          
          <div className="relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/60 p-8 rounded-[2rem] shadow-xl shadow-sky-100/50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">{property.rentType || "Monthly Rent"}</div>
                    <div className="text-4xl font-extrabold text-slate-900">$ {property.price}</div>
                  </div>
                  <Button onClick={handleShare} variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/80 border-slate-200 hover:text-sky-500 hover:scale-110 transition-transform shadow-sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mb-6 inline-block bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-semibold border border-slate-200">
                    {(property as any).isNegotiable || property.rentNegotiable ? "Negotiable" : "Fixed"}
                </div>
                
                <div className="space-y-4 mb-8">
                  <Button 
                    onClick={handleRequest}
                    className="w-full h-14 text-lg font-bold bg-slate-900 hover:bg-sky-500 text-white rounded-2xl shadow-xl hover:shadow-sky-500/30 transition-all hover:-translate-y-1"
                  >
                    Request to Rent
                  </Button>
                  <Button 
                    onClick={handleScheduleTour}
                    disabled={isTourLoading}
                    variant="outline"
                    className="w-full h-14 text-base font-bold bg-white/50 border-slate-300 hover:bg-white rounded-2xl transition-all"
                  >
                    <Calendar className="mr-2 h-5 w-5 text-sky-500" /> 
                    {isTourLoading ? "Scheduling..." : "Schedule a Tour"}
                  </Button>
                </div>

                <div className="pt-6 border-t border-slate-200/60">
                  <div className="text-sm font-semibold text-slate-500 mb-4">LISTED BY</div>
                  <div className="flex flex-col gap-4 bg-white/40 p-5 rounded-3xl border border-white/50">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm overflow-hidden">
                        {(property.landlord as any)?.profile?.photo ? (
                            <img src={(property.landlord as any).profile.photo} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-7 w-7 text-sky-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg line-clamp-1">{(property.landlord as any)?.name || "Verified Owner"}</div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleEmail}
                      variant="outline" 
                      className="w-full h-10 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-600 font-semibold border-slate-200"
                    >
                      <MessageSquare className="mr-2 h-4 w-4" /> Email Landlord
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        onClick={handlePhone}
                        variant="outline" 
                        className="w-full h-10 rounded-xl bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-600 font-semibold border-slate-200"
                      >
                        <Phone className="mr-2 h-4 w-4" /> Call
                      </Button>
                      <Button 
                        onClick={handleWhatsApp}
                        variant="outline" 
                        className="w-full h-10 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 hover:text-green-800 font-semibold border-green-200"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
        
        {similarProperties.length > 0 && (
             <div className="pt-12 border-t border-slate-200/60 mt-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900">Similar Properties</h2>
                    <Link href="/properties">
                      <Button variant="ghost" className="text-sky-600 font-bold hover:bg-sky-50 hover:text-sky-700">
                          View All <ChevronRight className="ml-1 h-5 w-5" />
                      </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {similarProperties.map(sim => (
                        <PropertyCard key={sim.id} property={sim} />
                    ))}
                </div>
             </div>
        )}

      </div>
    </div>
  );
}

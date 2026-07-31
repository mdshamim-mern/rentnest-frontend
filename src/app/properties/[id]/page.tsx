"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getPropertyById } from "@/lib/api/properties.api";
import { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { MapPin, User, CheckCircle2, Home, Share, Calendar, BedDouble, Bath, SquareSquare, ShieldCheck, Wifi, Car, ThermometerSnowflake, MessageSquare, Phone, MessageCircle } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";
import { axiosInstance } from "@/lib/api/axiosInstance";
import toast from "react-hot-toast";

export default function PropertyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTourLoading, setIsTourLoading] = useState(false);

  const fallbackImage = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=2000";
  const smallImage1 = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800";
  const smallImage2 = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800";

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await getPropertyById(params.id as string);
        if (res.success) setProperty(res.data);
      } catch (error) {
        toast.error("Failed to load property details");
        router.push("/properties");
      } finally {
        setIsLoading(false);
      }
    };
    if (params.id) fetchProperty();
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
    if (property?.landlord?.email) {
      window.location.href = `mailto:${property.landlord.email}?subject=Inquiry about ${property.title}`;
    }
  };

  const handlePhone = () => {
    window.location.href = `tel:+8801865190471`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/8801865190471`, '_blank');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Property link copied to clipboard!");
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-sky-50/40 to-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[50vh] md:h-[60vh] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-sky-100/50">
          <div className="md:col-span-2 relative h-full group">
            <Image 
              src={(property as any).image || fallbackImage} 
              alt={property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="bg-sky-500/90 backdrop-blur-md w-fit px-4 py-1.5 rounded-full text-white text-sm font-bold tracking-wider uppercase mb-3 shadow-lg">
                {property.category?.name || "Premium"}
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
            <div className="relative w-full h-full overflow-hidden group">
              <Image 
                src={smallImage2} 
                alt="Interior view 2" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center cursor-pointer">
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
                <div><p className="text-sm text-slate-500 font-medium">Bedrooms</p><p className="font-bold text-slate-900">3 Beds</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/50 shadow-sm">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-full"><Bath className="h-5 w-5" /></div>
                <div><p className="text-sm text-slate-500 font-medium">Bathrooms</p><p className="font-bold text-slate-900">2 Baths</p></div>
              </div>
              <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/50 shadow-sm">
                <div className="p-2 bg-sky-100 text-sky-600 rounded-full"><SquareSquare className="h-5 w-5" /></div>
                <div><p className="text-sm text-slate-500 font-medium">Area</p><p className="font-bold text-slate-900">1,850 sqft</p></div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">About this Property</h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap bg-white/40 p-8 rounded-3xl border border-white/50 shadow-sm">
                {property.description}
              </p>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                  <Wifi className="h-8 w-8 text-sky-500 mb-3" />
                  <span className="font-medium text-slate-700">High-Speed WiFi</span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                  <Car className="h-8 w-8 text-sky-500 mb-3" />
                  <span className="font-medium text-slate-700">Private Parking</span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                  <ThermometerSnowflake className="h-8 w-8 text-sky-500 mb-3" />
                  <span className="font-medium text-slate-700">Central AC</span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
                  <ShieldCheck className="h-8 w-8 text-sky-500 mb-3" />
                  <span className="font-medium text-slate-700">24/7 Security</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Explore the Area</h2>
              <div className="w-full h-80 bg-slate-200 rounded-3xl overflow-hidden relative border border-white/50 shadow-md">
                 <Image 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600" 
                    alt="Map view" 
                    fill 
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="secondary" className="rounded-full font-bold shadow-xl hover:scale-105 transition-transform">
                      <MapPin className="mr-2 h-4 w-4 text-sky-500" /> View on Map
                    </Button>
                  </div>
              </div>
            </div>

          </div>
          
          <div className="relative">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white/60 backdrop-blur-2xl border border-white/60 p-8 rounded-[2rem] shadow-xl shadow-sky-100/50">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-1">Monthly Rent</div>
                    <div className="text-4xl font-extrabold text-slate-900">${property.price}</div>
                  </div>
                  <Button onClick={handleShare} variant="outline" size="icon" className="rounded-full h-10 w-10 bg-white/80 border-slate-200 hover:text-sky-500 hover:scale-110 transition-transform shadow-sm">
                    <Share className="h-4 w-4" />
                  </Button>
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
                      <div className="bg-sky-100 w-14 h-14 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                        <User className="h-7 w-7 text-sky-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg line-clamp-1">{property.landlord?.name || "Verified Owner"}</div>
                        <div className="text-sm text-sky-600 font-medium flex items-center mt-0.5">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Pro Landlord
                        </div>
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

      </div>
    </div>
  );
}
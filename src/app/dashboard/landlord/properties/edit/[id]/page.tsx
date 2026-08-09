"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("@/components/map/LocationPickerMap"), {
  ssr: false,
  loading: () => <div className="h-87.5 w-full bg-slate-100 animate-pulse rounded-xl" />
});

const AMENITIES_LIST = [
  "Security Guard", "CCTV Camera", "Generator", "Community Hall", "Prayer Room", "GYM", 
  "Swimming Pool", "Barbeque Area", "Garden", "Intercom", "Fire Exit", "Fire Exitinguisher", 
  "Wi-Fi Connectivity", "WASA Connection", "Submersible Pump"
];

const RENT_FOR_LIST = ["Family", "Bachelor"];

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  price: z.coerce.number().positive("Price must be a positive number"),
  categoryId: z.string().min(1, "Please select a category"),
  isAvailable: z.boolean(),
  rentType: z.string().optional(),
  rentNegotiable: z.boolean().optional(),
  floorArea: z.coerce.number().positive("Area must be positive").optional().or(z.literal("")),
  rentFor: z.array(z.string()).optional(),
  bedrooms: z.coerce.number().nonnegative().optional().or(z.literal("")),
  bathrooms: z.coerce.number().nonnegative().optional().or(z.literal("")),
  balcony: z.coerce.number().nonnegative().optional().or(z.literal("")),
  floorLevel: z.string().optional(),
  gas: z.string().optional(),
  parking: z.string().optional(),
  lift: z.string().optional(),
  furnished: z.string().optional(),
  facing: z.string().optional(),
  serviceCharge: z.coerce.number().nonnegative().optional().or(z.literal("")),
  availableFrom: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  videoLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  propertyType: z.string().optional(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      lat: 23.7937,
      lng: 90.4066,
      categoryId: "",
      isAvailable: true,
      rentType: "",
      rentNegotiable: false,
      floorArea: "" as any,
      rentFor: [],
      bedrooms: "" as any,
      bathrooms: "" as any,
      balcony: "" as any,
      floorLevel: "",
      gas: "",
      parking: "",
      lift: "",
      furnished: "",
      facing: "",
      serviceCharge: "" as any,
      availableFrom: "",
      videoLink: "",
      propertyType: "",
      amenities: [],
    }
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [catRes, propRes] = await Promise.all([
          axiosInstance.get('/categories'),
          axiosInstance.get(`/properties/${params.id}`)
        ]);

        if (catRes.data.success) {
          setCategories(catRes.data.data);
        }

        if (propRes.data.success) {
          const property = propRes.data.data;
          
          let formattedAvailableFrom = "";
          if (property.availableFrom) {
             const date = new Date(property.availableFrom);
             formattedAvailableFrom = date.toISOString().split('T')[0];
          }

          reset({
            title: property.title || "",
            description: property.description || "",
            location: property.location || "",
            lat: property.lat !== null && property.lat !== undefined ? property.lat : 23.7937,
            lng: property.lng !== null && property.lng !== undefined ? property.lng : 90.4066,
            price: property.price || ("" as any),
            categoryId: property.categoryId || "",
            isAvailable: property.isAvailable !== false,
            rentType: property.rentType || "",
            rentNegotiable: property.rentNegotiable || false,
            floorArea: property.floorArea || ("" as any),
            rentFor: property.rentFor || [],
            bedrooms: property.bedrooms !== null && property.bedrooms !== undefined ? property.bedrooms : ("" as any),
            bathrooms: property.bathrooms !== null && property.bathrooms !== undefined ? property.bathrooms : ("" as any),
            balcony: property.balcony !== null && property.balcony !== undefined ? property.balcony : ("" as any),
            floorLevel: property.floorLevel || "",
            gas: property.gas || "",
            parking: property.parking || "",
            lift: property.lift || "",
            furnished: property.furnished || "",
            facing: property.facing || "",
            serviceCharge: property.serviceCharge || ("" as any),
            availableFrom: formattedAvailableFrom,
            amenities: property.amenities || [],
            videoLink: property.videoLink || "",
            propertyType: property.propertyType || "",
          });
          
          if (property.image) {
            setImagePreview(property.image);
          }
          if (property.images && property.images.length > 0) {
              setImagePreviews(property.images);
          }
        }
      } catch (error) {
        toast.error("Failed to load property data");
        router.push('/dashboard/landlord/properties');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchInitialData();
    }
  }, [params.id, reset, router]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles(prev => {
        const combined = [...prev, ...newFiles].slice(0, 19);
        return combined;
      });
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 19));
    }
  };

  const removeAdditionalImage = (index: number) => {
    const previewToRemove = imagePreviews[index];
    
    if (previewToRemove && previewToRemove.startsWith("blob:")) {
       setImageFiles(prev => {
         const newFiles = [...prev];
         newFiles.splice(index - (imagePreviews.length - prev.length), 1);
         return newFiles;
       });
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true);

      let mainImageUrl = imagePreview && !imagePreview.startsWith("blob:") ? imagePreview : "";
      let additionalImageUrls: string[] = imagePreviews.filter(p => !p.startsWith("blob:"));

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await axiosInstance.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          mainImageUrl = uploadRes.data.data.url;
        } else {
          toast.error("Main image upload failed");
          setIsSubmitting(false);
          return;
        }
      }

      for (const file of imageFiles) {
        const formData = new FormData();
        formData.append("image", file);
        try {
          const uploadRes = await axiosInstance.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (uploadRes.data.success) {
            additionalImageUrls.push(uploadRes.data.data.url);
          }
        } catch(e) {
             console.error("Additional image upload failed", e);
        }
      }

      const submitData: any = {
        title: data.title,
        description: data.description,
        location: data.location,
        lat: data.lat,
        lng: data.lng,
        price: Number(data.price),
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
        rentType: data.rentType,
        rentNegotiable: data.rentNegotiable,
        floorArea: (data.floorArea !== undefined && data.floorArea !== "") ? Number(data.floorArea) : null,
        rentFor: data.rentFor,
        bedrooms: (data.bedrooms !== undefined && data.bedrooms !== "") ? Number(data.bedrooms) : null,
        bathrooms: (data.bathrooms !== undefined && data.bathrooms !== "") ? Number(data.bathrooms) : null,
        balcony: (data.balcony !== undefined && data.balcony !== "") ? Number(data.balcony) : null,
        floorLevel: data.floorLevel,
        gas: data.gas,
        parking: data.parking,
        lift: data.lift,
        furnished: data.furnished,
        facing: data.facing,
        serviceCharge: (data.serviceCharge !== undefined && data.serviceCharge !== "") ? Number(data.serviceCharge) : null,
        availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString() : null,
        amenities: data.amenities,
        videoLink: data.videoLink,
        propertyType: data.propertyType,
        ...(mainImageUrl ? { image: mainImageUrl } : {}),
        ...(additionalImageUrls.length > 0 ? { images: additionalImageUrls } : { images: [] })
      };

      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined || submitData[key] === "") {
          delete submitData[key];
        }
      });

      const response = await axiosInstance.patch(`/properties/${params.id}`, submitData);
      
      if (response.data.success) {
        toast.success("Property updated successfully");
        router.push('/dashboard/landlord/properties');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Select category";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-sky-500 h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Property</h1>
        <p className="text-slate-500 mt-1">Update the details of your property listing.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
          <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-800">Property Category & Type</CardTitle>
          </div>
          <CardContent className="p-6 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
       <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700">Property Category *</label>
         <Select value={watch("categoryId") || ""} onValueChange={(val: any) => setValue("categoryId", val || "", { shouldValidate: true })}>
           <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
             <SelectValue placeholder="Select category">{getCategoryName(watch("categoryId") || "")}</SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {categories.map((cat) => (
               <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                 ))}
            </SelectContent>
           </Select>
            {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
       </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Property Type</label>
                <Select value={watch("propertyType") || ""} onValueChange={(val) => setValue("propertyType", val ?? undefined)}>
                  <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Single Room">Single Room</SelectItem>
                    <SelectItem value="Sublet Room">Sublet Room</SelectItem>
                    <SelectItem value="Roommate">Roommate</SelectItem>
                    <SelectItem value="Girls Hostel">Girls Hostel</SelectItem>
                    <SelectItem value="Boys Hostel">Boys Hostel</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Full Building">Full Building</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
           <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-800">Basic Information & Location</CardTitle>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Property Title *</label>
              <Input {...register("title")} placeholder="e.g. 3 Bedroom Flat for rent in Dhanmondi" className="bg-white border-slate-200 h-12 rounded-xl" />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Location Area *</label>
              <Input {...register("location")} placeholder="e.g. House-08, Road-11, Block-A, Dhanmondi, Dhaka" className="bg-white border-slate-200 h-12 rounded-xl" />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Exact Map Location *</label>
              <LocationPickerMap 
                initialLat={watch("lat")}
                initialLng={watch("lng")}
                onLocationSelect={(lat, lng) => {
                  setValue("lat", lat);
                  setValue("lng", lng);
                }} 
              />
              {errors.lat && <p className="text-sm text-red-500">Please select location on map</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rent Type</label>
               <Select value={watch("rentType") || ""} onValueChange={(val) => setValue("rentType", val ?? undefined)}>
                  <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                    <SelectValue placeholder="Per Month" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Per Month">Per Month</SelectItem>
                    <SelectItem value="Per Year">Per Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rent Amount *</label>
                <div className="flex gap-4 items-center">
                    <Input {...register("price")} type="number" placeholder="e.g. 15000" className="bg-white border-slate-200 h-12 rounded-xl flex-1" />
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                        <input type="checkbox" {...register("rentNegotiable")} className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                        Negotiable
                    </label>
                </div>
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Floor Area (Square Feet)</label>
                    <Input {...register("floorArea")} type="number" placeholder="e.g. 1800" className="bg-white border-slate-200 h-12 rounded-xl" />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Available From</label>
                    <Input {...register("availableFrom")} type="date" className="bg-white border-slate-200 h-12 rounded-xl" />
                </div>
            </div> 
            <div className="space-y-3">
                 <label className="text-sm font-medium text-slate-700">Rent For *</label>
                 <div className="flex gap-6">
                    {RENT_FOR_LIST.map((item) => (
                        <label key={item} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="checkbox" 
                                value={item}
                                {...register("rentFor")}
                                className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" 
                            />
                            <span className="text-sm text-slate-700">{item}</span>
                        </label>
                    ))}
                 </div>
            </div>

          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
           <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-800">Property Details</CardTitle>
          </div>
          <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Bedroom *</label>
                    <Select value={watch("bedrooms")?.toString() || ""} onValueChange={(val) => setValue("bedrooms", Number(val))}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Bathroom *</label>
                    <Select value={watch("bathrooms")?.toString() || ""} onValueChange={(val) => setValue("bathrooms", Number(val))}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {[1, 2, 3, 4, 5, 6].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Balcony</label>
                    <Select value={watch("balcony")?.toString() || ""} onValueChange={(val) => setValue("balcony", Number(val))}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {[0, 1, 2, 3, 4, 5, 6].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </div>

                   <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Floor Available On</label>
<Select value={watch("floorLevel") || ""} onValueChange={(val) => setValue("floorLevel", val ?? undefined)}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl max-h-60">
                            <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                            <SelectItem value="1st Floor">1st Floor</SelectItem>
                            <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                            <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                            <SelectItem value="4th Floor">4th Floor</SelectItem>
                            <SelectItem value="5th Floor">5th Floor</SelectItem>
                            <SelectItem value="6th Floor">6th Floor</SelectItem>
                            <SelectItem value="7th Floor">7th Floor</SelectItem>
                            <SelectItem value="8th Floor">8th Floor</SelectItem>
                            <SelectItem value="9th Floor">9th Floor</SelectItem>
                            <SelectItem value="10th Floor">10th Floor</SelectItem>
                            <SelectItem value="15th or More">15th or More</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
              </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Gas</label>
                   <Select value={watch("gas") || ""} onValueChange={(val) => setValue("gas", val ?? undefined)}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="Titas Gas">Titas Gas</SelectItem>
                            <SelectItem value="LPG">LPG</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Parking</label>
<Select value={watch("parking") || ""} onValueChange={(val) => setValue("parking", val ?? undefined)}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                             {[1, 2, 3, 4, 5].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                            <SelectItem value="Not Available">Not Available</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Lift</label>
                   <Select value={watch("lift") || ""} onValueChange={(val) => setValue("lift", val ?? undefined)}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {[1, 2, 3, 4].map(num => (
                                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                             <SelectItem value="Not Available">Not Available</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                   <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Furnished</label>
                   <Select value={watch("furnished") || ""} onValueChange={(val) => setValue("furnished", val ?? undefined)}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                            <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                            <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Facing</label>
                    <Select value={watch("facing") || ""} onValueChange={(val) => setValue("facing", val ?? undefined)}>
                        <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                            <SelectValue placeholder="Choose" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="South">South</SelectItem>
                            <SelectItem value="North">North</SelectItem>
                            <SelectItem value="East">East</SelectItem>
                            <SelectItem value="West">West</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Service Charge</label>
                    <Input {...register("serviceCharge")} type="number" placeholder="e.g. 3000" className="bg-white border-slate-200 h-12 rounded-xl" />
                </div>
              </div>

          </CardContent>
        </Card>

         <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
           <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-800">Amenities</CardTitle>
          </div>
          <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {AMENITIES_LIST.map((amenity) => (
                       <label key={amenity} className="flex items-center gap-2 cursor-pointer bg-white/50 p-3 rounded-xl border border-slate-100 hover:border-sky-200 transition-colors">
                            <input
                                type="checkbox"
                                value={amenity}
                                {...register("amenities")}
                                className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                            />
                            <span className="text-sm text-slate-700">{amenity}</span>
                        </label>
                  ))}
              </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
           <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-800">Media & Description</CardTitle>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description *</label>
              <Textarea
                {...register("description")}
                placeholder="Describe your property in detail..."
                className="bg-white border-slate-200 min-h-40 resize-none rounded-xl focus-visible:ring-sky-500"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Main Image (Thumbnail) *</label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-slate-200" />
                )}
                <Input type="file" accept="image/*" onChange={handleMainImageChange} className="bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-sky-500 pt-2.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Additional Photos (Max 19)</label>
              <Input type="file" accept="image/*" multiple onChange={handleAdditionalImagesChange} className="bg-white border-slate-200 h-12 rounded-xl focus-visible:ring-sky-500 pt-2.5" />
               {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pb-2">
                      {imagePreviews.map((src, i) => (
                          <div key={i} className="relative group">
                              <img src={src} alt="Additional Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0" />
                              <button 
                                  type="button" 
                                  onClick={() => removeAdditionalImage(i)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                  ×
                              </button>
                          </div>
                      ))}
                  </div>
              )}
            </div>

             <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">YouTube Video Link</label>
              <Input {...register("videoLink")} type="url" placeholder="https://youtube.com/watch?v=..." className="bg-white border-slate-200 h-12 rounded-xl" />
            </div>

            <div className="flex items-center space-x-3 bg-sky-50/50 p-4 rounded-xl border border-sky-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("isAvailable")} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
              <span className="text-sm font-bold text-slate-700">Available for Rent Immediately</span>
            </div>

          </CardContent>
        </Card>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-16 text-xl font-bold bg-slate-900 hover:bg-sky-600 text-white shadow-xl shadow-slate-900/20 rounded-2xl transition-all hover:scale-[1.01] flex items-center justify-center"
        >
          {isSubmitting ? (
            <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Updating Property...</>
          ) : (
            "Update Property Listing"
          )}
        </Button>
      </form>
    </div>
  );
}
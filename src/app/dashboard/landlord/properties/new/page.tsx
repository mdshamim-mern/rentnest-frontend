"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

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
  lat: z.coerce.number().min(-90).max(90).optional().or(z.literal("")),
  lng: z.coerce.number().min(-180).max(180).optional().or(z.literal("")),
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

export default function NewPropertyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      lat: "" as any,
      lng: "" as any,
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

  const selectedCategory = watch("categoryId");
  const currentPropertyType = watch("propertyType");
  const currentRentType = watch("rentType");
  const currentBedrooms = watch("bedrooms");
  const currentBathrooms = watch("bathrooms");
  const currentBalcony = watch("balcony");
  const currentFloorLevel = watch("floorLevel");
  const currentGas = watch("gas");
  const currentParking = watch("parking");
  const currentLift = watch("lift");
  const currentFurnished = watch("furnished");
  const currentFacing = watch("facing");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/categories');
        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true);

      if (!imageFile) {
        toast.error("Please select a main image");
        setIsSubmitting(false);
        return;
      }

      let finalLat = undefined;
      let finalLng = undefined;

      if (data.location) {
        try {
          const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
          if (token) {
            const geoRes = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(data.location)}.json?access_token=${token}`);
            const geoData = await geoRes.json();
            if (geoData.features && geoData.features.length > 0) {
              finalLng = geoData.features[0].center[0];
              finalLat = geoData.features[0].center[1];
            }
          }
        } catch (error) {
        }
      }

      const formData = new FormData();

      const submitData: any = {
        title: data.title,
        description: data.description,
        location: data.location,
        lat: finalLat,
        lng: finalLng,
        price: Number(data.price),
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
        rentType: data.rentType,
        rentNegotiable: data.rentNegotiable,
        floorArea: (data.floorArea !== undefined && data.floorArea !== "") ? Number(data.floorArea) : undefined,
        rentFor: data.rentFor,
        bedrooms: (data.bedrooms !== undefined && data.bedrooms !== "") ? Number(data.bedrooms) : undefined,
        bathrooms: (data.bathrooms !== undefined && data.bathrooms !== "") ? Number(data.bathrooms) : undefined,
        balcony: (data.balcony !== undefined && data.balcony !== "") ? Number(data.balcony) : undefined,
        floorLevel: data.floorLevel,
        gas: data.gas,
        parking: data.parking,
        lift: data.lift,
        furnished: data.furnished,
        facing: data.facing,
        serviceCharge: (data.serviceCharge !== undefined && data.serviceCharge !== "") ? Number(data.serviceCharge) : undefined,
        availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString() : undefined,
        amenities: data.amenities,
        videoLink: data.videoLink,
        propertyType: data.propertyType,
      };

      Object.keys(submitData).forEach(key => {
        if (submitData[key] !== undefined && submitData[key] !== null && submitData[key] !== "") {
          if (Array.isArray(submitData[key])) {
            submitData[key].forEach((val: string) => {
              formData.append(key, val);
            });
          } else {
            formData.append(key, String(submitData[key]));
          }
        }
      });    
      formData.append("image", imageFile);

      imageFiles.forEach(file => {
        formData.append("images", file);
      });

      const response = await axiosInstance.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success || response.status === 201) {
        toast.success("Property created successfully");
        router.push('/dashboard/landlord/properties');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? cat.name : "Select category";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Property</h1>
        <p className="text-slate-500 mt-1">Fill in the details to list a new property.</p>
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
                <Select
                  value={selectedCategory || undefined}
                  onValueChange={(val: any) => setValue("categoryId", val, { shouldValidate: true })}
                >
                  <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                    <SelectValue placeholder="Select category">
                      {selectedCategory ? getCategoryName(selectedCategory) : undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Property Type</label>
                <Select value={currentPropertyType || ""} onValueChange={(val: any) => setValue("propertyType", val || "")}>
                  <SelectTrigger className="bg-white border-slate-200 h-12 rounded-xl focus:ring-sky-500">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Duplex">Duplex</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Townhouse">Townhouse</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
           <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
            <CardTitle className="text-xl text-slate-800">Basic Information</CardTitle>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Property Title *</label>
              <Input {...register("title")} placeholder="e.g. 3 Bedroom Flat for rent in Dhanmondi" className="bg-white border-slate-200 h-12 rounded-xl" />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Location *</label>
              <Input {...register("location")} placeholder="e.g. House-08, Road-11, Block-A, Dhanmondi, Dhaka" className="bg-white border-slate-200 h-12 rounded-xl" />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rent Type</label>
                <Select value={currentRentType || ""} onValueChange={(val: any) => setValue("rentType", val || "")}>
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
                    <Select value={currentBedrooms?.toString() || ""} onValueChange={(val: any) => setValue("bedrooms", val ? Number(val) : undefined)}>
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
                    <Select value={currentBathrooms?.toString() || ""} onValueChange={(val: any) => setValue("bathrooms", val ? Number(val) : undefined)}>
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
                    <Select value={currentBalcony?.toString() || ""} onValueChange={(val: any) => setValue("balcony", val ? Number(val) : undefined)}>
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
                    <Select value={currentFloorLevel || ""} onValueChange={(val: any) => setValue("floorLevel", val || "")}>
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
                    <Select value={currentGas || ""} onValueChange={(val: any) => setValue("gas", val || "")}>
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
                    <Select value={currentParking || ""} onValueChange={(val: any) => setValue("parking", val || "")}>
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
                    <Select value={currentLift || ""} onValueChange={(val: any) => setValue("lift", val || "")}>
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
                    <Select value={currentFurnished || ""} onValueChange={(val: any) => setValue("furnished", val || "")}>
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
                    <Select value={currentFacing || ""} onValueChange={(val: any) => setValue("facing", val || "")}>
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
            <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> Publishing Property...</>
          ) : (
            "Publish Property Listing"
          )}
        </Button>
      </form>
    </div>
  );
}
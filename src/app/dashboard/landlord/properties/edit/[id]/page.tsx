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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(5, "Location must be at least 5 characters"),
  price: z.coerce.number().positive("Price must be a positive number"),
  categoryId: z.string().min(1, "Please select a category"),
  isAvailable: z.boolean(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
  });

  const currentCategoryId = watch("categoryId");

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
          reset({
            title: property.title,
            description: property.description,
            location: property.location,
            price: property.price,
            categoryId: property.categoryId,
            isAvailable: property.isAvailable !== false,
          });
          setValue("categoryId", property.categoryId);
          if (property.image) {
            setImagePreview(property.image);
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
  }, [params.id, reset, setValue, router]);

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true);
      let imageUrl = imagePreview && !imagePreview.startsWith("blob:") ? imagePreview : "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await axiosInstance.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (uploadRes.data.success) {
          imageUrl = uploadRes.data.data.url;
        } else {
          toast.error("Image upload failed");
          setIsSubmitting(false);
          return;
        }
      }

      const submitData = {
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
        ...(imageUrl ? { image: imageUrl } : {})
      };
      const response = await axiosInstance.patch(`/properties/${params.id}`, submitData);
      if (response.data.success) {
        toast.success("Property updated successfully");
        router.push('/dashboard/landlord/properties');
      }
    } catch (error) {
      toast.error("Failed to update property");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-sky-500 h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Property</h1>
        <p className="text-slate-500 mt-1">Update the details of your property listing.</p>
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800">Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Property Title</label>
              <Input
                {...register("title")}
                placeholder="e.g. Modern Apartment in Downtown"
                className="bg-white/60 border-slate-200/60 h-12 rounded-xl focus-visible:ring-sky-500"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Monthly Rent ($)</label>
                <Input
                  {...register("price")}
                  type="number"
                  placeholder="e.g. 1500"
                  className="bg-white/60 border-slate-200/60 h-12 rounded-xl focus-visible:ring-sky-500"
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <Select value={currentCategoryId || ""} onValueChange={(val: any) => setValue("categoryId", val, { shouldValidate: true })}>
                  <SelectTrigger className="bg-white/60 border-slate-200/60 h-12 rounded-xl focus:ring-sky-500">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-white/90 backdrop-blur-xl">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Location</label>
              <Input
                {...register("location")}
                placeholder="e.g. 123 Main St, City, Country"
                className="bg-white/60 border-slate-200/60 h-12 rounded-xl focus-visible:ring-sky-500"
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Property Image</label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="bg-white/60 border-slate-200/60 h-12 rounded-xl focus-visible:ring-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Textarea
                {...register("description")}
                placeholder="Describe your property..."
                className="bg-white/60 border-slate-200/60 min-h-32 resize-none rounded-xl focus-visible:ring-sky-500"
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
            </div>

            <div className="flex items-center space-x-3 bg-white/40 p-4 rounded-xl border border-slate-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" {...register("isAvailable")} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sky-500"></div>
              </label>
              <span className="text-sm font-bold text-slate-700">Available for Rent</span>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-xl shadow-sky-500/30 rounded-2xl transition-all hover:scale-[1.02] flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Property"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
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

export default function NewPropertyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      isAvailable: true,
    }
  });

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setIsSubmitting(true);
      let imageUrl = "";

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
      } else {
        toast.error("Please select an image");
        setIsSubmitting(false);
        return;
      }

      const submitData = {
        title: data.title,
        description: data.description,
        location: data.location,
        price: data.price,
        categoryId: data.categoryId,
        isAvailable: data.isAvailable,
        image: imageUrl
      };

      const response = await axiosInstance.post('/properties', submitData);
      
      if (response.data.success || response.status === 201) {
        toast.success("Property created successfully");
        router.push('/dashboard/landlord/properties');
      }
    } catch (error) {
      toast.error("Failed to create property");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Property</h1>
        <p className="text-slate-500 mt-1">Fill in the details to list a new property.</p>
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
                <Select onValueChange={(val: any) => setValue("categoryId", val, { shouldValidate: true })}>
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
              <label className="text-sm font-medium text-slate-700">Upload Image</label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-white/60 border-slate-200/60 h-12 rounded-xl focus-visible:ring-sky-500 pt-2.5"
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
                    Publishing...
                  </>
                ) : (
                  "Publish Property"
                )}
              </Button>   
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
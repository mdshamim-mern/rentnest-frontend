"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CalendarDays, Home } from "lucide-react";
import toast from "react-hot-toast";

const requestSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

type RequestFormValues = z.infer<typeof requestSchema>;

function RequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: RequestFormValues) => {
    if (!propertyId) {
      toast.error("Property ID is missing");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        propertyId,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      const response = await axiosInstance.post('/rentals', payload);
      
      if (response.data.success) {
        toast.success("Rental request submitted successfully!");
        router.push('/dashboard/tenant/requests');
      }
    } catch (error) {
      toast.error("Failed to submit rental request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!propertyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <Home className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">No Property Selected</h2>
        <p className="text-slate-500 mt-2 mb-6">Please select a property to rent first.</p>
        <Button onClick={() => router.push('/properties')} className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl">
          Browse Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Submit Rental Request</h1>
        <p className="text-slate-500 mt-1">Select your preferred dates to rent this property.</p>
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-sky-500" />
            Rental Duration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Move-in Date</label>
                <Input
                  type="date"
                  {...register("startDate")}
                  className="bg-white/60 border-slate-200/60 h-14 rounded-xl focus-visible:ring-sky-500 text-lg"
                />
                {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Move-out Date</label>
                <Input
                  type="date"
                  {...register("endDate")}
                  className="bg-white/60 border-slate-200/60 h-14 rounded-xl focus-visible:ring-sky-500 text-lg"
                />
                {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Message to Landlord (Optional)</label>
              <Textarea
                placeholder="Hi, I am very interested in your property..."
                className="bg-white/60 border-slate-200/60 min-h-32 resize-none rounded-xl focus-visible:ring-sky-500"
              />
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
                    Submitting Request...
                  </>
                ) : (
                  "Confirm Request"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewRentalRequestPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-sky-500 h-10 w-10" /></div>}>
      <RequestForm />
    </Suspense>
  );
}
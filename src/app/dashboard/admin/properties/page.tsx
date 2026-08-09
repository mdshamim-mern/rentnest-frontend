"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import toast from "react-hot-toast";
import ReviewModerationModal from "@/components/dashboard/admin/ReviewModerationModal";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/properties');
      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Platform Properties</h1>
        <p className="text-slate-500 mt-1">View all properties listed across the platform.</p>
      </div>

      <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/60">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Property Title</TableHead>
                  <TableHead className="font-semibold text-slate-700">Landlord</TableHead>
                  <TableHead className="font-semibold text-slate-700">Location</TableHead>
                  <TableHead className="font-semibold text-slate-700">Category</TableHead>
                  <TableHead className="font-semibold text-slate-700">Price</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-slate-500">
                      No properties exist on the platform.
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((property) => (
                    <TableRow key={property.id} className="hover:bg-white/40 transition-colors">
                      <TableCell className="font-medium text-slate-900">{property.title}</TableCell>
                      <TableCell className="text-slate-600">{property.landlord?.name}</TableCell>
                      <TableCell className="text-slate-600">{property.location}</TableCell>
                      <TableCell>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {property.category?.name}
                        </span>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        ${property.price}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          onClick={() => setSelectedPropertyId(property.id)}
                          variant="outline"
                          size="sm"
                          className="bg-white hover:bg-sky-50 text-sky-600 border-sky-200"
                        >
                          <Eye className="w-4 h-4 mr-2" /> Reviews
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ReviewModerationModal 
        propertyId={selectedPropertyId} 
        isOpen={!!selectedPropertyId} 
        onClose={() => setSelectedPropertyId(null)} 
      />
    </div>
  );
}
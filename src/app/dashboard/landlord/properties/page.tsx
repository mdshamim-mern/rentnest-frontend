"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/lib/store/authStore";

export default function LandlordPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const user = useAuthStore((state: any) => state.user);

  useEffect(() => {
    if (user?.id) {
      fetchProperties();
    }
  }, [user?.id]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/properties?landlordId=${user.id}`);
      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      const response = await axiosInstance.delete(`/properties/${id}`);
      if (response.data.success) {
        toast.success("Property deleted successfully");
        setProperties(properties.filter(p => p.id !== id));
      }
    } catch (error) {
      toast.error("Failed to delete property");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Properties</h1>
          <p className="text-slate-500 mt-1">Manage your property listings.</p>
        </div>
        <Link href="/dashboard/landlord/properties/new">
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-xl">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/60">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Title</TableHead>
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
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                      You haven't listed any properties yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  [...properties].reverse().map((property) => (
                    <TableRow key={property.id} className="hover:bg-white/40 transition-colors">
                      <TableCell className="font-medium text-slate-900">{property.title}</TableCell>
                      <TableCell className="text-slate-600">{property.location}</TableCell>
                      <TableCell className="text-slate-600">{property.category?.name}</TableCell>
                      <TableCell className="text-slate-900 font-semibold">${property.price}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            onClick={() => router.push(`/dashboard/landlord/properties/edit/${property.id}`)}
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 bg-white/50 border-slate-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            onClick={() => handleDelete(property.id)} 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 bg-white/50 border-slate-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
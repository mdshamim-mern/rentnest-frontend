"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property, RentalRequest } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, CheckCircle2, DollarSign, Loader2, Calendar } from "lucide-react";
import { useAuthStore } from "@/lib/store/authStore";

export default function LandlordDashboardOverview() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [tourRequests, setTourRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuthStore((state: any) => state.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      
      try {
        const propsRes = await axiosInstance.get(`/properties?landlordId=${user.id}`);
        const propsData = propsRes.data;
        
        if (Array.isArray(propsData)) {
          setProperties(propsData);
        } else if (propsData?.data && Array.isArray(propsData.data)) {
          setProperties(propsData.data);
        } else if (propsData?.properties && Array.isArray(propsData.properties)) {
          setProperties(propsData.properties);
        }
      } catch (error) {
        console.error("Properties fetch error:", error);
      }

      try {
        const reqsRes = await axiosInstance.get('/landlord/requests');
        const reqsData = reqsRes.data;
        
        if (Array.isArray(reqsData)) {
          setRequests(reqsData);
        } else if (reqsData?.data && Array.isArray(reqsData.data)) {
          setRequests(reqsData.data);
        } else if (reqsData?.requests && Array.isArray(reqsData.requests)) {
          setRequests(reqsData.requests);
        }
      } catch (error) {
        console.error("Requests fetch error:", error);
      }

      try {
        const tourRes = await axiosInstance.get('/landlord/tour-requests');
        const tourData = tourRes.data;
        
        if (Array.isArray(tourData)) {
          setTourRequests(tourData);
        } else if (tourData?.data && Array.isArray(tourData.data)) {
          setTourRequests(tourData.data);
        } else if (tourData?.requests && Array.isArray(tourData.requests)) {
          setTourRequests(tourData.requests);
        }
      } catch (error) {
        console.error("Tour requests fetch error:", error);
      }
      
      setIsLoading(false);
    };
    
    fetchDashboardData();
  }, [user?.id]);

  const pendingRequestsCount = requests.filter(r => r.status === "PENDING").length;
  const pendingToursCount = tourRequests.filter(r => r.status === "PENDING").length;
  const activeRentalsCount = requests.filter(r => r.status === "ACTIVE").length;
  const estimatedEarnings = requests
    .filter(r => r.status === "ACTIVE" || r.status === "COMPLETED")
    .reduce((sum, req) => sum + ((req as any).totalPaid > 0 ? (req as any).totalPaid : (req.property?.price || 0)), 0);

  const recentRequests = [...requests, ...tourRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="animate-spin text-sky-500 h-12 w-12" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Landlord Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage your properties, track requests, and view earnings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card className="bg-white/60 backdrop-blur-xl border-white/50 shadow-lg hover:shadow-xl transition-all rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Properties</CardTitle>
            <div className="p-2 bg-sky-50 rounded-xl shadow-sm">
              <Building2 className="h-5 w-5 text-sky-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{properties.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-white/50 shadow-lg hover:shadow-xl transition-all rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Rentals</CardTitle>
            <div className="p-2 bg-orange-50 rounded-xl shadow-sm">
              <FileText className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{pendingRequestsCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-white/50 shadow-lg hover:shadow-xl transition-all rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Tours</CardTitle>
            <div className="p-2 bg-purple-50 rounded-xl shadow-sm">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{pendingToursCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border-white/50 shadow-lg hover:shadow-xl transition-all rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Rentals</CardTitle>
            <div className="p-2 bg-green-50 rounded-xl shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-slate-900">{activeRentalsCount}</div>
          </CardContent>
        </Card>

        <Card className="bg-sky-500 border border-sky-400 shadow-lg shadow-sky-500/30 rounded-3xl text-white hover:shadow-xl transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Est. Earnings</CardTitle>
            <div className="p-2 bg-white/20 rounded-xl shadow-sm">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${estimatedEarnings}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/40 rounded-3xl">
          <div className="p-6 border-b border-white/50">
            <h2 className="text-xl font-bold text-slate-800">Recent Requests</h2>
          </div>
          <CardContent className="p-0">
            {recentRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                No requests received yet.
              </div>
            ) : (
              <div className="divide-y divide-white/40">
                {recentRequests.map(request => (
                  <div key={request.id} className="p-6 hover:bg-white/40 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{request.property?.title || "Property"}</h4>
                      <p className="text-sm text-slate-500 mt-1">Tenant: {request.tenant?.name || "Unknown"} ({request.startDate ? "Rental" : "Tour"})</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      request.status === 'PENDING' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      request.status === 'APPROVED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      request.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' :
                      'bg-green-100 text-green-700 border-green-200'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/40 rounded-3xl">
          <div className="p-6 border-b border-white/50">
            <h2 className="text-xl font-bold text-slate-800">Your Properties</h2>
          </div>
          <CardContent className="p-0">
            {properties.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                You haven't listed any properties yet.
              </div>
            ) : (
              <div className="divide-y divide-white/40">
                {[...properties].reverse().slice(0, 5).map(property => (
                  <div key={property.id} className="p-6 hover:bg-white/40 transition-colors flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{property.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{property.location}</p>
                    </div>
                    <div className="font-extrabold text-sky-600">
                      ${property.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Home } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";

export default function TenantDashboard() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/rentals');
        if (response.data.success) {
          setRequests(response.data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const pendingRequests = requests.filter(r => r.status === "PENDING").length;
  const approvedRequests = requests.filter(r => r.status === "APPROVED").length;
  const totalRequests = requests.length;

  const stats = [
    { title: "Total Requests", value: totalRequests, icon: <FileText className="h-6 w-6 text-blue-500" /> },
    { title: "Pending", value: pendingRequests, icon: <Clock className="h-6 w-6 text-orange-500" /> },
    { title: "Approved", value: approvedRequests, icon: <CheckCircle className="h-6 w-6 text-green-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tenant Dashboard</h1>
        <p className="text-slate-500 mt-2">Welcome back, {user?.name || "Tenant"}. Here is your rental overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white/40 backdrop-blur-xl border-white/60 shadow-lg hover:shadow-xl transition-all rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              <div className="p-2 bg-white/60 rounded-xl shadow-sm">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md mt-1" />
              ) : (
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-lg rounded-2xl mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Your Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-slate-200/50 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <div className="space-y-4">
              {requests.slice(0, 5).map(req => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-white/50 border border-white/60 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-slate-900">{req.property?.title || "Property"}</h4>
                    <p className="text-sm text-slate-500 flex items-center mt-1">
                      <Home className="w-3 h-3 mr-1" /> {req.property?.location || "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-primary">
                      ${req.property?.price || 0}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'APPROVED' ? 'bg-green-100 text-green-700 border border-green-200' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700 border border-red-200' :
                      'bg-orange-100 text-orange-700 border border-orange-200'
                    }`}>
                      {req.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 bg-white/30 rounded-xl border border-dashed border-slate-300">
              You haven't made any rental requests yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
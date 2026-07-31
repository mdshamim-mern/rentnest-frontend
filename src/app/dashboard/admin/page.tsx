"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, FileText, Activity } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Property, RentalRequest, User } from "@/types";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, propsRes, reqsRes] = await Promise.all([
          axiosInstance.get('/admin/users'),
          axiosInstance.get('/properties'),
          axiosInstance.get('/rentals/all')
        ]);
        if (usersRes.data.success) setUsers(usersRes.data.data);
        if (propsRes.data.success) setProperties(propsRes.data.data);
        if (reqsRes.data.success) setRequests(reqsRes.data.data);
      } catch (error) {
        console.error("Failed to load admin stats");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const pendingRequests = requests.filter(r => r.status === "PENDING").length;

  const stats = [
    { title: "Total Users", value: users.length, icon: <Users className="h-6 w-6 text-blue-500" /> },
    { title: "Total Properties", value: properties.length, icon: <Building className="h-6 w-6 text-primary" /> },
    { title: "Total Requests", value: requests.length, icon: <FileText className="h-6 w-6 text-green-500" /> },
    { title: "Pending Actions", value: pendingRequests, icon: <Activity className="h-6 w-6 text-orange-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Overview</h1>
        <p className="text-slate-500 mt-2">Platform statistics and global management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-200/50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-4">
                {users.slice(0, 4).map(u => (
                  <div key={u.id} className="flex items-center justify-between p-4 bg-white/50 border border-white/60 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-900">{u.name}</h4>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                      {u.role}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">No users found.</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-200/50 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : properties.length > 0 ? (
              <div className="space-y-4">
                {properties.slice(0, 4).map(prop => (
                  <div key={prop.id} className="flex items-center justify-between p-4 bg-white/50 border border-white/60 rounded-xl">
                    <div>
                      <h4 className="font-semibold text-slate-900">{prop.title}</h4>
                      <p className="text-sm text-slate-500">{prop.location}</p>
                    </div>
                    <div className="font-bold text-primary">
                      ${prop.price}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">No properties found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
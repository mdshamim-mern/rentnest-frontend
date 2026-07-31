"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { RentalRequest } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LandlordRequestsPage() {
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/landlord/requests');
      
      const reqData = response.data;
      if (Array.isArray(reqData)) {
        setRequests(reqData);
      } else if (reqData?.data && Array.isArray(reqData.data)) {
        setRequests(reqData.data);
      } else if (reqData?.requests && Array.isArray(reqData.requests)) {
        setRequests(reqData.requests);
      } else {
        console.warn("Unexpected format:", reqData);
      }
    } catch (error) {
      toast.error("Failed to fetch rental requests");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      setProcessingId(id);
      
      setRequests(current => current.map(req => 
        req.id === id ? { ...req, status } : req
      ));

      const response = await axiosInstance.patch(`/landlord/requests/${id}`, { status });
      
      if (response.data?.success || response.status === 200) {
        toast.success(`Request ${status.toLowerCase()} successfully`);
      }
    } catch (error) {
      toast.error("Failed to update status");
      fetchRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'APPROVED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Rental Requests</h1>
        <p className="text-slate-500 mt-2">Review and manage requests from tenants.</p>
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/40">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Property</TableHead>
                  <TableHead className="font-semibold text-slate-700">Tenant</TableHead>
                  <TableHead className="font-semibold text-slate-700">Dates</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-32 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                      No rental requests received yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-white/60 transition-colors">
                      <TableCell className="font-medium text-slate-900">
                        {request.property?.title || "Unknown Property"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {request.tenant?.name || "Unknown"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {request.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateStatus(request.id, "APPROVED")}
                              disabled={processingId === request.id}
                              className="bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-md"
                            >
                              {processingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleUpdateStatus(request.id, "REJECTED")}
                              disabled={processingId === request.id}
                              className="rounded-xl shadow-md"
                            >
                              {processingId === request.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                              Reject
                            </Button>
                          </div>
                        )}
                        {request.status !== "PENDING" && (
                          <span className="text-sm text-slate-400 font-medium">Processed</span>
                        )}
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
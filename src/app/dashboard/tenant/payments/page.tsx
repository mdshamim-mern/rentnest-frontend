"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Clock, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function TenantPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/payments');
      if (response.data.success) {
        setPayments(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch payment history");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPaid = payments
    .filter((p) => p.status === "COMPLETED" || p.status === "PAID")
    .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  const pendingPayments = payments.filter((p) => p.status === "PENDING").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payment History</h1>
        <p className="text-slate-500 mt-2">Track your rental payments and transaction history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-lg hover:shadow-xl transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Paid</CardTitle>
            <div className="p-2 bg-white/60 rounded-xl shadow-sm">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24 mt-1" />
            ) : (
              <div className="text-3xl font-bold text-slate-900">${totalPaid}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-lg hover:shadow-xl transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending Payments</CardTitle>
            <div className="p-2 bg-white/60 rounded-xl shadow-sm">
              <Clock className="h-5 w-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-3xl font-bold text-slate-900">{pendingPayments}</div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-lg hover:shadow-xl transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Transactions</CardTitle>
            <div className="p-2 bg-white/60 rounded-xl shadow-sm">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-16 mt-1" />
            ) : (
              <div className="text-3xl font-bold text-slate-900">{payments.length}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/40 backdrop-blur-xl border-white/60 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/60">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Transaction ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Property</TableHead>
                  <TableHead className="font-semibold text-slate-700">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Amount</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto rounded-full" /></TableCell>
                    </TableRow>
                  ))
                ) : payments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16 text-slate-500">
                      You have no payment history yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  payments.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-white/40 transition-colors">
                      <TableCell className="font-medium text-slate-600 text-sm">
                        {payment.transactionId || payment.id.slice(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {payment.rental?.property?.title || payment.rentalRequest?.property?.title || "Property Rental"}
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : "Date Not Available"}
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900">
                        ${payment.amount}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          payment.status === "COMPLETED" || payment.status === "PAID"
                            ? "bg-green-100 text-green-700 border border-green-200" 
                            : payment.status === "PENDING"
                            ? "bg-orange-100 text-orange-700 border border-orange-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}>
                          {payment.status}
                        </span>
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
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, CheckCircle2, Circle, Loader2, Trash2 } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import toast from "react-hot-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/contact');
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      setIsUpdating(id);
      const response = await axiosInstance.patch(`/contact/${id}/read`, { isRead: !currentStatus });
      
      if (response.data.success) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, isRead: !currentStatus } : msg
        ));
        toast.success(`Message marked as ${!currentStatus ? 'read' : 'unread'}`);
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      setIsDeleting(id);
      const response = await axiosInstance.delete(`/contact/${id}`);
      
      if (response.data.success) {
        setMessages(messages.filter(msg => msg.id !== id));
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Messages</h1>
          <p className="text-slate-500 mt-2">Manage contact form submissions from users.</p>
        </div>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold">
          {messages.filter(m => !m.isRead).length} Unread
        </div>
      </div>

      <Card className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-xl shadow-sky-100/50 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/40">
                <TableRow>
                  <TableHead className="w-12.5"></TableHead>
                  <TableHead className="font-semibold text-slate-700">Sender</TableHead>
                  <TableHead className="font-semibold text-slate-700">Email</TableHead>
                  <TableHead className="font-semibold text-slate-700 max-w-md">Message</TableHead>
                  <TableHead className="font-semibold text-slate-700">Date</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-4 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-64" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : messages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-slate-500">
                      <Mail className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      No messages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  messages.map((msg) => (
                    <TableRow key={msg.id} className={`transition-colors ${!msg.isRead ? 'bg-sky-50/50' : 'hover:bg-white/60'}`}>
                      <TableCell>
                        {!msg.isRead && <div className="h-2.5 w-2.5 rounded-full bg-primary mx-auto" />}
                      </TableCell>
                      <TableCell className={`font-medium ${!msg.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                        {msg.name}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <a href={`mailto:${msg.email}`} className="hover:text-primary hover:underline">
                          {msg.email}
                        </a>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className={`truncate ${!msg.isRead ? 'font-medium text-slate-800' : 'text-slate-500'}`} title={msg.message}>
                          {msg.message}
                        </p>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                          disabled={isUpdating === msg.id}
                          size="sm" 
                          variant="ghost" 
                          className={msg.isRead ? 'text-slate-400 hover:text-slate-600' : 'text-primary hover:text-primary/80'}
                          title={msg.isRead ? "Mark as unread" : "Mark as read"}
                        >
                          {isUpdating === msg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                            msg.isRead ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />
                          )}
                        </Button>
                        <Button 
                          onClick={() => deleteMessage(msg.id)}
                          disabled={isDeleting === msg.id}
                          size="sm" 
                          variant="ghost" 
                          className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                          title="Delete message"
                        >
                          {isDeleting === msg.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
    </div>
  );
}
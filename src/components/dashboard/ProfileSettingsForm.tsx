"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { Loader2, Save, User, Mail, Phone, MessageCircle, FileText, Lock, ImagePlus, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { getUserProfile, updateUserProfile } from "@/lib/api/user.api";
import { useAuthStore } from "@/lib/store/authStore";

interface ProfileSettingsFormProps {
  userId: string;
}

export default function ProfileSettingsForm({ userId }: ProfileSettingsFormProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    bio: "",
    photo: "",
    address: "",
    password: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile(userId);
        if (res.success && res.data) {
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            whatsapp: res.data.whatsapp || "",
            bio: res.data.profile?.bio || "",
            photo: res.data.profile?.photo || "",
            address: res.data.profile?.address || "",
            password: "",
          });
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const imageFormData = new FormData();
    imageFormData.append("image", file);

    try {
      const apiKey = "d4eef5d31d116090d4ae71ea46bc433a";
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: imageFormData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        setFormData((prev) => ({ ...prev, photo: data.data.url }));
        toast.success("Photo uploaded successfully!");
      } else {
        toast.error(data.error?.message || "Failed to upload photo");
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload: any = {
        name: formData.name,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        bio: formData.bio,
        photo: formData.photo,
      };

      if (user?.role === "ADMIN") {
        payload.address = formData.address;
      }

      if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      const res = await updateUserProfile(userId, payload);
      
      if (res.success) {
        toast.success("Profile updated successfully!");
        
        if (user) {
          const updatedUser = {
            ...user,
            name: formData.name,
            profile: {
              ...(user as any).profile,
              photo: formData.photo,
              address: user.role === "ADMIN" ? formData.address : (user as any).profile?.address
            }
          };

          const store = useAuthStore as any;
          if (typeof store.setState === 'function') {
            store.setState({ user: updatedUser });
          }
        }

        setFormData((prev) => ({
          ...prev,
          password: "",
        }));
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
          <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 flex items-center justify-center">
              {formData.photo ? (
                <img src={formData.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="h-12 w-12 text-slate-300" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                </div>
              )}
            </div>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <div className="flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-sky-100 transition-colors">
                <ImagePlus className="h-4 w-4" />
                {isUploading ? "Uploading..." : "Change Photo"}
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <User className="h-4 w-4 text-sky-500" /> Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-sky-500" /> Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+8801..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-green-500" /> WhatsApp Number
            </label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="+8801..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          {user?.role === "ADMIN" && (
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-sky-500" /> Office Location / Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 123 Real Estate Avenue, Dhaka"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-500" /> Bio / About
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Write something about yourself..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Lock className="h-4 w-4 text-rose-500" /> New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-slate-900 hover:bg-sky-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {isSaving ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}
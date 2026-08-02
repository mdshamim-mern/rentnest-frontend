"use client";

import ProfileSettingsForm from "@/components/dashboard/ProfileSettingsForm";
import { useAuthStore } from "@/lib/store/authStore";

export default function LandlordProfilePage() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 mt-1">Update your contact details so tenants can reach you easily.</p>
      </div>
      
      <ProfileSettingsForm userId={user.id} />
    </div>
  );
}
"use client";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { AuthResponse } from "@/types";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

type GoogleIdentity = { accounts: { id: {
  initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
  renderButton: (element: HTMLElement, options: Record<string, string | number>) => void;
} } };
declare global { interface Window { google?: GoogleIdentity } }

export default function GoogleLogin({ onSuccess, role = "TENANT" }: { onSuccess: (data: AuthResponse["data"]) => void; role?: "TENANT" | "LANDLORD" }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [clientId, setClientId] = useState("");
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const callbackRef = useRef(onSuccess);
  const roleRef = useRef(role);
  callbackRef.current = onSuccess;
  roleRef.current = role;
  useEffect(() => {
    axiosInstance.get('/auth/providers').then(res => {
      const id = res.data.data?.googleClientId?.trim();
      if (id && /^\d+-[a-zA-Z0-9_-]+\.apps\.googleusercontent\.com$/.test(id)) setClientId(id);
      else setUnavailable(true);
    }).catch(() => setUnavailable(true));
  }, []);
  useEffect(() => {
    if (!ready || !clientId || !container.current || !window.google) return;
    window.google.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }) => {
      setBusy(true);
      try {
        const res = await axiosInstance.post<AuthResponse>('/auth/google', { credential, role: roleRef.current });
        callbackRef.current(res.data.data);
      } catch (error) {
        const message = isAxiosError(error) ? error.response?.data?.message : null;
        const safeMessages = ["An account already uses this email. Please sign in with your password.", "This account is not active. Please contact support.", "A verified Google email is required."];
        toast.error(safeMessages.includes(message) ? message : "Google sign-in could not be completed. Please try email sign-in.");
      }
      finally { setBusy(false); }
    } });
    window.google.accounts.id.renderButton(container.current, { theme: 'outline', size: 'large', shape: 'pill', width: Math.min(container.current.clientWidth, 400), text: 'continue_with' });
  }, [ready, clientId]);
  return <div className="social-login">
    {clientId && <Script src="https://accounts.google.com/gsi/client" onReady={() => setReady(true)} onError={() => setUnavailable(true)} />}
    <div ref={container} className={busy ? 'pointer-events-none opacity-50' : ''} />
    {busy && <p role="status">Signing in with Google…</p>}
    {unavailable && <p className="social-unavailable">Google sign-in is not available yet. Please continue with email.</p>}
    <div className="auth-divider"><span />or continue with email<span /></div>
  </div>;
}

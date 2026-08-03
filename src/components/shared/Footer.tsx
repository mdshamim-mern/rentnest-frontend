"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { getAdminInfo } from "@/lib/api/user.api";

export default function Footer() {
  const [contactInfo, setContactInfo] = useState({
    phone: "+880 1234 567 890",
    email: "support@rentnest.com",
    address: "Dhaka, Bangladesh",
  });

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await getAdminInfo();
        if (res?.success && res?.data) {
          setContactInfo({
            phone: res.data.phone || res.data.profile?.phone || contactInfo.phone,
            email: res.data.email || contactInfo.email,
            address: res.data.address || res.data.profile?.address || contactInfo.address,
          });
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };
    fetchAdminInfo();
  }, []);

  return (
    <footer className="bg-white/40 backdrop-blur-md border-t border-slate-200/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-extrabold tracking-tighter text-slate-900 flex items-center gap-2 mb-4">
              <span className="bg-primary text-white flex items-center justify-center h-8 w-10 rounded-lg text-lg">RN</span>
              <span className="leading-none mt-1">RentNest</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Your trusted partner in finding the perfect rental home. We make the process simple, secure, and transparent.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.facebook.com/share/1HJb2Cwxvt/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link href="https://www.linkedin.com/in/md-shamim471/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link href="https://t.me/md_shamim71" target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m21.5 2-6.3 20-4.5-4.5-4.3 1.4-4.8-1.5 20-15.4Z"></path>
                  <path d="m21.5 2-13.4 11.2"></path>
                  <path d="M12.6 17.7 8.1 13.2"></path>
                </svg>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/properties" className="text-sm text-slate-500 hover:text-primary transition-colors">
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-slate-500 hover:text-primary transition-colors">
                  Login to Account
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-slate-500 hover:text-primary transition-colors">
                  List Your Property
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-sm text-slate-500 hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-500 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-500 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 tracking-wider uppercase mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-red-500 mr-2 shrink-0" />
                <span className="text-sm text-slate-500 whitespace-pre-wrap">{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                <span className="text-sm text-slate-500">{contactInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-amber-500 mr-2 shrink-0" />
                <span className="text-sm text-slate-500">{contactInfo.email}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-slate-200/60 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} RentNest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
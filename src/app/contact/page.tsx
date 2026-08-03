"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { getAdminInfo } from "@/lib/api/user.api";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState({
    phone: "+880 1234 567 890",
    email: "support@rentnest.com",
    address: "RentNest Headquarters\n123 Real Estate Avenue\nDhaka, Bangladesh 1212",
    emailSupportText: "We typically reply within 24 hours.",
    phoneSupportText: "Available Mon-Fri, 9am-6pm.",
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
            emailSupportText: res.data.profile?.emailSupportText || contactInfo.emailSupportText,
            phoneSupportText: res.data.profile?.phoneSupportText || contactInfo.phoneSupportText,
          });
        }
      } catch (error) {
        console.error("Error fetching admin info:", error);
      }
    };
    fetchAdminInfo();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-lg text-slate-600">
            Have questions about listing a property or finding your new home? Our team is here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 md:p-10 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <Input placeholder="John" className="bg-white/60 h-12" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <Input placeholder="Doe" className="bg-white/60 h-12" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <Input type="email" placeholder="john@example.com" className="bg-white/60 h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <Textarea placeholder="How can we help you?" className="bg-white/60 min-h-30" />
              </div>
              <Button className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20">
                Send Message
              </Button>
            </form>
          </div>

          <div className="space-y-8 flex flex-col justify-center">
            <div className="flex items-start gap-4 p-6 bg-white/40 rounded-2xl border border-white/50">
              <div className="bg-primary/10 p-4 rounded-xl shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Email Us</h3>
                <p className="text-slate-600 mb-1">{contactInfo.emailSupportText}</p>
                <a href={`mailto:${contactInfo.email}`} className="text-primary font-medium hover:underline">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/40 rounded-2xl border border-white/50">
              <div className="bg-primary/10 p-4 rounded-xl shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Call Us</h3>
                <p className="text-slate-600 mb-1">{contactInfo.phoneSupportText}</p>
                <a href={`tel:${contactInfo.phone}`} className="text-primary font-medium hover:underline">
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-white/40 rounded-2xl border border-white/50">
              <div className="bg-primary/10 p-4 rounded-xl shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Office Location</h3>
                <p className="text-slate-600 whitespace-pre-wrap">
                  {contactInfo.address}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
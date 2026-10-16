"use client";

import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { getAdminInfo } from "@/lib/api/user.api";
import { axiosInstance } from "@/lib/api/axiosInstance";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [contactInfo, setContactInfo] = useState({
    phone: "01865190471",
    email: "mdshamim.mern@gmail.com",
    address: "RentNest Headquarters, 45/A, Dhanmondi 27, Dhaka 1209, Bangladesh",
    emailSupportText: "We typically reply within 24 hours.",
    phoneSupportText: "Available Mon-Fri, 9am-6pm.",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } catch (error) {}
    };
    fetchAdminInfo();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      setIsSubmitting(true);
      const name = `${formData.firstName} ${formData.lastName}`.trim();
      
      const response = await axiosInstance.post('/contact', {
        name,
        email: formData.email,
        message: formData.message
      });

      if (response.data.success) {
        toast.success("Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page min-h-screen pt-16 pb-24 bg-linear-to-br from-slate-50 via-sky-50/30 to-slate-50">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="contact-heading text-center max-w-3xl mx-auto mb-16">
          <span className="eyebrow">LET’S TALK ABOUT YOUR NEXT MOVE</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Get in <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-600">Touch</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Have questions about listing a property or finding your new home? Our team is here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="contact-form lg:col-span-3 bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-sky-100/50">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Send us a message</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <label htmlFor="contact-firstName" className="text-sm font-semibold text-slate-700">First Name <span className="text-rose-500">*</span></label>
                  <Input id="contact-firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 h-14 rounded-xl transition-all" required />
                </div>
                <div className="space-y-2.5">
                  <label htmlFor="contact-lastName" className="text-sm font-semibold text-slate-700">Last Name</label>
                  <Input id="contact-lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 h-14 rounded-xl transition-all" />
                </div>
              </div>
              <div className="space-y-2.5">
                <label htmlFor="contact-email" className="text-sm font-semibold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
                <Input id="contact-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 h-14 rounded-xl transition-all" required />
              </div>
              <div className="space-y-2.5">
                <label htmlFor="contact-message" className="text-sm font-semibold text-slate-700">Message <span className="text-rose-500">*</span></label>
                <Textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} placeholder="How can we help you?" className="bg-slate-50/50 hover:bg-white focus:bg-white border-slate-200 min-h-40 rounded-xl resize-none transition-all" required />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full h-14 text-lg font-bold bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300">
                {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                {isSubmitting ? "Sending Message..." : "Send Message"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="contact-card group flex items-start gap-5 p-8 bg-white/70 hover:bg-white rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300">
              <div className="bg-linear-to-br from-sky-100 to-blue-100 p-4 rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Mail className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 leading-relaxed mb-3">{contactInfo.emailSupportText}</p>
                <a href={`mailto:${contactInfo.email}`} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                  {contactInfo.email}
                </a>
              </div>
            </div>

            <div className="contact-card group flex items-start gap-5 p-8 bg-white/70 hover:bg-white rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300">
              <div className="bg-linear-to-br from-sky-100 to-blue-100 p-4 rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Phone className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
                <p className="text-slate-600 leading-relaxed mb-3">{contactInfo.phoneSupportText}</p>
                <a href={`tel:${contactInfo.phone}`} className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
            </div>

            <div className="contact-card group flex items-start gap-5 p-8 bg-white/70 hover:bg-white rounded-[2rem] border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300">
              <div className="bg-linear-to-br from-sky-100 to-blue-100 p-4 rounded-2xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <MapPin className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Office Location</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {contactInfo.address}
                </p>
                <a className="text-link mt-3" href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(contactInfo.address)} target="_blank" rel="noopener noreferrer">Get directions ↗</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Lock, Eye, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-slate-50 to-white pt-12 pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-125 bg-green-50/50 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-green-100 to-emerald-50 rounded-2xl shadow-inner">
              <Lock className="h-10 w-10 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Your privacy is critically important to us. Discover how we protect your data.
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden mb-16">
          <div className="p-8 sm:p-14 space-y-12">
            <p className="text-slate-600 text-xl leading-relaxed text-center max-w-4xl mx-auto">
              At RentNest, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group bg-linear-to-br from-blue-50/50 to-white p-8 rounded-3xl border border-blue-100/50 shadow-lg shadow-blue-100/20 hover:shadow-blue-200/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Database className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Information We Collect</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  We collect information that you provide directly to us, such as when you create an account, list a property, or contact support. This includes your name, email address, phone number, financial information for payments, and any other details you choose to provide.
                </p>
              </div>

              <div className="group bg-linear-to-br from-purple-50/50 to-white p-8 rounded-3xl border border-purple-100/50 shadow-lg shadow-purple-100/20 hover:shadow-purple-200/40 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Eye className="h-7 w-7 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">How We Use Data</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  We use the information we collect to operate, maintain, and improve our services. We may also use it to process transactions, send notifications about your account, and communicate updates regarding our platform's policies.
                </p>
              </div>
            </div>

            <div className="bg-linear-to-br from-emerald-500 to-teal-600 p-10 sm:p-12 rounded-[2rem] shadow-2xl shadow-emerald-500/30 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="p-5 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
                  <ShieldCheck className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-4">Data Security & Protection</h3>
                  <p className="text-emerald-50 text-lg leading-relaxed">
                    We implement robust, industry-standard security measures including SSL encryption and secure server hosting to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet is 100% secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center p-12 bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
          <div className="relative z-10">
            <h4 className="text-3xl font-bold text-white mb-4">Privacy Concerns?</h4>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
              If you have any questions or concerns about our Privacy Policy or data processing practices, please reach out to our Data Protection Officer.
            </p>
            <Link href="mailto:mdshamim.mern@gmail.com" className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-sky-500 text-white rounded-2xl font-bold text-lg hover:bg-sky-400 hover:scale-105 transition-all shadow-xl shadow-sky-500/30">
              Contact Privacy Team
            </Link>
            <p className="mt-6 text-sm font-medium text-slate-400">mdshamim.mern@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
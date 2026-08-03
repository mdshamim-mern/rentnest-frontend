import { Lock, Eye, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-2xl mb-4">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-slate-500">Your privacy is critically important to us.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden mb-12">
          <div className="p-8 sm:p-12 space-y-10">
            <p className="text-slate-600 text-lg leading-relaxed border-b border-slate-100 pb-8">
              At RentNest, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-slate-900">Information We Collect</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  We collect information that you provide directly to us, such as when you create an account, list a property, or contact support. This includes your name, email address, phone number, financial information for payments, and any other details you choose to provide.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-slate-900">How We Use Data</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  We use the information we collect to operate, maintain, and improve our services. We may also use it to process transactions, send notifications about your account, and communicate updates regarding our platform's policies.
                </p>
              </div>
            </div>

            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-7 w-7 text-primary" />
                <h3 className="text-2xl font-bold text-slate-900">Data Security & Protection</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">
                We implement robust, industry-standard security measures including SSL encryption and secure server hosting to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, please be aware that no method of transmission over the internet is 100% secure.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center">
          <h4 className="text-xl font-bold text-slate-900 mb-2">Privacy Concerns?</h4>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">If you have any questions or concerns about our Privacy Policy or data processing practices, please reach out to our Data Protection Officer.</p>
          <Link href="mailto:mdshamim.mern@gmail.com" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-sm">
            Contact Privacy Team
          </Link>
          <p className="mt-4 text-sm font-medium text-slate-500">mdshamim.mern@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
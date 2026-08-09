import { Shield, Scale, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-slate-50 to-white pt-12 pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-125 bg-blue-50/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="inline-flex items-center justify-center p-4 bg-linear-to-br from-blue-100 to-sky-50 rounded-2xl shadow-inner">
              <Scale className="h-10 w-10 text-blue-600" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden mb-16">
          <div className="p-8 sm:p-14 space-y-12">
            <div className="text-center max-w-4xl mx-auto mb-8">
              <p className="text-slate-600 text-xl leading-relaxed">
                Welcome to RentNest. Please read these Terms of Service carefully before using our platform. By accessing or using our services, you agree to be bound by these terms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-linear-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col mb-6">
                  <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">1. Acceptance of Terms</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  By accessing and using the RentNest website, mobile application, and related services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.
                </p>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col mb-6">
                  <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">2. User Responsibilities</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
                </p>
              </div>

              <div className="group bg-linear-to-br from-slate-50 to-white p-8 rounded-3xl border border-slate-100 shadow-md hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex flex-col mb-6">
                  <div className="h-14 w-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">3. Property Listings</h3>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Landlords are solely responsible for the accuracy of their property listings. All properties must comply with local housing laws. RentNest reserves the right to remove any listing that is deemed fraudulent, inaccurate, or violates our community guidelines without prior notice.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center p-12 bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/30 flex flex-col items-center justify-center">
          <h4 className="text-3xl font-bold text-slate-900 mb-4">Questions about our Terms?</h4>
          <p className="text-slate-500 mb-8 text-lg">Please contact our legal team for any clarifications regarding these terms.</p>
          <Link href="mailto:mdshamim.mern@gmail.com" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-lg shadow-slate-900/20">
            Contact Legal Team
          </Link>
        </div>
      </div>
    </div>
  );
}
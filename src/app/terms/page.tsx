import { Shield, Scale, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-10 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-lg text-slate-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden mb-12">
          <div className="p-8 sm:p-12 space-y-12">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-lg leading-relaxed">
                Welcome to RentNest. Please read these Terms of Service carefully before using our platform. By accessing or using our services, you agree to be bound by these terms.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0 mt-1">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">1. Acceptance of Terms</h3>
                  <p className="text-slate-600 leading-relaxed">
                    By accessing and using the RentNest website, mobile application, and related services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our service.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0 mt-1">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">2. User Responsibilities</h3>
                  <p className="text-slate-600 leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0 mt-1">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">3. Property Listings</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Landlords are solely responsible for the accuracy of their property listings. All properties must comply with local housing laws. RentNest reserves the right to remove any listing that is deemed fraudulent, inaccurate, or violates our community guidelines without prior notice.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center p-8 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-2">Questions about our Terms?</h4>
          <p className="text-slate-600 mb-4">Please contact our legal team for any clarifications.</p>
          <Link href="mailto:mdshamim.mern@gmail.com" className="text-primary font-medium hover:underline inline-flex items-center gap-2">
            mdshamim.mern@gmail.com
          </Link>
        </div>
      </div>
    </div>
  );
}
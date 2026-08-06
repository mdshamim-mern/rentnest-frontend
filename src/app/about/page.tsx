import { Shield, Home, Users, Building } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 pb-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Simplifying the <span className="text-primary">Rental Experience</span>
          </h1>
          <p className="text-lg text-slate-600">
            RentNest is built to connect verified landlords with reliable tenants through a secure, transparent, and seamless platform. Whether you are looking for your next home or managing multiple properties, we make the process effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-lg">
            <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Users className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Tenants</h3>
            <p className="text-slate-600">
              Browse thousands of premium verified listings. Request tours, submit rental applications, and make secure payments all from one intuitive dashboard.
            </p>
          </div>
          
          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-lg">
            <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Building className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">For Landlords</h3>
            <p className="text-slate-600">
              List properties in minutes, manage rental requests, review applicant details, and securely collect monthly rent without the hassle of third parties.
            </p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-lg">
            <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Platform Security</h3>
            <p className="text-slate-600">
              Managed by dedicated admins to ensure 100% verified listings, dispute resolution, and state-of-the-art encryption for all your financial transactions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
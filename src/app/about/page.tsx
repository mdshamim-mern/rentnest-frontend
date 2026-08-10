import { Shield, Home, Users, Building, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16 pb-24 bg-linear-to-br from-slate-50 via-sky-50/30 to-slate-50">
      <div className="max-w-350 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-200/50 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Simplifying the <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 to-blue-600">Rental Experience</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            RentNest is built to connect verified landlords with reliable tenants through a secure, transparent, and seamless platform. Whether you are looking for your next home or managing multiple properties, we make the process effortless.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          
          {/* Card 1: Tenants */}
          <div className="group bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[2rem] shadow-xl shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all duration-300">
            <div className="bg-linear-to-br from-blue-100 to-sky-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">For Tenants</h3>
            <p className="text-slate-600 leading-relaxed">
              Browse thousands of premium verified listings. Request tours, submit rental applications, and make secure payments all from one intuitive dashboard.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-sky-500 mr-2" /> Verified Listings</li>
              <li className="flex items-center text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-sky-500 mr-2" /> Secure Payments</li>
            </ul>
          </div>
          
          {/* Card 2: Landlords */}
          <div className="group bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[2rem] shadow-xl shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all duration-300">
            <div className="bg-linear-to-br from-emerald-100 to-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Building className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">For Landlords</h3>
            <p className="text-slate-600 leading-relaxed">
              List properties in minutes, manage rental requests, review applicant details, and securely collect monthly rent without the hassle of third parties.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" /> Easy Management</li>
              <li className="flex items-center text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" /> Reliable Rent Collection</li>
            </ul>
          </div>

          {/* Card 3: Security */}
          <div className="group bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[2rem] shadow-xl shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/50 hover:-translate-y-2 transition-all duration-300">
            <div className="bg-linear-to-br from-purple-100 to-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Platform Security</h3>
            <p className="text-slate-600 leading-relaxed">
              Managed by dedicated admins to ensure 100% verified listings, dispute resolution, and state-of-the-art encryption for all your financial transactions.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-center text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-purple-500 mr-2" /> Bank-level Encryption</li>
              <li className="flex items-center text-slate-600 font-medium"><CheckCircle2 className="w-5 h-5 text-purple-500 mr-2" /> Admin Moderation</li>
            </ul>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="bg-linear-to-r from-sky-500 to-blue-600 rounded-[2rem] p-12 text-center text-white shadow-2xl shadow-blue-500/25 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <HeartHandshake className="w-16 h-16 mx-auto mb-6 text-white/90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to find your perfect nest?</h2>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-medium">
            Join thousands of satisfied users who have found their dream home or ideal tenant through our platform.
          </p>
        </div>

      </div>
    </div>
  );
}
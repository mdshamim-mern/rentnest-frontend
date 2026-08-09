import { Mail, MessageCircle, FileQuestion, Home, CreditCard, UserCheck } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-slate-50 to-white pt-12 pb-24">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-125 bg-sky-50/50 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-700">
            How can we help you?
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Search our knowledge base or browse categories below to find exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="group bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
              <Home className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Properties</h3>
            <p className="text-slate-500 text-lg leading-relaxed">Everything about listing, finding, and managing rental properties on our platform.</p>
          </div>

          <div className="group bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-emerald-400 to-emerald-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
              <CreditCard className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Payments</h3>
            <p className="text-slate-500 text-lg leading-relaxed">Information about secure transactions, rent collection, and payment methods.</p>
          </div>

          <div className="group bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 hover:shadow-2xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-violet-400 to-violet-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <div className="h-16 w-16 bg-violet-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-violet-100 transition-all duration-300">
              <UserCheck className="h-8 w-8 text-violet-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Accounts</h3>
            <p className="text-slate-500 text-lg leading-relaxed">Manage your profile, security settings, roles, and verification process.</p>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white overflow-hidden mb-16">
          <div className="p-8 sm:p-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-xl">
                <FileQuestion className="h-8 w-8 text-sky-600" />
              </div>
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-linear-to-br from-slate-50 to-white rounded-3xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/40 transition-all">
                <h4 className="text-xl font-bold text-slate-900 mb-3">How do I list a property?</h4>
                <p className="text-slate-600 leading-relaxed text-lg">To list a property, you must be registered as a Landlord. Go to your dashboard, click on "Add Property," fill in all the required details, upload high-quality images, and submit. Your property will be live instantly.</p>
              </div>
              <div className="p-8 bg-linear-to-br from-slate-50 to-white rounded-3xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/40 transition-all">
                <h4 className="text-xl font-bold text-slate-900 mb-3">How can I contact a landlord?</h4>
                <p className="text-slate-600 leading-relaxed text-lg">Once you find a property you like, click on the "Request Tour" or "Contact Landlord" button on the property details page. You can then communicate directly through our secure platform.</p>
              </div>
              <div className="p-8 bg-linear-to-br from-slate-50 to-white rounded-3xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/40 transition-all md:col-span-2 lg:col-span-1">
                <h4 className="text-xl font-bold text-slate-900 mb-3">Is my payment information secure?</h4>
                <p className="text-slate-600 leading-relaxed text-lg">Yes. We use industry-standard encryption and partner with trusted payment gateways like Stripe and SSLCommerz to ensure that your financial data is 100% secure.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-sky-500 to-blue-600 rounded-[2.5rem] p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-blue-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full" />
          <div className="mb-8 md:mb-0 text-center md:text-left relative z-10">
            <h3 className="text-4xl font-bold text-white mb-3">Still need help?</h3>
            <p className="text-blue-50 text-xl">Our support team is always ready to assist you.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-5 relative z-10">
            <Link href="mailto:mdshamim.mern@gmail.com" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20">
              <Mail className="h-6 w-6" />
              Email Support
            </Link>
            <Link href="https://wa.me/8801865190471" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:scale-105 transition-all shadow-xl shadow-white/20">
              <MessageCircle className="h-6 w-6" />
              Live Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
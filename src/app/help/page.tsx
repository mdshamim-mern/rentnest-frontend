import { Mail, MessageCircle, FileQuestion, Home, CreditCard, UserCheck } from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">How can we help you?</h1>
          <p className="text-lg text-slate-600">Search our knowledge base or browse categories below to find exactly what you need.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
              <Home className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Properties</h3>
            <p className="text-slate-500 text-sm">Everything about listing, finding, and managing rental properties on our platform.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center mb-6">
              <CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Payments</h3>
            <p className="text-slate-500 text-sm">Information about secure transactions, rent collection, and payment methods.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1">
            <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
              <UserCheck className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Accounts</h3>
            <p className="text-slate-500 text-sm">Manage your profile, security settings, roles, and verification process.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden mb-12">
          <div className="p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <FileQuestion className="h-6 w-6 text-primary" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">How do I list a property?</h4>
                <p className="text-slate-600 leading-relaxed">To list a property, you must be registered as a Landlord. Go to your dashboard, click on "Add Property," fill in all the required details, upload high-quality images, and submit. Your property will be live instantly.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">How can I contact a landlord?</h4>
                <p className="text-slate-600 leading-relaxed">Once you find a property you like, click on the "Request Tour" or "Contact Landlord" button on the property details page. You can then communicate directly through our secure platform.</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-2xl">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">Is my payment information secure?</h4>
                <p className="text-slate-600 leading-relaxed">Yes. We use industry-standard encryption and partner with trusted payment gateways like Stripe and SSLCommerz to ensure that your financial data is 100% secure.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between border border-primary/10">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Still need help?</h3>
            <p className="text-slate-600">Our support team is always ready to assist you.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="mailto:mdshamim.mern@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Mail className="h-5 w-5" />
              Email Support
            </Link>
            <Link href="mailto:mdshamim.mern@gmail.com" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <MessageCircle className="h-5 w-5" />
              Live Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, Shield, Star, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-slate-100 to-secondary/10 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
        
        <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col items-center text-center">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-8 md:p-14 rounded-[2.5rem] shadow-2xl max-w-5xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Find Your Perfect <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">Rental Home</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-3xl mx-auto font-medium">
              Discover thousands of premium rental properties. From cozy apartments to luxury estates, your next home is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/properties">
                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-primary/25 rounded-2xl transition-all hover:scale-105">
                  <Search className="mr-2 h-5 w-5" /> Browse Properties
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/50 backdrop-blur-md border-slate-300 rounded-2xl hover:bg-white/80 transition-all">
                  Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-linear-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-125 bg-sky-50/50 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Why Choose RentNest?
            </h2>
            <p className="text-lg text-slate-500">
              We provide the best rental experience with secure payments, verified landlords, and a completely seamless platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Home className="h-8 w-8 text-sky-500" />, title: "Premium Listings", desc: "Access exclusively verified properties matching your exact needs with high-quality visual tours." },
              { icon: <Shield className="h-8 w-8 text-sky-500" />, title: "Secure Payments", desc: "Integrated Stripe & SSLCommerz for 100% safe, transparent, and hassle-free transactions." },
              { icon: <Star className="h-8 w-8 text-sky-500" />, title: "Trusted Reviews", desc: "Read genuine feedback from previous tenants before renting to ensure a peaceful experience." }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group relative bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-sky-400 to-blue-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                
                <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-100 transition-all duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
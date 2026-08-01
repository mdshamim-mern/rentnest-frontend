import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Home, Shield, Star, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-slate-100 to-secondary/10 z-0" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')] bg-cover bg-center opacity-5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 p-8 md:p-14 rounded-[2.5rem] shadow-2xl max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              Find Your Perfect <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-blue-600">Rental Home</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
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

      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose RentNest?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We provide the best rental experience with secure payments and verified landlords.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Home className="h-8 w-8 text-primary" />, title: "Premium Listings", desc: "Access exclusively verified properties matching your exact needs." },
              { icon: <Shield className="h-8 w-8 text-primary" />, title: "Secure Payments", desc: "Integrated Stripe & SSLCommerz for 100% safe transactions." },
              { icon: <Star className="h-8 w-8 text-primary" />, title: "Trusted Reviews", desc: "Read genuine feedback from previous tenants before renting." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-lg border border-slate-100 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
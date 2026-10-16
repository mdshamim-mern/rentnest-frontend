import Link from "next/link";
import { ArrowUpRight, Search, MapPin, ShieldCheck, KeyRound, SlidersHorizontal, ArrowRight, Building2 } from "lucide-react";
const neighborhoods = [
  { name: "Gulshan", detail: "A little more room for the good life", image: "photo-1600607687920-4e2a09cf159d" },
  { name: "Dhanmondi", detail: "City energy. A neighborhood feeling.", image: "photo-1600566753190-17f0baa2a6c3" },
  { name: "Banani", detail: "Find your own corner of the city", image: "photo-1600210492486-724fe5c67fb0" },
];
export default function HomePage() {
  return <div className="home-page">
    <section className="hero-shell site-width">
      <div className="hero-copy">
        <span className="eyebrow"><span className="status-dot" /> A NEW WAY TO FEEL AT HOME</span>
        <h1>Great spaces.<br />Fresh starts.<br /><span>A place for you.</span></h1>
        <p>From your first apartment to your next chapter. Discover rental homes that fit the way you live.</p>
        <div className="hero-actions"><Link className="primary-link" href="/properties">Explore homes <ArrowUpRight size={19} /></Link><Link className="text-link" href="/about">Meet RentNest <ArrowRight size={17} /></Link></div>
        <div className="hero-note"><ShieldCheck size={20} /><span>Your search, simplified.<br /><strong>One place to find your next home.</strong></span></div>
      </div>
      <div className="hero-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85" alt="Bright contemporary living room with natural textures and generous windows" fetchPriority="high" />
        <div className="hero-image-label"><span className="status-dot" /> SPACES THAT FEEL LIKE YOU</div>
        <div className="hero-floating glass"><span className="icon-tile"><KeyRound size={23} /></span><div><strong>Your next chapter starts here</strong><p>Find a home. Make it yours.</p></div><ArrowUpRight size={22} /></div>
        <div className="image-caption">Thoughtful spaces. Everyday comfort.</div>
      </div>
      <form action="/properties" className="home-search glass">
        <label><span>WHERE DO YOU WANT TO LIVE?</span><div><MapPin size={20} /><input name="location" placeholder="City or neighborhood" aria-label="City or neighborhood" /></div></label>
        <label><span>YOUR KIND OF SPACE</span><div><Building2 size={20} /><select name="type" aria-label="Property type"><option value="all">All property types</option>{["Apartment", "Duplex", "Studio", "Villa", "Penthouse"].map(type => <option key={type}>{type}</option>)}</select></div></label>
        <button className="primary-link" type="submit"><Search size={19} /> Find my home</button>
      </form>
    </section>
    <section className="site-width section-space">
      <div className="section-heading"><div><span className="eyebrow">FIND YOUR NEIGHBORHOOD</span><h2>A location you&apos;ll love.</h2></div><Link className="text-link" href="/properties">Explore all properties <ArrowUpRight size={19} /></Link></div>
      <div className="neighborhood-grid">{neighborhoods.map(place => <Link href={'/properties?location=' + place.name} className="neighborhood-card" key={place.name}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={'https://images.unsplash.com/' + place.image + '?auto=format&fit=crop&w=800&q=80'} alt={place.name + ' rental home inspiration'} loading="lazy" />
        <div><span><h3>{place.name}</h3><p>{place.detail}</p></span><span className="circle-arrow"><ArrowUpRight size={21} /></span></div>
      </Link>)}</div>
    </section>
    <section className="site-width section-space steps-section"><div><span className="eyebrow">LESS SEARCHING. MORE LIVING.</span><h2>A better move,<br />from the very start.</h2><p className="section-description">The details matter. We bring your home search, conversations, and rental requests together.</p><Link className="text-link" href="/help">How it works <ArrowRight size={18} /></Link></div><div className="steps-list">{[
      { icon: SlidersHorizontal, title: "Find your fit", text: "Filter by neighborhood, budget, and the little things that make a place home." },
      { icon: Building2, title: "Take a closer look", text: "Explore property details and request a tour before making your next move." },
      { icon: KeyRound, title: "Start your next chapter", text: "Send a rental request and follow its progress from your personal dashboard." },
    ].map((item, i) => <div key={item.title} className="step-row"><span className="step-number">0{i + 1}</span><item.icon size={24} /><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}</div></section>
    <section className="site-width cta-panel"><div><span className="eyebrow">A GREAT SPACE DESERVES A GREAT TENANT</span><h2>Your property.<br />Someone&apos;s next home.</h2><p>Bring your listing to RentNest and manage it all in one place.</p></div><Link href="/login?redirect=/dashboard/landlord/properties/new" className="primary-link light-link">List your property <ArrowUpRight size={20} /></Link></section>
  </div>;
}

import Link from "next/link";
import { ArrowUpRight, Building2, HeartHandshake, KeyRound, ShieldCheck, Check } from "lucide-react";
export default function AboutPage() {
  return <div className="site-width about-page section-space">
    <div className="editorial-hero"><div><span className="eyebrow">HELLO, WE ARE RENTNEST</span><h1>Home is more<br />than an <span>address.</span></h1><p className="section-description">It&apos;s where your everyday life happens. We&apos;re here to make finding that place simpler, clearer, and a little more human.</p><Link href="/properties" className="primary-link">Find your next home <ArrowUpRight size={19} /></Link></div><div className="about-photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85" alt="A welcoming home with warm natural materials" /><div className="glass about-photo-note"><HeartHandshake size={28} /><span>Built around people.<br /><strong>Designed for better beginnings.</strong></span></div>
    </div></div>
    <section className="section-space"><div className="section-heading"><div><span className="eyebrow">ONE PLATFORM. BOTH SIDES OF HOME.</span><h2>Good connections.<br />Better rental experiences.</h2></div><p className="section-description">We connect people looking for a home with people who have a space to share.</p></div><div className="value-grid">{[
      { icon: KeyRound, title: "For the home seekers", text: "Find a space that fits your budget and your lifestyle, without losing track of the details.", bullets: ["Detailed property filters", "Tour and rental requests", "Your own rental dashboard"], href: "/properties", link: "Explore properties" },
      { icon: Building2, title: "For the space makers", text: "Give your property a place to shine and keep your rental management in one place.", bullets: ["Easy property listings", "Manage incoming requests", "Track your rental activity"], href: "/register", link: "Join as a landlord" },
      { icon: ShieldCheck, title: "Clarity at every step", text: "Make informed decisions with property details, tenant reviews, and support when you need it.", bullets: ["Transparent property details", "Tenant reviews", "A team you can contact"], href: "/contact", link: "Talk to our team" },
    ].map(item => <article className="glass value-card" key={item.title}><span className="icon-tile"><item.icon size={25} /></span><h3>{item.title}</h3><p>{item.text}</p><ul>{item.bullets.map(text => <li key={text}><Check size={16} />{text}</li>)}</ul><Link href={item.href} className="text-link">{item.link}<ArrowUpRight size={17} /></Link></article>)}</div></section>
    <section className="cta-panel"><div><span className="eyebrow">LET&apos;S FIND YOUR PLACE</span><h2>A fresh start is closer<br />than you think.</h2></div><Link className="primary-link light-link" href="/properties">Explore homes <ArrowUpRight size={20} /></Link></section>
  </div>;
}

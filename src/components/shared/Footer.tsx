"use client";
import Link from "next/link";
import { MapPin, Phone, Mail, House, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { getAdminInfo } from "@/lib/api/user.api";
export default function Footer() {
  const [info,setInfo] = useState({phone:'01865190471',email:'mdshamim.mern@gmail.com',address:'45/A, Dhanmondi 27, Dhaka 1209, Bangladesh'});
  useEffect(() => { getAdminInfo().then(res => { if(res?.success && res.data) setInfo(prev => ({phone:res.data.phone || prev.phone,email:res.data.email || prev.email,address:res.data.profile?.address || prev.address})); }).catch(() => {}); },[]);
  return <footer className="site-footer"><div className="site-width"><div className="footer-color-note"><span />A little closer to your next home.</div><div className="footer-top">
    <div><Link className="footer-brand" href="/"><span className="brand-mark"><House size={21} /></span>RentNest<span className="text-teal-300">.</span></Link><p className="footer-intro">Good spaces. New beginnings. Helping you find a place that feels like you.</p><div className="footer-socials"><a href="https://www.facebook.com/share/1HJb2Cwxvt/" target="_blank" rel="noopener noreferrer" className="social-facebook" aria-label="RentNest on Facebook"><span aria-hidden="true" className="social-letter">f</span><span>Facebook</span></a><a href="https://www.linkedin.com/in/md-shamim471/" target="_blank" rel="noopener noreferrer" className="social-linkedin" aria-label="RentNest on LinkedIn"><span aria-hidden="true" className="social-letter">in</span><span>LinkedIn</span></a><a className="social-telegram" href="https://t.me/md_shamim71" target="_blank" rel="noopener noreferrer" aria-label="RentNest on Telegram"><Send size={18} /><span>Telegram</span></a></div></div>
    <div><h3>FIND YOUR PLACE</h3><ul><li><Link href="/properties">Explore properties</Link></li><li><Link href="/about">Our story</Link></li><li><Link href="/login?redirect=/dashboard/landlord/properties/new">List your property</Link></li><li><Link href="/login">Your account</Link></li></ul></div>
    <div><h3>HERE TO HELP</h3><ul><li><Link href="/help">Help center</Link></li><li><Link href="/contact">Contact us</Link></li><li><Link href="/terms">Terms of service</Link></li><li><Link href="/privacy">Privacy policy</Link></li></ul></div>
    <div><h3>LET’S CONNECT</h3><ul className="footer-contact"><li><MapPin size={16} /><a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(info.address)} target="_blank" rel="noopener noreferrer">{info.address}</a></li><li><Phone size={16} /><a href={'tel:'+info.phone}>{info.phone}</a></li><li><Mail size={16} /><a href={'mailto:'+info.email}>{info.email}</a></li></ul></div>
  </div><div className="footer-bottom"><p>© {new Date().getFullYear()} RentNest. All rights reserved.</p><p>Made for the way you live.</p></div></div></footer>;
}


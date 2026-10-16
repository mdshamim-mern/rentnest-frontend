import { KeyRound, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return <section className="auth-shell site-width">
    <aside className="auth-story">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=1100&q=85" alt="Sunlit living room ready for a new beginning" />
      <div className="auth-story-content"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>A space to live.<br />A place to belong.</h2><p>Your home search, saved favorites, and rental journey. All in one place.</p><Link href="/properties">Take a look around <ArrowUpRight size={19} /></Link></div>
      <span className="auth-story-badge glass"><KeyRound size={20} /> Make yourself at home.</span>
    </aside>
    <div className="auth-form-panel glass">{children}</div>
  </section>;
}

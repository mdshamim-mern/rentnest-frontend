"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowDownLeft, ArrowUpRight, Building2, CalendarDays, Check, ChevronRight, Clock3, FileText, House, LifeBuoy, Plus, RefreshCw, Search, ShieldCheck, Users, Wallet } from "lucide-react";
import { axiosInstance } from "@/lib/api/axiosInstance";
import { useAuthStore } from "@/lib/store/authStore";
import { Property, RentalRequest, User } from "@/types";

type Role = "admin" | "tenant" | "landlord";
type RequestItem = Partial<RentalRequest> & { id: string; status: string; createdAt: string; kind: "Rental" | "Tour" };
type DashboardData = { properties: Property[]; users: User[]; requests: RequestItem[] };
const emptyData: DashboardData = { properties: [], users: [], requests: [] };
const copy = {
  admin: { label: "PLATFORM WORKSPACE", title: "Everything in perspective.", description: "Your community, properties, and rental activity — together in one clear view.", action: "Manage users", href: "/dashboard/admin/users" },
  landlord: { label: "LANDLORD WORKSPACE", title: "A better view of your rentals.", description: "Keep your properties moving and give every request the attention it deserves.", action: "Add a property", href: "/dashboard/landlord/properties/new" },
  tenant: { label: "YOUR RENTAL WORKSPACE", title: "Make room for your next chapter.", description: "Follow your applications, plan your visits, and keep your rental journey in order.", action: "Find a home", href: "/properties" },
};
const extract = <T,>(body: { data?: T[] } | T[]): T[] => Array.isArray(body) ? body : body.data || [];
const newest = <T extends { createdAt: string }>(items: T[]) => [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

export default function DashboardOverview({ role }: { role: Role }) {
  const user = useAuthStore(state => state.user);
  const [data, setData] = useState<DashboardData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");
  const [updated, setUpdated] = useState<Date | null>(null);
  const userId = user?.id;
  const root = `/dashboard/${role}`;
  const content = copy[role];

  const load = useCallback(async (signal?: AbortSignal) => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const paths = role === 'admin' ? ['/admin/users', '/properties', '/rentals/all'] : role === 'landlord'
        ? [`/properties?landlordId=${encodeURIComponent(userId)}`, '/landlord/requests', '/landlord/tour-requests']
        : ['/rentals', '/tours/my-tours'];
      const results = await Promise.all(paths.map(path => axiosInstance.get(path, { signal })));
      if (signal?.aborted) return;
      const rentals = extract<RentalRequest>(results[role === 'admin' ? 2 : role === 'landlord' ? 1 : 0].data);
      const tours = role === 'admin' ? [] : extract<RentalRequest>(results[role === 'landlord' ? 2 : 1].data);
      setData({
        users: role === 'admin' ? extract<User>(results[0].data) : [],
        properties: role === 'admin' ? extract<Property>(results[1].data) : role === 'landlord' ? extract<Property>(results[0].data) : [],
        requests: [...rentals.map(item => ({ ...item, kind: 'Rental' as const })), ...tours.map(item => ({ ...item, kind: 'Tour' as const }))],
      });
      setUpdated(new Date());
    } catch { if (!signal?.aborted) setError(true); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, [role, userId]);

  // Refresh remote data when the authenticated workspace changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { const controller = new AbortController(); void load(controller.signal); return () => controller.abort(); }, [load]);
  const pending = data.requests.filter(item => item.status === 'PENDING');
  const approved = data.requests.filter(item => ['APPROVED', 'ACTIVE'].includes(item.status));
  const activeRent = data.requests.filter(item => item.kind === 'Rental' && item.status === 'ACTIVE').reduce((total, item) => total + (item.property?.price || 0), 0);
  const filtered = useMemo(() => newest(data.requests).filter(item =>
    (status === 'all' || item.status === status) && (kind === 'all' || item.kind === kind) &&
    `${item.property?.title || ''} ${item.property?.location || ''} ${item.tenant?.name || ''} ${item.kind}`.toLowerCase().includes(search.trim().toLowerCase())
  ), [data.requests, search, status, kind]);

  const stats = role === 'admin' ? [
    { label: 'Community members', value: data.users.length, note: 'Registered accounts', icon: Users, href: root + '/users' },
    { label: 'Listed properties', value: data.properties.length, note: 'Across the platform', icon: Building2, href: root + '/properties' },
    { label: 'Rental requests', value: data.requests.length, note: 'All application statuses', icon: FileText, href: root + '/requests' },
    { label: 'Awaiting a decision', value: pending.length, note: 'Pending rental requests', icon: Clock3, href: root + '/requests' },
  ] : role === 'landlord' ? [
    { label: 'Your properties', value: data.properties.length, note: 'Manage your portfolio', icon: Building2, href: root + '/properties' },
    { label: 'Pending requests', value: pending.length, note: `${pending.filter(r => r.kind === 'Tour').length} tours · ${pending.filter(r => r.kind === 'Rental').length} rentals`, icon: Clock3, href: root + '/requests' },
    { label: 'Active rentals', value: data.requests.filter(r => r.kind === 'Rental' && r.status === 'ACTIVE').length, note: 'Currently active agreements', icon: Check, href: root + '/requests' },
    { label: 'Active rental value', value: `$${activeRent.toLocaleString()}`, note: 'Listed rents; not collected revenue', icon: Wallet, href: root + '/requests' },
  ] : [
    { label: 'Your requests', value: data.requests.length, note: 'Rental applications & tours', icon: FileText, href: root + '/requests' },
    { label: 'Awaiting a reply', value: pending.length, note: 'Your pending requests', icon: Clock3, href: root + '/requests' },
    { label: 'Moving forward', value: approved.length, note: 'Approved or active requests', icon: Check, href: root + '/requests' },
    { label: 'Property visits', value: data.requests.filter(r => r.kind === 'Tour').length, note: 'Your requested home tours', icon: CalendarDays, href: root + '/requests' },
  ];
  const actions = role === 'admin' ? [
    { label: 'Manage your community', note: 'Users and account access', icon: Users, href: root + '/users' },
    { label: 'Review properties', note: 'Listings and tenant reviews', icon: Building2, href: root + '/properties' },
    { label: 'Open the inbox', note: 'Read contact messages', icon: FileText, href: root + '/messages' },
  ] : role === 'landlord' ? [
    { label: 'Create a new listing', note: 'Give your property a home', icon: Plus, href: root + '/properties/new' },
    { label: 'Review rental requests', note: 'Manage your applications', icon: FileText, href: root + '/requests' },
    { label: 'Manage property tours', note: 'Review upcoming visits', icon: CalendarDays, href: root + '/tours' },
  ] : [
    { label: 'Discover your next home', note: 'Explore available properties', icon: Search, href: '/properties' },
    { label: 'Your saved homes', note: 'Pick up where you left off', icon: House, href: root + '/favorites' },
    { label: 'Payment history', note: 'Your rental transactions', icon: Wallet, href: root + '/payments' },
  ];

  return <div className="workspace-overview">
    <header className="workspace-heading"><div><span className="workspace-eyebrow">{content.label}</span><h1>{role === 'admin' ? 'Admin overview' : `Hello, ${user?.name?.split(' ')[0] || 'there'}.`}</h1><p>{content.description}</p></div><Link className="primary-link" href={content.href}>{content.action}<ArrowUpRight size={20} /></Link></header>
    {user?.email === 'demo@rentnest.example' && <div className="workspace-notice"><ShieldCheck size={20} /><span>You&apos;re exploring a read-only demo. Your saved homes stay on this device.</span></div>}
    <section className="workspace-welcome"><div><span className="workspace-eyebrow">{role === 'admin' ? 'YOUR PLATFORM, AT A GLANCE' : 'A LITTLE CLARITY GOES A LONG WAY'}</span><h2>{content.title}</h2><p>{loading ? 'Updating your workspace…' : error ? 'Your latest data could not be loaded.' : pending.length ? `${pending.length} request${pending.length === 1 ? '' : 's'} awaiting a decision.` : 'You’re up to date. Explore your workspace below.'}</p></div><div className="welcome-symbol" aria-hidden="true">{role === 'admin' ? <ShieldCheck /> : role === 'landlord' ? <Building2 /> : <House />}</div></section>
    {error && <div className="workspace-error" role="alert"><span>We couldn&apos;t refresh your dashboard. {updated ? 'Previously loaded data is shown.' : 'Please try again.'}</span><button onClick={() => void load()} disabled={loading}><RefreshCw size={16} />Try again</button></div>}
    <section className="workspace-stats" aria-label="Dashboard statistics">{stats.map((stat, index) => <Link className={`workspace-stat glass stat-${index}`} href={stat.href} key={stat.label}><div className="stat-top"><span>{stat.label}</span><stat.icon size={21} /></div><strong>{loading ? <span className="stat-skeleton" /> : error && !updated ? '—' : stat.value}</strong><div className="stat-foot"><span>{stat.note}</span><ArrowUpRight size={17} /></div></Link>)}</section>
    <div className="workspace-columns"><section className="workspace-panel glass"><div className="panel-heading"><div><span className="workspace-eyebrow">KEEP THINGS MOVING</span><h2>Recent activity</h2></div><button className="refresh-button" aria-label="Refresh dashboard" disabled={loading} onClick={() => void load()}><RefreshCw size={18} className={loading ? 'animate-spin' : ''} /></button></div>
      <div className="activity-toolbar"><label className="workspace-search"><Search size={18} /><input aria-label="Search dashboard activity" placeholder="Search property or person…" value={search} onChange={e => setSearch(e.target.value)} /></label><select aria-label="Filter activity status" value={status} onChange={e => setStatus(e.target.value)}><option value="all">All statuses</option>{['PENDING','APPROVED','ACTIVE','COMPLETED','REJECTED'].map(s => <option key={s} value={s}>{s[0] + s.slice(1).toLowerCase()}</option>)}</select>{role !== 'admin' && <select aria-label="Filter request type" value={kind} onChange={e => setKind(e.target.value)}><option value="all">All types</option><option>Rental</option><option>Tour</option></select>}</div>
      <div className="activity-list" aria-live="polite">{loading ? <div className="workspace-empty"><RefreshCw className="animate-spin" /><p>Loading your activity…</p></div> : error && !updated ? <div className="workspace-empty"><p>Your activity is temporarily unavailable.</p></div> : filtered.length ? filtered.slice(0, 6).map(item => <Link key={`${item.kind}-${item.id}`} href={root + (item.kind === 'Tour' && role === 'landlord' ? '/tours' : '/requests')} className="activity-row"><span className={`activity-icon ${item.kind === 'Tour' ? 'tour-icon' : ''}`}>{item.kind === 'Tour' ? <CalendarDays size={21} /> : <ArrowDownLeft size={21} />}</span><div className="activity-copy"><h3>{item.property?.title || 'Property request'}</h3><p>{item.kind} request{item.tenant?.name && role !== 'tenant' ? ` · ${item.tenant.name}` : ''} · {new Date(item.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p></div><span className="status-pill" data-status={item.status}>{item.status.toLowerCase()}</span><ChevronRight size={16} className="activity-chevron" /></Link>) : <div className="workspace-empty"><Activity size={30} /><h3>{data.requests.length ? 'No matching activity' : 'A fresh start'}</h3><p>{data.requests.length ? 'Try a different search or filter.' : 'Your rental and tour activity will appear here.'}</p>{search || status !== 'all' || kind !== 'all' ? <button onClick={() => {setSearch('');setStatus('all');setKind('all');}}>Clear filters</button> : <Link href={content.href}>{content.action}<ArrowUpRight size={17} /></Link>}</div>}</div>
      <div className="panel-footer"><span>{filtered.length} matching request{filtered.length === 1 ? '' : 's'}</span><Link href={root + '/requests'}>View all requests<ArrowUpRight size={17} /></Link></div>
    </section><aside className="workspace-panel glass"><div className="panel-heading"><div><span className="workspace-eyebrow">YOUR NEXT STEP</span><h2>Quick actions</h2></div></div><div className="quick-actions">{actions.map(action => <Link key={action.href} href={action.href}><span className="action-icon"><action.icon size={22} /></span><span><strong>{action.label}</strong><small>{action.note}</small></span><ChevronRight size={18} /></Link>)}</div><Link href="/help" className="workspace-support"><LifeBuoy size={26} /><div><strong>A little help, whenever you need it.</strong><span>Visit the help center <ArrowUpRight size={16} /></span></div></Link></aside></div>
    {role !== 'tenant' && <section className="workspace-panel glass"><div className="panel-heading"><div><span className="workspace-eyebrow">{role === 'admin' ? 'GROWING TOGETHER' : 'YOUR PORTFOLIO'}</span><h2>{role === 'admin' ? 'Newest community members' : 'Your latest properties'}</h2></div><Link className="text-link" href={root + (role === 'admin' ? '/users' : '/properties')}>View all<ArrowUpRight size={18} /></Link></div><div className="workspace-mini-grid">{loading ? <p className="p-6">Loading…</p> : role === 'admin' ? newest(data.users).slice(0,4).map(member => <Link href={root+'/users'} className="member-card" key={member.id}><span className="member-avatar">{member.name.slice(0,1)}</span><span><strong>{member.name}</strong><small>{member.email}</small><span className="member-role">{member.role.toLowerCase()}</span></span></Link>) : newest(data.properties).slice(0,3).map(property => <Link key={property.id} className="portfolio-card" href={`/dashboard/landlord/properties/edit/${property.id}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={property.image || '/property-placeholder.svg'} alt={property.title} /><div><h3>{property.title}</h3><p>{property.location}</p><strong>${property.price.toLocaleString()}<small> / {property.rentType === 'Per Year' ? 'year' : 'month'}</small></strong></div><ArrowUpRight size={18} /></Link>)}</div>{!loading && !error && (role === 'admin' ? !data.users.length : !data.properties.length) && <div className="workspace-empty"><p>Nothing here yet.</p><Link href={content.href}>{content.action}<ArrowUpRight size={17} /></Link></div>}</section>}
    <div className="workspace-updated"><span className="status-dot" />{updated ? `Last refreshed at ${updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Connected to your RentNest workspace'}</div>
  </div>;
}

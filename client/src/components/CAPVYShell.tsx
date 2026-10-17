import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CircleHelp,
  Crown,
  LayoutDashboard,
  Newspaper,
  WalletCards,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import type { ReactNode } from "react";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Cashflow lab", href: "/cashflow", icon: WalletCards },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Markets", href: "/markets", icon: Activity },
  { label: "Economic news", href: "/news", icon: Newspaper },
  { label: "Ask CAPVY", href: "/assistant", icon: CircleHelp },
];

const titleByPath: Record<string, string> = {
  "/": "Overview",
  "/cashflow": "Cashflow lab",
  "/learn": "Learn",
  "/markets": "Markets",
  "/news": "Economic news",
  "/assistant": "Ask CAPVY",
  "/premium": "CAPVY Plus",
};

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 36 36" fill="none">
        <path d="M26.8 8.2H17a9.8 9.8 0 1 0 0 19.6h9.8" stroke="currentColor" strokeWidth="3.3" strokeLinecap="round" />
        <path d="M17.2 18h11.5m-4.2-4.2 4.2 4.2-4.2 4.2" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function NavItem({ item, mobile = false }: { item: (typeof navigation)[number]; mobile?: boolean }) {
  const [path] = useLocation();
  const active = path === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`${mobile ? "mobile-nav-item" : "nav-item"} ${active ? "active" : ""}`}
      aria-current={active ? "page" : undefined}
      aria-label={mobile ? item.label : undefined}
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

export default function CAPVYShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const pageTitle = titleByPath[path] ?? "CAPVY";
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <Link href="/" className="brand-lockup" aria-label="CAPVY home">
          <BrandMark />
          <span className="brand-word">CAPVY<span className="brand-dot">.</span></span>
        </Link>
        <p className="brand-tagline">Learn fast. Think financially.</p>
        <div className="nav-caption">Workspace</div>
        <nav className="side-nav">
          {navigation.map((item) => <NavItem key={item.href} item={item} />)}
        </nav>
        <div className="sidebar-bottom">
          <div className="premium-teaser">
            <div className="premium-teaser-icon"><Crown size={16} /></div>
            <p className="premium-teaser-title">More room to grow</p>
            <p className="premium-teaser-copy">A deeper learning path is on its way.</p>
            <Link href="/premium" className="text-link">Explore what’s planned <ArrowUpRight size={13} /></Link>
          </div>
          <p className="sidebar-footnote">A practice space for better money decisions.</p>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-context">
            <span className="topbar-kicker">CAPVY / workspace</span>
            <h1>{pageTitle}</h1>
          </div>
          <div className="topbar-actions">
            <span className="mode-pill"><span className="mode-dot" /> Educational demo</span>
            <span className="avatar-mark" aria-label="Demo profile">C</span>
          </div>
        </header>
        <main className="page-content">{children}</main>
        <footer className="site-footer">
          <span>CAPVY — Learn Fast. Think Financially.</span>
          <span>Education, not investment advice. No real trades.</span>
        </footer>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map((item) => <NavItem key={item.href} item={item} mobile />)}
        <Link href="/premium" className={`mobile-nav-item ${path === "/premium" ? "active" : ""}`} aria-label="CAPVY Plus">
          <Crown size={18} aria-hidden="true" /><span>Plus</span>
        </Link>
      </nav>
    </div>
  );
}

import { Activity, ArrowRight, BookOpen, CircleHelp, Crown, LayoutDashboard, Newspaper, WalletCards } from "lucide-react";
import { motion, useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Link, useLocation } from "wouter";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "Cashflow", href: "/cashflow", icon: WalletCards },
  { label: "Learn", href: "/learn", icon: BookOpen },
  { label: "Markets", href: "/markets", icon: Activity },
  { label: "Economy", href: "/news", icon: Newspaper },
  { label: "Ask CAPVY", href: "/assistant", icon: CircleHelp },
];

type NavigationItem = (typeof navigation)[number];

const titleByPath: Record<string, string> = {
  "/": "Financial practice, made vivid",
  "/cashflow": "Cashflow Collision Detector",
  "/learn": "Five learning labs",
  "/markets": "Market data status",
  "/news": "Economic intelligence",
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

function NavItem({ item, path, mobile = false }: { item: NavigationItem; path: string; mobile?: boolean }) {
  const active = path === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`${mobile ? "mobile-nav-item" : "nav-item"} ${active ? "active" : ""}`}
      aria-current={active ? "page" : undefined}
      aria-label={mobile ? item.label : undefined}
    >
      <Icon size={mobile ? 18 : 15} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
      <span>{item.label}</span>
    </Link>
  );
}

export default function CAPVYShell({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const pageTitle = titleByPath[path] ?? "CAPVY";
  const contentRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const root = contentRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root || reducedMotion || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });

    const attachRevealTargets = () => {
      root.querySelectorAll<HTMLElement>(".page-stack > *:not([data-scroll-bound])").forEach((element, index) => {
        element.dataset.scrollBound = "true";
        element.classList.add("scroll-reveal");
        element.style.setProperty("--reveal-delay", `${Math.min(index * 55, 220)}ms`);
        observer.observe(element);
      });
    };

    attachRevealTargets();
    const mutationObserver = typeof MutationObserver === "undefined" ? null : new MutationObserver(attachRevealTargets);
    mutationObserver?.observe(root, { childList: true, subtree: true });

    const revealFocusedSection = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement) {
        event.target.closest<HTMLElement>(".scroll-reveal")?.classList.add("is-visible");
      }
    };
    root.addEventListener("focusin", revealFocusedSection);

    return () => {
      observer.disconnect();
      mutationObserver?.disconnect();
      root.removeEventListener("focusin", revealFocusedSection);
    };
  }, [path]);

  return (
    <div className="app-shell">
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <header className="topbar">
        <div className="topbar-brand-block">
          <Link href="/" className="brand-lockup" aria-label="CAPVY home">
            <BrandMark />
            <span className="brand-word">CAPVY<span className="brand-dot">.</span></span>
          </Link>
          <div className="topbar-context">
            <span className="topbar-kicker">LEARN FAST · THINK FINANCIALLY</span>
            <h1>{pageTitle}</h1>
          </div>
        </div>

        <nav className="side-nav" aria-label="Primary navigation">
          {navigation.map((item) => <NavItem key={item.href} item={item} path={path} />)}
        </nav>

        <div className="topbar-actions">
          <span className="mode-pill"><span className="mode-dot" /> PRACTICE ONLY</span>
          <Link href="/premium" className="button-primary header-cta">CAPVY Plus <ArrowRight size={14} /></Link>
        </div>
      </header>

      <div className="main-column">
        <main className="page-content" ref={contentRef}>{children}</main>
        <footer className="site-footer">
          <span>CAPVY — Learn Fast. Think Financially.</span>
          <span>Education, not investment advice. No real trades. Market data appears only when its source and display rights are verified.</span>
        </footer>
      </div>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navigation.map((item) => <NavItem key={item.href} item={item} path={path} mobile />)}
        <Link href="/premium" className={`mobile-nav-item ${path === "/premium" ? "active" : ""}`} aria-label="CAPVY Plus">
          <Crown size={18} aria-hidden="true" /><span>Plus</span>
        </Link>
      </nav>
    </div>
  );
}

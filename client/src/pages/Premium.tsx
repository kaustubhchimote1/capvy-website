import { ArrowLeft, ArrowUpRight, BookOpen, FileDown, GraduationCap, Layers3, Sparkles, Target, TrendingUp } from "lucide-react";
import { Link } from "wouter";

const plannedBenefits = [
  { icon: Sparkles, title: "More room to ask", copy: "A higher AI learning allowance, when available." },
  { icon: Layers3, title: "Deeper practice", copy: "Additional guided scenarios and advanced simulations." },
  { icon: GraduationCap, title: "A path that adapts", copy: "Planned learning paths for your next financial concept." },
  { icon: TrendingUp, title: "More market context", copy: "Expanded market learning and historical analysis, where supported." },
  { icon: FileDown, title: "Take your work with you", copy: "Exportable simulation reports are on the roadmap." },
  { icon: Target, title: "More ways to focus", copy: "Advanced guides in tax, risk and money decisions." },
];

export default function Premium() {
  return (
    <div className="page-stack">
      <section className="premium-hero panel"><div className="premium-glint" aria-hidden="true" /><div className="eyebrow"><span className="eyebrow-line" />A LITTLE MORE ROOM TO GROW</div><div className="premium-wordmark"><span className="premium-emblem"><Sparkles size={18} /></span><span>CAPVY <i>PLUS</i></span></div><h2>More depth.<br />When it’s ready.</h2><p>We’re shaping a richer learning experience. The plan is still being built—so this page is a promise of direction, not a promise of a product already for sale.</p><span className="coming-soon-stamp">COMING SOON · NO CHECKOUT</span></section>
      <section className="section-block premium-benefits-section"><div className="section-heading"><div><div className="eyebrow">PLANNED, NOT RELEASED</div><h2>What we’re exploring</h2></div></div><div className="planned-grid">{plannedBenefits.map((benefit) => { const Icon = benefit.icon; return <article className="planned-card" key={benefit.title}><span className="planned-icon"><Icon size={17} /></span><div><h3>{benefit.title}</h3><p>{benefit.copy}</p></div><span className="planned-chip">PLANNED</span></article>; })}</div></section>
      <section className="premium-free-note"><BookOpen size={17} /><p><strong>Learning stays open.</strong> CAPVY’s core educational experience is designed to remain useful without Premium. No payment is accepted from this page.</p></section>
      <Link className="inline-arrow back-dashboard-link" href="/"><ArrowLeft size={15} /> Back to your learning space <ArrowUpRight size={14} /></Link>
    </div>
  );
}

import { AlertTriangle, ArrowRight, CheckCircle2, CircleHelp, Clock3, Database, FileCheck2, Newspaper, Radio, Workflow } from "lucide-react";

const stages = [
  { number: "01", name: "Fetch authorized sources", icon: Radio, detail: "No news provider or RSS feed is connected." },
  { number: "02", name: "Validate & deduplicate", icon: FileCheck2, detail: "Pipeline code and canonical-source checks are not deployed." },
  { number: "03", name: "Categorize & explain", icon: Workflow, detail: "No verified article is available for AI explanation." },
  { number: "04", name: "Persist & serve", icon: Database, detail: "No processed news records are available to display." },
];

export default function News() {
  return (
    <div className="page-stack">
      <section className="page-intro-row news-intro"><div><div className="eyebrow"><span className="eyebrow-line" />ECONOMIC INTELLIGENCE</div><h2 className="page-title">The story matters.<br />So does the source.</h2><p className="page-lead">Financial news should bring its attribution, timestamp and uncertainty along with it. This demo will not fill the feed with invented headlines.</p></div><div className="news-pipeline-badge"><span className="pipeline-state-dot" /><small>PIPELINE STATUS</small><strong>Not configured</strong><span>No successful run to report.</span></div></section>

      <section className="panel news-empty-panel">
        <div className="news-empty-illustration"><Newspaper size={24} /><span><AlertTriangle size={14} /></span></div>
        <div className="eyebrow">NO VERIFIED STORIES AVAILABLE</div>
        <h3>Connect a source before showing a story.</h3>
        <p>CAPVY has not fetched a news feed in this project. No headline, summary or timestamp is shown here because none has been retrieved and verified. The last successful feed update is therefore <strong>not available</strong>.</p>
        <div className="news-empty-rule" />
        <div className="news-expectations"><span><CheckCircle2 size={15} />Source name &amp; original link</span><span><CheckCircle2 size={15} />Publication &amp; processing times</span><span><CheckCircle2 size={15} />Beginner explanation with uncertainty</span></div>
      </section>

      <section className="panel pipeline-panel"><div className="panel-heading-row"><div><div className="eyebrow">WHEN CONFIGURED</div><h3>Economic intelligence pipeline</h3></div><span className="tag tag-unavailable"><Clock3 size={12} /> NOT DEPLOYED</span></div><p className="pipeline-intro">The requested multi-stage Render Workflows integration is not connected or deployed in this preview. No refresh has been triggered. This is a roadmap view, not evidence of workflow execution.</p>
        <div className="pipeline-stages">{stages.map((stage, index) => { const Icon = stage.icon; return <div className="pipeline-stage" key={stage.number}><span className="pipeline-number">{stage.number}</span><span className="pipeline-icon"><Icon size={17} /></span><span className="pipeline-stage-copy"><strong>{stage.name}</strong><small>{stage.detail}</small></span><span className="pipeline-stage-state">NOT RUN</span>{index < stages.length - 1 && <span className="pipeline-connector" />}</div>; })}</div>
        <div className="pipeline-footer"><CircleHelp size={14} /><span>Setup requires verified Render Workflows conventions, authorized sources, provider credentials and a real persistent database integration.</span><span className="pipeline-no-action">Refresh unavailable</span></div>
      </section>
      <div className="fine-print"><AlertTriangle size={14} /><span>Do not make financial decisions using an unconnected feed. No article here is presented as current or verified.</span></div>
    </div>
  );
}

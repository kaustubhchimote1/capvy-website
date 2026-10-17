import { useRef, useState } from "react";
import { ArrowUp, BookOpen, CircleHelp, Lightbulb, LoaderCircle, RotateCcw, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";

type ChatMessage = { role: "user" | "assistant"; content: string };

const examples = [
  "What is the difference between an FD and an SIP?",
  "How does compound growth work?",
  "Why can a business earn a profit but run out of cash?",
  "What does a change in USD/INR usually mean?",
];

export default function Assistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [remaining, setRemaining] = useState(10);
  const [error, setError] = useState("");
  const [retryQuestion, setRetryQuestion] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const assistantStatus = trpc.assistant.status.useQuery(undefined, { staleTime: 30_000 });
  const ask = trpc.assistant.ask.useMutation();
  const dailyLimit = assistantStatus.data?.dailyLimit ?? 10;
  const setupRequired = assistantStatus.data?.configured === false;
  const statusLabel = assistantStatus.isLoading
    ? "Checking model service"
    : assistantStatus.data?.configured
      ? "Server-side model service configured"
      : assistantStatus.isError
        ? "Model status unavailable"
        : "Setup required · model service not configured";

  const submitQuestion = async (rawQuestion: string, isRetry = false) => {
    const question = rawQuestion.trim();
    if (!question || ask.isPending || remaining <= 0 || setupRequired) return;
    setError("");
    if (!isRetry) {
      setMessages((current) => [...current, { role: "user", content: question }]);
    }
    setInput("");
    setRetryQuestion(question);
    const previousQuestions = messages.flatMap((message) => message.role === "user" ? [{ role: "user" as const, content: message.content }] : []);
    const conversation = isRetry
      ? previousQuestions.slice(-10)
      : [...previousQuestions, { role: "user" as const, content: question }].slice(-10);
    try {
      const response = await ask.mutateAsync({ messages: conversation });
      setMessages((current) => [...current, { role: "assistant", content: response.answer }]);
      setRemaining(response.remaining);
      setRetryQuestion("");
      requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }));
    } catch (caught) {
      const errorMessage = caught instanceof Error ? caught.message : "The assistant could not reply. Please retry.";
      setError(errorMessage);
      if (/daily limit/i.test(errorMessage)) setRemaining(0);
      setInput(question);
    }
  };

  return (
    <div className="page-stack">
      <section className="page-intro-row assistant-intro"><div><div className="eyebrow"><span className="eyebrow-line" />PLAIN LANGUAGE, BETTER QUESTIONS</div><h2 className="page-title">Ask the “why.”<br />Keep your footing.</h2><p className="page-lead">A financial learning companion for concepts and hypotheticals—not a broker, personal advisor or live-data service.</p></div><div className="assistant-guardrail"><ShieldCheck size={17} /><span>EDUCATIONAL BY DESIGN</span><p>No guaranteed returns. No account access. No claimed live market or news lookups.</p></div></section>

      <section className="assistant-layout">
        <div className="panel chat-panel">
          <div className="chat-panel-header"><span className="assistant-avatar"><WandSparkles size={17} /></span><div><strong>CAPVY learning assistant</strong><span><i className={`assistant-live-dot ${assistantStatus.data?.configured ? "" : "service-offline"}`} />{statusLabel}</span></div><span className="usage-pill">{setupRequired ? "Setup required" : assistantStatus.isError ? "Status unavailable" : `${remaining}/${dailyLimit} replies today`}</span></div>
          {setupRequired && <div className="chat-service-state" role="status"><strong>Model service setup required</strong><p>Configure the model credentials on the server. Do not paste API keys here. The other CAPVY learning tools still work.</p></div>}
          {assistantStatus.isError && <div className="chat-service-state" role="status"><strong>Could not check model status</strong><p>You may still try a question; an unsuccessful request will not use a reply.</p></div>}
          <div className="chat-scroll" ref={scrollRef} aria-live="polite">
            <div className="chat-date-label">A GOOD PLACE TO START</div>
            <div className="chat-bubble assistant-bubble"><span className="bubble-avatar"><Sparkles size={13} /></span><div><p>Ask me about a money concept or a hypothetical decision. I’ll explain the reasoning in beginner-friendly language—and flag what I can’t know.</p><p className="chat-caveat">I don’t see live market prices, current news, or personal financial accounts.</p></div></div>
            {messages.map((message, index) => <div key={`${index}-${message.role}`} className={`chat-message-row ${message.role === "user" ? "user-row" : "assistant-row"}`}><div className={`chat-bubble ${message.role === "user" ? "user-bubble" : "assistant-bubble"}`}>{message.role === "assistant" ? <span className="bubble-avatar"><Sparkles size={13} /></span> : null}<div>{message.role === "assistant" ? <Streamdown>{message.content}</Streamdown> : <p>{message.content}</p>}</div></div></div>)}
            {ask.isPending && <div className="chat-bubble assistant-bubble pending-bubble"><span className="bubble-avatar"><Sparkles size={13} /></span><div><span className="thinking-label"><LoaderCircle size={13} className="spin-slow" /> Thinking it through…</span><small>Grounding the explanation, not predicting the market.</small></div></div>}
            {error && <div className="chat-error" role="alert"><CircleHelp size={15} /><div><strong>That reply didn’t come through.</strong><p>{error}</p>{retryQuestion && <button type="button" className="inline-arrow" onClick={() => void submitQuestion(retryQuestion, true)} disabled={ask.isPending || remaining <= 0 || setupRequired}>Retry this question <RotateCcw size={13} /></button>}</div></div>}
          </div>
          {messages.length === 0 && <div className="prompt-suggestions"><span>TRY A QUESTION</span>{examples.map((example) => <button key={example} type="button" onClick={() => void submitQuestion(example)} disabled={ask.isPending || remaining <= 0 || setupRequired}><Lightbulb size={13} />{example}</button>)}</div>}
          <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); void submitQuestion(input); }}>
            <label className="sr-only" htmlFor="assistant-input">Ask a financial-learning question</label><textarea id="assistant-input" value={input} onChange={(event) => setInput(event.target.value)} maxLength={2000} rows={2} placeholder={setupRequired ? "AI service setup is required…" : "Ask about a financial concept…"} disabled={remaining <= 0 || setupRequired} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void submitQuestion(input); } }} />
            <div className="composer-footer"><span>Enter to send · Shift+Enter for a new line</span><button type="submit" className="send-button" disabled={!input.trim() || ask.isPending || remaining <= 0 || setupRequired} aria-label="Send question">{ask.isPending ? <LoaderCircle size={17} className="spin-slow" /> : <ArrowUp size={18} />}</button></div>
          </form>
          <div className="chat-limit-note"><ShieldCheck size={13} />{setupRequired ? "The model is not configured; use the other learning experiences." : remaining > 0 ? `Server-side demo allowance: ${remaining} of ${dailyLimit} successful replies remain for this network today. Failed requests do not use a reply.` : "Demo reply limit reached for this network. It resets at 00:00 UTC."}</div>
        </div>

        <aside className="assistant-side-column"><section className="panel assistant-guide-panel"><div className="panel-topline"><span className="panel-label"><BookOpen size={13} /> HOW TO USE IT</span></div><div className="guide-step"><span>01</span><p><strong>Ask to understand</strong> a concept, not to pick an investment.</p></div><div className="guide-step"><span>02</span><p><strong>Share only a hypothetical</strong> scenario—never passwords or account details.</p></div><div className="guide-step"><span>03</span><p><strong>Check the assumptions.</strong> An explanation is not a forecast.</p></div></section>
          <section className="assistant-safety-card"><div className="eyebrow">CLEAR BOUNDARIES</div><h3>A helpful voice, not the final word.</h3><p>AI can make mistakes or miss current rules. Verify important tax or financial decisions with a qualified professional and current official sources.</p><span className="assistant-safety-mark"><ShieldCheck size={16} /> EDUCATIONAL ONLY</span></section>
        </aside>
      </section>
    </div>
  );
}

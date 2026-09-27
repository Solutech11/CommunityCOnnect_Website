import { useState, type FormEvent } from "react";
import { type MetaFunction } from "react-router";
import { ArrowUp, Sparkles } from "lucide-react";
import { request } from "../lib/api";
import { protectedRequest, useAuth } from "../lib/auth";
import { renderEmphasis } from "../lib/text";

export const meta: MetaFunction = () => [{ title: "Community AI | Community Connect" }, { name: "description", content: "Ask Community AI about the app and upcoming public events." }];
type Message = { role: "user" | "assistant"; content: string };
export default function AI() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent) => {
    event.preventDefault(); const message = draft.trim(); if (!message || busy) return;
    setMessages((previous) => [...previous, { role: "user", content: message }]); setDraft(""); setBusy(true); setError("");
    try {
      const result = user
        ? await protectedRequest<{ message: string; sessionId: string }>("/ai/chat", { method: "POST", body: JSON.stringify({ message, ...(sessionId ? { sessionId } : {}) }) })
        : await request<{ message: string }>("/ai/guest-chat", { method: "POST", body: JSON.stringify({ message, history: messages.slice(-6) }) });
      if ("sessionId" in result && typeof result.sessionId === "string") setSessionId(result.sessionId);
      setMessages((previous) => [...previous, { role: "assistant", content: result.message }]);
    } catch (failure) { setError(failure instanceof Error ? failure.message : "Community AI is unavailable right now."); }
    finally { setBusy(false); }
  };
  return <section className="ai-page"><div className="container ai-layout"><div className="ai-intro"><span className="eyebrow green-text">YOUR CURIOUS COMPANION</span><h1>Ask away.<br /><em>Go further.</em></h1><p>Need an event idea or want to know how Community Connect works? Start a conversation.</p><div className="prompt-chips">{["What can I do with Community Connect?", "Are there upcoming events?", "How do tickets work?"].map((prompt) => <button key={prompt} onClick={() => setDraft(prompt)}>{prompt}</button>)}</div></div><div className="chat-shell"><div className="chat-header"><span className="chat-avatar">✳</span><div><strong>Community AI</strong><small>Here for the good questions</small></div><Sparkles size={20} /></div><div className="chat-messages" aria-live="polite">{messages.length === 0 && <div className="chat-welcome"><span>✳</span><h2>Hey there!</h2><p>Tell me what you’re looking for, or ask me about Community Connect.</p></div>}{messages.map((message, index) => <div key={index} className={`chat-message ${message.role}`}>{message.role === "assistant" && <span>✳</span>}<p>{renderEmphasis(message.content)}</p></div>)}{busy && <div className="chat-message assistant"><span>✳</span><p>Thinking…</p></div>}</div><form className="chat-form" onSubmit={(event) => void submit(event)}><label className="sr-only" htmlFor="chat-input">Message Community AI</label><input id="chat-input" value={draft} maxLength={1000} onChange={(event) => setDraft(event.target.value)} placeholder="Ask me anything about events…" /><button aria-label="Send message" disabled={busy || !draft.trim()}><ArrowUp size={19} /></button></form><p className="chat-disclosure">Your submitted message and recent chat context are processed by our backend’s Groq AI provider. Please avoid sharing sensitive information. {user ? "Signed-in chats may be saved to your account." : "Guest chats are temporary and cannot access your personal data."}</p>{error && <p className="form-error" role="alert">{error}</p>}</div></div></section>;
}

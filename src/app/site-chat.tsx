"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const CHAT_URL = "https://chat.kevcspot.com";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export function SiteChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open && connected === null) {
      fetch(`${CHAT_URL}/api/backends`, { signal: AbortSignal.timeout(5000) })
        .then((r) => setConnected(r.ok))
        .catch(() => setConnected(false));
    }
  }, [open, connected]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || sending) return;

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((p) => [...p, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setInput("");
    setSending(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const sysMsgs = [
        { role: "system", content: "You are the KC-AI site assistant. Help visitors learn about KC-AI services, AI projects, and answer questions. Keep responses concise and friendly." },
        ...history,
        { role: "user", content: text },
      ];

      const res = await fetch(`${CHAT_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: sysMsgs, backend: "vultr" }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error(`${res.status}`);

      const reader = (res.body as ReadableStream<Uint8Array>).getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data: ")) continue;
          try {
            const p = JSON.parse(t.slice(6));
            if (p.token) {
              full += p.token;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: full };
                return next;
              });
            }
          } catch {}
        }
      }

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", content: full || "(No response)" };
        return next;
      });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: "Sorry, I couldn't reach the AI. Please try again." };
          return next;
        });
      }
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  }, [input, sending, messages]);

  if (!open) {
    return (
      <div className="chat-fab" onClick={() => setOpen(true)}>
        <span className="chat-fab-pulse" />
        <span style={{ color: "#1a1006" }}>💬</span>
      </div>
    );
  }

  return (
    <>
      <div className="chat-fab" onClick={() => setOpen(false)} style={{ background: "linear-gradient(135deg, var(--red), #c0392b)" }}>
        <span style={{ color: "white", fontSize: "clamp(18px, 4vw, 22px)" }}>✕</span>
      </div>
      <div className="chat-panel">
        <div className="chat-panel-header">
          <div className="flex items-center gap-2">
            <span className="text-sm font-display font-700 text-[var(--gold-bright)]">AI Assistant</span>
            {connected !== null && (
              <span className="chip chip-green" style={{ fontSize: "9px" }}>{connected ? "Online" : "Offline"}</span>
            )}
          </div>
          <span className="text-[10px] text-[var(--text-dim)] font-mono">Headless-Forge</span>
        </div>
        <div ref={scrollRef} className="chat-panel-body">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-[var(--text-dim)] mb-1">Ask me about KC-AI</p>
              <p className="text-xs text-[var(--text-dim)]">Services, projects, AI models, pricing</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble ${msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}`}>
              {msg.content}
              {msg.role === "assistant" && sending && i === messages.length - 1 && msg.content === "" && (
                <span className="inline-block w-1.5 h-1.5 bg-[var(--cyan)] rounded-full animate-pulse ml-1" />
              )}
            </div>
          ))}
        </div>
        <div className="chat-panel-footer">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={connected === false ? "AI offline..." : "Ask about KC-AI..."}
            disabled={sending}
            rows={1}
            className="chat-input"
            style={{ minHeight: "40px", maxHeight: "80px" }}
          />
          <button onClick={send} disabled={!input.trim() || sending} className="chat-send">
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}

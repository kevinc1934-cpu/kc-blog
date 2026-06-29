"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CHAT_URL = "https://chat.kevcspot.com";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  agent?: string;
  model?: string;
  backend?: string;
  timestamp: string;
}

export function WebChat({ height = "calc(100vh - 200px)" }: { height?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streamRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${CHAT_URL}/api/backends`, { signal: AbortSignal.timeout(5000) })
      .then((r) => { if (!cancelled) setConnected(r.ok); })
      .catch(() => { if (!cancelled) setConnected(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed, timestamp: new Date().toISOString() };
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    const assistantMsg: ChatMessage = { role: "assistant", content: "", agent: "Headless-Forge", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, assistantMsg]);

    const ctrl = new AbortController();
    streamRef.current = ctrl;

    try {
      const systemMessages = [
        { role: "system", content: "You are Headless-Forge, an AI assistant with a persistent cognitive memory system. Use the provided memory context to inform your responses. Keep responses conversational and concise." },
        ...history,
        { role: "user", content: trimmed },
      ];

      const res = await fetch(`${CHAT_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: systemMessages, backend: "vultr" }),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).substring(0, 200)}`);

      const reader = (res.body as ReadableStream<Uint8Array>).getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let model = "";
      let backend = "vultr";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(t.slice(6));
            if (parsed.token) {
              fullText += parsed.token;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { ...next[next.length - 1], content: fullText };
                return next;
              });
            }
            if (parsed.model) model = parsed.model;
            if (parsed.backend) backend = parsed.backend;
          } catch {}
        }
      }

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], content: fullText || "(No response)", model, backend };
        return next;
      });
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: `Error: ${err.message || "Failed to reach Headless-Forge"}` };
          return next;
        });
      }
    } finally {
      setSending(false);
      streamRef.current = null;
      inputRef.current?.focus();
    }
  }, [input, sending, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="flex flex-col" style={{ height }}>
      {connected === false && (
        <div className="glass p-3 mb-2 text-center flex-shrink-0">
          <div className="text-[var(--red)] text-xs">Headless-Forge offline. Start the headless CLI on port 8198.</div>
        </div>
      )}

      <div ref={scrollRef} className="glass p-4 flex-1 overflow-y-auto space-y-3 min-h-0" style={{ marginBottom: "8px" }}>
        {messages.length === 0 && (
          <div className="text-[var(--text-dim)] text-sm text-center py-8">
            <p className="mb-2">Headless-Forge Chat</p>
            <p className="text-xs">Connected to the headless CLI. Persistent memory, streaming responses.</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-[var(--purple)] text-white" : "bg-[var(--surface)] border border-[var(--border)]"}`}>
              {msg.role === "assistant" && msg.agent && (
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono text-[var(--cyan)]">{msg.agent}</span>
                  {msg.model && msg.model !== "error" && msg.model !== "system" && (
                    <span className="text-[10px] text-[var(--text-dim)] font-mono">{msg.model}</span>
                  )}
                  {msg.backend && msg.backend !== "error" && msg.backend !== "system" && (
                    <span className="chip chip-gold text-[10px]">{msg.backend}</span>
                  )}
                </div>
              )}
              <div className={`text-sm whitespace-pre-wrap ${msg.role === "user" ? "text-white" : "text-[var(--text)]"}`}>
                {msg.content}
                {msg.role === "assistant" && sending && i === messages.length - 1 && msg.content && (
                  <span className="inline-block w-1.5 h-4 bg-[var(--cyan)] ml-1 animate-pulse" style={{ verticalAlign: "text-bottom" }} />
                )}
              </div>
            </div>
          </div>
        ))}
        {sending && messages.length > 0 && messages[messages.length - 1].role === "assistant" && !messages[messages.length - 1].content && (
          <div className="flex justify-start">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={connected === false ? "Headless-Forge offline..." : "Ask Headless-Forge..."}
          disabled={sending}
          rows={1}
          className="flex-1 glass px-4 py-3 rounded-2xl text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] resize-none outline-none focus:border-[var(--cyan)] disabled:opacity-40"
          style={{ minHeight: "48px", maxHeight: "100px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          className="px-5 py-3 bg-[var(--cyan)] text-[#0a0a0f] font-medium rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
        >
          {sending ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

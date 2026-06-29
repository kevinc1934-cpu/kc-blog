"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

const CHAT_API = "https://chat.kevcspot.com/api/chat";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  image?: string;
}

type LiveState = "idle" | "listening" | "thinking" | "speaking";

export default function WebChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);
  const [liveMode, setLiveMode] = useState(false);
  const [liveState, setLiveState] = useState<LiveState>("idle");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [visionOpen, setVisionOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const streamRef = useRef<AbortController | null>(null);
  const liveModeRef = useRef(false);
  const ttsEnabledRef = useRef(true);
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef2 = useRef<MediaStream | null>(null);

  useEffect(() => { liveModeRef.current = liveMode; }, [liveMode]);
  useEffect(() => { ttsEnabledRef.current = ttsEnabled; }, [ttsEnabled]);

  useEffect(() => {
    fetch(`${CHAT_API.replace("/api/chat", "/api/backends")}`, { signal: AbortSignal.timeout(5000) })
      .then((r) => setConnected(r.ok))
      .catch(() => setConnected(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // ─── Speech synthesis (text-to-speech) ────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!ttsEnabledRef.current || !text) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_`#>]/g, "").replace(/\n+/g, ". ").trim();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes("Google") && v.lang.startsWith("en")) || voices.find(v => v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;
    if (liveModeRef.current) {
      utter.onstart = () => setLiveState("speaking");
      utter.onend = () => {
        setLiveState("idle");
        if (liveModeRef.current) startListening();
      };
    }
    window.speechSynthesis.speak(utter);
  }, []);

  // ─── Speech recognition (ears) ────────────────────────────────────────────
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === "undefined") return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    stopListening();
    const recog = new SR();
    recog.continuous = false;
    recog.interimResults = true;
    recog.lang = "en-US";
    let finalText = "";
    recog.onresult = (e: any) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setInput(finalText + interim);
    };
    recog.onend = () => {
      setLiveState("idle");
      if (liveModeRef.current && finalText.trim()) {
        setInput(finalText.trim());
        setTimeout(() => sendVoiceMessage(finalText.trim()), 100);
      }
    };
    recog.onerror = () => { setLiveState("idle"); };
    recognitionRef.current = recog;
    setLiveState("listening");
    try { recog.start(); } catch {}
  }, [stopListening]);

  // ─── Send message (core) ──────────────────────────────────────────────────
  const doSend = useCallback(async (text: string, image?: string | null) => {
    if (!text.trim() || sending) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim(), timestamp: new Date().toISOString(), image: image || undefined };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setCapturedImage(null);
    setSending(true);

    const assistantMsg: ChatMessage = { role: "assistant", content: "", timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, assistantMsg]);

    if (liveModeRef.current) setLiveState("thinking");

    const ctrl = new AbortController();
    streamRef.current = ctrl;

    try {
      const systemMessages = [
        { role: "system", content: "You are an AI assistant powered by Memory-Forge with a persistent cognitive memory system. You have vision capabilities — you can see and analyze images. Use the provided memory context to inform your responses. Keep responses conversational and concise for voice mode." },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: text.trim() },
      ];

      const body: any = { messages: systemMessages, backend: "vultr" };
      if (image) body.image = image;

      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: ctrl.signal,
      });

      if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).substring(0, 200)}`);

      const reader = (res.body as ReadableStream<Uint8Array>).getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";

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
          } catch {}
        }
      }

      if (!fullText) {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: "(No response)" };
          return next;
        });
      } else if (liveModeRef.current) {
        speak(fullText);
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { ...next[next.length - 1], content: `Error: ${err.message || "Failed to reach CLI"}` };
          return next;
        });
      }
    } finally {
      setSending(false);
      streamRef.current = null;
      if (!liveModeRef.current) inputRef.current?.focus();
    }
  }, [sending, messages, speak]);

  const sendMessage = useCallback(() => { doSend(input, capturedImage); }, [doSend, input, capturedImage]);
  const sendVoiceMessage = useCallback((text: string) => { doSend(text, null); }, [doSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // ─── Live mode toggle ─────────────────────────────────────────────────────
  const toggleLiveMode = useCallback(() => {
    if (liveMode) {
      setLiveMode(false);
      setLiveState("idle");
      stopListening();
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    } else {
      setLiveMode(true);
      setTimeout(() => startListening(), 300);
    }
  }, [liveMode, stopListening, startListening]);

  // ─── Camera capture (eyes) ────────────────────────────────────────────────
  const openCamera = useCallback(async () => {
    setVisionOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef2.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) { console.error("Camera error:", err); }
  }, []);

  const closeCamera = useCallback(() => {
    setVisionOpen(false);
    if (streamRef2.current) {
      streamRef2.current.getTracks().forEach(t => t.stop());
      streamRef2.current = null;
    }
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    closeCamera();
  }, [closeCamera]);

  // ─── File upload (vision alternative) ─────────────────────────────────────
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setCapturedImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  // ─── Mic button (one-shot voice) ──────────────────────────────────────────
  const micClick = useCallback(() => {
    if (liveState === "listening") { stopListening(); setLiveState("idle"); }
    else startListening();
  }, [liveState, stopListening, startListening]);

  useEffect(() => {
    return () => {
      stopListening();
      if (streamRef2.current) streamRef2.current.getTracks().forEach(t => t.stop());
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [stopListening]);

  const liveColor = liveState === "listening" ? "var(--green)" : liveState === "thinking" ? "var(--gold)" : liveState === "speaking" ? "var(--cyan)" : "var(--text-dim)";

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: "64px" }}>
      <div className="max-w-5xl w-full mx-auto px-4 flex-1 flex flex-col" style={{ maxHeight: "calc(100vh - 64px)" }}>
        {/* Header */}
        <div className="flex items-center justify-between py-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="btn-chip text-xs flex items-center gap-1">
              <span>Back to Dashboard</span>
            </Link>
            <div className="chip chip-cyan text-xs">Memory-Forge</div>
            {liveMode && (
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: liveColor, boxShadow: `0 0 8px ${liveColor}`, animation: "pulse 1.5s infinite" }} />
                <span className="text-xs font-mono" style={{ color: liveColor }}>{liveState}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* TTS toggle */}
            <button onClick={() => setTtsEnabled(!ttsEnabled)} title="Text-to-speech" className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg transition-colors" style={{ background: ttsEnabled ? "rgba(25,228,212,0.1)" : "transparent", border: `1px solid ${ttsEnabled ? "rgba(25,228,212,0.2)" : "var(--border)"}` }}>
              <span style={{ fontSize: "14px" }}>{ttsEnabled ? "🔊" : "🔇"}</span>
              <span style={{ color: ttsEnabled ? "var(--cyan)" : "var(--text-dim)" }}>TTS</span>
            </button>
            {/* Live mode toggle */}
            <button onClick={toggleLiveMode} title="Live conversation mode" className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-lg font-medium transition-all" style={{ background: liveMode ? "rgba(74,222,128,0.12)" : "transparent", border: `1px solid ${liveMode ? "rgba(74,222,128,0.3)" : "var(--border)"}`, color: liveMode ? "var(--green)" : "var(--text-dim)" }}>
              <span style={{ fontSize: "14px" }}>{liveMode ? "⏹" : "🎙"}</span>
              <span>Live</span>
            </button>
            {/* Connection indicator */}
            {connected === null ? (
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--text-dim)]" />
            ) : connected ? (
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--green)]" style={{ boxShadow: "0 0 6px var(--green)" }} />
                <span className="text-xs text-[var(--text-dim)] font-mono hidden sm:inline">online</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-[var(--red)]" />
                <span className="text-xs text-[var(--red)]">Offline</span>
              </div>
            )}
          </div>
        </div>

        {/* Camera overlay */}
        {visionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.9)", paddingTop: "64px" }}>
            <div className="flex flex-col items-center gap-4">
              <video ref={videoRef} autoPlay playsInline className="rounded-2xl" style={{ maxWidth: "90vw", maxHeight: "60vh", border: "2px solid var(--border-bright)" }} />
              <canvas ref={canvasRef} style={{ display: "none" }} />
              <div className="flex gap-3">
                <button onClick={captureFrame} className="px-6 py-3 rounded-2xl font-medium" style={{ background: "var(--cyan)", color: "#08080c" }}>📸 Capture</button>
                <button onClick={closeCamera} className="px-6 py-3 rounded-2xl font-medium" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="glass p-4 flex-1 overflow-y-auto space-y-4 min-h-0" style={{ marginBottom: "12px" }}>
          {messages.length === 0 && (
            <div className="text-[var(--text-dim)] text-sm text-center py-8">
              <p className="mb-2">Memory-Forge Chat — voice, vision, live mode</p>
              <p className="text-xs">🎙 Click mic for voice input · 📷 Camera for vision · Live mode for hands-free conversation</p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? "bg-[var(--purple)] text-white" : "bg-[var(--surface)] border border-[var(--border)]"}`}>
                {msg.image && (
                  <img src={msg.image} alt="capture" className="rounded-xl mb-2 max-h-48 object-contain" />
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

        {/* Captured image preview */}
        {capturedImage && (
          <div className="flex items-center gap-2 mb-2 flex-shrink-0">
            <img src={capturedImage} alt="preview" className="rounded-lg max-h-16 border border-[var(--border)]" />
            <button onClick={() => setCapturedImage(null)} className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-dim)" }}>✕ Remove</button>
            <span className="text-xs text-[var(--cyan)]">Image attached — model will see it</span>
          </div>
        )}

        {/* Input bar */}
        <div className="flex gap-2 flex-shrink-0 pb-4 items-end">
          {/* Vision button */}
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={openCamera} disabled={sending} title="Camera / vision" className="w-12 h-12 rounded-2xl flex items-center justify-center transition-opacity disabled:opacity-30" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: "20px" }}>📷</span>
            </button>
            <label title="Upload image" className="w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer transition-opacity" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
              <span style={{ fontSize: "20px" }}>📎</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Mic button */}
          <button onClick={micClick} disabled={sending && !liveMode} title="Voice input" className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-30" style={{ background: liveState === "listening" ? "rgba(74,222,128,0.15)" : "var(--surface)", border: `1px solid ${liveState === "listening" ? "rgba(74,222,128,0.4)" : "var(--border)"}` }}>
            <span style={{ fontSize: "20px", color: liveState === "listening" ? "var(--green)" : "var(--text)" }}>{liveState === "listening" ? "🔴" : "🎙"}</span>
          </button>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={liveState === "listening" ? "Listening..." : connected === false ? "CLI offline..." : "Ask Memory-Forge..."}
            disabled={sending && !liveMode}
            rows={1}
            className="flex-1 glass px-4 py-3 rounded-2xl text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] resize-none outline-none focus:border-[var(--cyan)] disabled:opacity-40"
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />

          {/* Send button */}
          <button onClick={sendMessage} disabled={(!input.trim() && !capturedImage) || sending} className="px-5 py-3 bg-[var(--cyan)] text-[#08080c] font-medium rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0" style={{ height: "48px" }}>
            {sending ? "..." : "Send"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}

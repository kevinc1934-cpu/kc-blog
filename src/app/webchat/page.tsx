"use client";

import { useState, useEffect } from "react";

const REMOTE_WEBCHAT_URL = "https://webchat-forge.vercel.app";
const LOCAL_WEBCHAT_URL = "http://localhost:8198";

export default function WebChatPage() {
  const [loaded, setLoaded] = useState(false);
  const [webchatUrl, setWebchatUrl] = useState(REMOTE_WEBCHAT_URL);

  useEffect(() => {
    setWebchatUrl(
      window.location.hostname === "localhost" ? LOCAL_WEBCHAT_URL : REMOTE_WEBCHAT_URL
    );
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pt-20">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="chip chip-cyan mb-3">Live Chat</div>
          <h1 className="font-display font-800 text-3xl gradient-cyan">WebChat-Forge</h1>
        </div>
        {!loaded && (
          <div className="text-sm text-[var(--text-dim)] animate-pulse">Loading chat interface...</div>
        )}
      </div>
      <div className="glass p-2 overflow-hidden rounded-2xl" style={{ height: "calc(100vh - 220px)" }}>
        <iframe
          src={webchatUrl}
          className="w-full h-full rounded-xl border-0"
          title="WebChat-Forge"
          allow="clipboard-read; clipboard-write"
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}

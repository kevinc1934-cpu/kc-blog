export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: "AI Infrastructure" | "Desktop Application" | "Memory System";
  tech: string[];
  features: string[];
  architecture: string;
  status: string;
  highlight: string;
  accent: "gold" | "cyan" | "purple";
}

export const projects: Project[] = [
  {
    slug: "ai-business",
    name: "AI Business Platform",
    tagline: "Multi-agent orchestration with automation, dashboards, and department management",
    description:
      "A centralized AI platform that orchestrates multiple specialized agents across departments. Features a real-time dashboard, automation pipelines, memory-backed knowledge graph, and plugin architecture for extensibility. Built to run AI operations end-to-end — from agent dispatch to execution monitoring.",
    category: "AI Infrastructure",
    tech: ["Node.js", "TypeScript", "Express", "Playwright", "SQLite", "WebSocket", "Cron"],
    features: [
      "Multi-agent orchestration with parallel dispatch",
      "Real-time dashboard with live log streaming",
      "Department-based agent organization",
      "Plugin architecture for custom capabilities",
      "Automation pipelines with cron scheduling",
      "Memory-backed knowledge graph integration",
      "Paperclip data processing pipeline",
    ],
    architecture:
      "The platform runs as a Node.js server with Express for the API layer. Agents are dispatched as background processes with WebSocket-based log streaming to a real-time dashboard. A sidecar semantic search server provides memory-backed recall. The frontend is a single-page app served from the same server with dark-themed control panels.",
    status: "Active Development",
    highlight: "15+ agents running across 6 departments with live monitoring",
    accent: "gold",
  },
  {
    slug: "dotnet-app",
    name: "KCAI Desktop",
    tagline: "WPF desktop AI assistant with local LLM, cloud providers, and swarm coordination",
    description:
      "A Windows desktop application built with .NET 8 and WPF that serves as a local-first AI assistant. Supports local LLM inference (llama.cpp), cloud provider integration (OpenAI, Anthropic, Google), MCP protocol for tool use, knowledge management with markdown rendering, and swarm coordination across multiple machines.",
    category: "Desktop Application",
    tech: [".NET 8", "WPF", "C#", "llama.cpp", "MCP", "CommunityToolkit.Mvvm", "Markdig", "Newtonsoft.Json"],
    features: [
      "Local LLM inference via llama.cpp integration",
      "Multi-cloud provider support (OpenAI, Anthropic, Google, OpenRouter)",
      "MCP (Model Context Protocol) for tool extensibility",
      "Knowledge management with markdown rendering",
      "Swarm coordination across multiple machines",
      "Theme system with customizable appearance",
      "MVVM architecture with CommunityToolkit",
    ],
    architecture:
      "Built on .NET 8 with WPF for the UI layer. Uses CommunityToolkit.Mvvm for the MVVM pattern, Markdig for markdown rendering, and Newtonsoft.Json for serialization. The app communicates with local llama.cpp for inference and cloud APIs for remote models. MCP integration allows tool use across the agent ecosystem.",
    status: "Active Development",
    highlight: "Version 2.0.0 — local LLM + 4 cloud providers + MCP tool use",
    accent: "cyan",
  },
  {
    slug: "memory-forge",
    name: "Memory Forge",
    tagline: "Cognitive memory platform with forgetting curve, contradiction detection, procedural memory, and cross-session continuity",
    description:
      "A cognitive memory platform for AI agents with a real-time live-synced memory graph. Models memory after human cognition with STM/LTM/training tiers, an Ebbinghaus forgetting curve for decay management, semantic contradiction detection, procedural memory for reusable skills, context compression, a retrieval feedback loop for self-tuning recall, and cross-session continuity for resuming interrupted work. Includes a meta-cognitive framework with SICOG self-improvement and adversarial augmentation.",
    category: "Memory System",
    tech: ["TypeScript", "Node.js", "Python", "MCP", "Supabase", "Cloudflare R2", "Fast.io", "Express"],
    features: [
      "Live-synced graph with instant persistence (debounced async writes)",
      "STM/LTM/Training memory tiers with auto-promotion and TTL expiration",
      "Ebbinghaus forgetting curve — decay sweep every 5 min, dormant memory management",
      "Contradiction detection — temporal markers + semantic similarity analysis",
      "Procedural memory — store and recall step-by-step procedures by task description",
      "Memory compression — compress N nodes into 1 summary node (sources preserved)",
      "Retrieval feedback loop — track usefulCount/rejectedCount for self-tuning recall",
      "Cross-session continuity — session markers, checkpoints, and context reconstruction",
      "Meta-cognitive framework — SICOG self-improvement, episodic memory, adversarial augmentation",
      "Entity linking with automatic graph relations",
      "Temporal fact invalidation — auto-invalidate old facts when contradicted",
      "Multi-backend storage — R2, Fast.io, Supabase, LanceDB, Mem0, Supermemory, MemoryLake",
      "48 MCP tools + 69 REST endpoints for full programmatic access",
      "89-assertion stress test covering all cognitive features + edge cases",
    ],
    architecture:
      "The core is a 1572-line LiveMemorySync engine managing a JSON-based graph with nodes and edges. Memory decays via an Ebbinghaus curve (R = e^(-t/halfLife) * (1 + ln(recalls+1))), with dormant threshold at 0.01. Contradictions are detected via temporal regex patterns and semantic analysis (embedding similarity > 0.7 + Jaccard overlap < 0.4). Procedural memory stores skills with trigger keywords and success tracking. A meta-cognitive framework provides SICOG (Chain-of-Deliberation/Thought + self-consistency), episodic memory, and adversarial augmentation. Storage is multi-backend: local JSON graph (default), Cloudflare R2 (S3-compatible), Fast.io (MCP), Supabase (Postgres), LanceDB (vectors), and cloud memory services. The MCP server exposes 48 tools via stdio, and a REST API on port 8199 provides 69 endpoints.",
    status: "Active Development — v5.0.0",
    highlight: "48 MCP tools, 6 cognitive memory features, 89-assertion stress test passing",
    accent: "purple",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

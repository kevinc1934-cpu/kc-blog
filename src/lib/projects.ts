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
    tagline: "Graph-based semantic memory with real-time recall and MCP integration",
    description:
      "A TypeScript memory infrastructure module that provides graph-based knowledge storage with semantic search. Uses a live-synced graph that persists to disk with real-time updates. Integrates with the MCP ecosystem for agent memory access. Features a sidecar semantic search server with vector embeddings for recall.",
    category: "Memory System",
    tech: ["TypeScript", "Node.js", "Python", "Sentence Transformers", "MCP", "WebSocket"],
    features: [
      "Live-synced graph with instant persistence",
      "Semantic search via sentence-transformer embeddings",
      "Python sidecar server for vector similarity",
      "MCP integration for agent memory access",
      "Multiple memory types (fact, skill, code, entity, conversation, preference)",
      "Graph statistics and health monitoring",
      "Automatic graph optimization and compaction",
    ],
    architecture:
      "The core is a TypeScript module managing a JSON-based graph with nodes and edges. A Python sidecar runs a semantic search server using sentence-transformers for vector embeddings. The graph live-syncs to disk with every write operation. MCP integration allows AI agents to recall and store memories. WebSocket events provide real-time updates to connected clients.",
    status: "Active Development",
    highlight: "694+ nodes in live graph with sub-100ms semantic recall",
    accent: "purple",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  isAiGenerated: boolean;
  date: string;
  readTime: string;
  accent: "gold" | "cyan" | "purple";
  content: PostSection[];
}

export interface PostSection {
  heading?: string;
  body?: string;
  list?: string[];
  code?: { language: string; code: string };
  callout?: { type: "info" | "warning" | "tip"; text: string };
  table?: { headers: string[]; rows: string[][] };
}

export interface ProjectUpdate {
  slug: string;
  projectSlug: string;
  projectName: string;
  title: string;
  description: string;
  date: string;
  accent: "gold" | "cyan" | "purple";
}

const POSTS_DIR = path.join(process.cwd(), "src", "data", "posts");

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"));
  const posts: BlogPost[] = [];
  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
      posts.push(JSON.parse(content));
    } catch (e) {
      console.error(`Error reading post ${file}:`, e);
    }
  }
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPost(slug: string): BlogPost | undefined {
  const filePath = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return undefined;
  }
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getCategories(): { name: string; count: number; accent: "gold" | "cyan" | "purple" }[] {
  const posts = getAllPosts();
  const catMap = new Map<string, number>();
  for (const post of posts) {
    catMap.set(post.category, (catMap.get(post.category) || 0) + 1);
  }
  const accentMap: Record<string, "gold" | "cyan" | "purple"> = {
    "AI": "cyan",
    "Sweepstakes": "gold",
    "Tech": "purple",
    "General": "cyan",
  };
  return Array.from(catMap.entries()).map(([name, count]) => ({
    name,
    count,
    accent: accentMap[name] || "cyan",
  }));
}

export const projectUpdates: ProjectUpdate[] = [
  {
    slug: "crown-bot-proxy-removal",
    projectSlug: "crown-bot",
    projectName: "Crown Bot",
    title: "Proxy Removal Complete — Bot Now Runs Without VLESS",
    description: "Removed all proxy enforcement from the bot. Browser, controller, and dashboard all work without proxy. CSPRNG anti-detection still active.",
    date: "2026-06-28",
    accent: "gold",
  },
  {
    slug: "memory-forge-694-nodes",
    projectSlug: "memory-forge",
    projectName: "Memory Forge",
    title: "Live Graph Reaches 694 Nodes with Sub-100ms Recall",
    description: "The semantic memory graph now has 694 nodes with vector embeddings. Recall times averaging under 100ms with sentence-transformer sidecar.",
    date: "2026-06-25",
    accent: "purple",
  },
  {
    slug: "kcai-desktop-v2",
    projectSlug: "dotnet-app",
    projectName: "KCAI Desktop",
    title: "KCAI Desktop v2.0.0 Released — MCP + Swarm Coordination",
    description: "Major release adds MCP protocol support for tool use, swarm coordination across machines, and 4 cloud provider integrations alongside local LLM.",
    date: "2026-06-20",
    accent: "cyan",
  },
  {
    slug: "ai-business-15-agents",
    projectSlug: "ai-business",
    projectName: "AI Business Platform",
    title: "Platform Now Orchestrating 15+ Agents Across 6 Departments",
    description: "Multi-agent dispatch with parallel execution, real-time WebSocket log streaming, and plugin architecture fully operational.",
    date: "2026-06-15",
    accent: "gold",
  },
];

export function getAllUpdates(): { type: "post" | "update"; data: BlogPost | ProjectUpdate }[] {
  const posts = getAllPosts().map((p) => ({ type: "post" as const, data: p as BlogPost | ProjectUpdate }));
  const updates = projectUpdates.map((u) => ({ type: "update" as const, data: u as BlogPost | ProjectUpdate }));

  return [...posts, ...updates].sort((a, b) => {
    const dateA = (a.data as BlogPost).date || (a.data as ProjectUpdate).date;
    const dateB = (b.data as BlogPost).date || (b.data as ProjectUpdate).date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

import fs from "fs";
import path from "path";
import { getSupabase } from "./supabase";

export type PostTier = "featured" | "standard" | "archived";

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
  tier?: PostTier;
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

// ─── JSON fallback readers ──────────────────────────────────────────────────

function getAllPostsFromJson(): BlogPost[] {
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

function getPostFromJson(slug: string): BlogPost | undefined {
  const filePath = path.join(POSTS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return undefined;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return undefined;
  }
}

// ─── Supabase row → BlogPost mapper ────────────────────────────────────────

interface SupabasePostRow {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  is_ai_generated: boolean;
  date: string;
  read_time: string;
  accent: string;
  content: any[];
  published: boolean;
}

interface SupabaseUpdateRow {
  slug: string;
  project_slug: string;
  project_name: string;
  title: string;
  description: string;
  date: string;
  accent: string;
}

function mapRowToPost(row: SupabasePostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    tags: row.tags || [],
    author: row.author,
    isAiGenerated: row.is_ai_generated,
    date: row.date,
    readTime: row.read_time,
    accent: row.accent as "gold" | "cyan" | "purple",
    content: Array.isArray(row.content) ? row.content : [],
  };
}

function mapRowToUpdate(row: SupabaseUpdateRow): ProjectUpdate {
  return {
    slug: row.slug,
    projectSlug: row.project_slug,
    projectName: row.project_name,
    title: row.title,
    description: row.description,
    date: row.date,
    accent: row.accent as "gold" | "cyan" | "purple",
  };
}

// ─── Public API (Supabase first, JSON fallback) ─────────────────────────────

export async function getAllPosts(): Promise<BlogPost[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r) => mapRowToPost(r as SupabasePostRow));
      }
    } catch (e) {
      console.error("Supabase getAllPosts error, falling back to JSON:", e);
    }
  }
  return getAllPostsFromJson();
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!error && data) {
        return mapRowToPost(data as SupabasePostRow);
      }
    } catch (e) {
      console.error("Supabase getPost error, falling back to JSON:", e);
    }
  }
  return getPostFromJson(slug);
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export async function getCategories(): Promise<{ name: string; count: number; accent: "gold" | "cyan" | "purple" }[]> {
  const posts = await getAllPosts();
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

// ─── Static project updates (fallback when Supabase unavailable) ────────────

export const projectUpdates: ProjectUpdate[] = [
  {
    slug: "memory-forge-v5-tiers",
    projectSlug: "memory-forge",
    projectName: "Memory Forge",
    title: "v5.0.0 — 6-Tier Cognitive Memory System + 115-Test Stress Suite",
    description: "Added working/episodic/semantic tiers alongside STM/LTM/training. LTM sub-levels 1/2/3 with auto-promotion by recall count. Ebbinghaus forgetting curve, contradiction detection, procedural memory, compression, feedback loop, cross-session continuity. 115 assertions all passing.",
    date: "2026-06-28",
    accent: "purple",
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

export async function getProjectUpdates(): Promise<ProjectUpdate[]> {
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("project_updates")
        .select("*")
        .order("date", { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((r) => mapRowToUpdate(r as SupabaseUpdateRow));
      }
    } catch (e) {
      console.error("Supabase getProjectUpdates error, falling back to static:", e);
    }
  }
  return projectUpdates;
}

export async function getPostsByTier(tier: PostTier): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => (p.tier || "standard") === tier);
}

export async function getAllUpdates(): Promise<{ type: "post" | "update"; data: BlogPost | ProjectUpdate }[]> {
  const tierWeight: Record<PostTier, number> = { featured: 0, standard: 1, archived: 2 };
  const posts = (await getAllPosts())
    .filter((p) => (p.tier || "standard") !== "archived")
    .map((p) => ({ type: "post" as const, data: p as BlogPost | ProjectUpdate }));
  const updates = (await getProjectUpdates()).map((u) => ({ type: "update" as const, data: u as BlogPost | ProjectUpdate }));

  return [...posts, ...updates].sort((a, b) => {
    const tierA = (a.type === "post" ? (a.data as BlogPost).tier || "standard" : "standard") as PostTier;
    const tierB = (b.type === "post" ? (b.data as BlogPost).tier || "standard" : "standard") as PostTier;
    if (tierWeight[tierA] !== tierWeight[tierB]) {
      return tierWeight[tierA] - tierWeight[tierB];
    }
    const dateA = (a.data as BlogPost).date || (a.data as ProjectUpdate).date;
    const dateB = (b.data as BlogPost).date || (b.data as ProjectUpdate).date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

// ─── Write helpers (used by API routes) ─────────────────────────────────────

export async function upsertPost(post: BlogPost): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("blog_posts")
    .upsert({
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      tags: post.tags,
      author: post.author,
      is_ai_generated: post.isAiGenerated,
      date: post.date,
      read_time: post.readTime,
      accent: post.accent,
      content: post.content,
      published: true,
    }, { onConflict: "slug" });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deletePost(slug: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: "Supabase not configured" };

  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("slug", slug);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

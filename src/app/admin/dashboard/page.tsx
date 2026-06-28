"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NeuralGraph } from "./neural-graph";

interface Post {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  isAiGenerated: boolean;
  accent?: string;
}

type Tab = "content" | "neural" | "webchat";

const WEBCHAT_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8198"
    : "https://webchat-forge.vercel.app";

export default function AdminDashboard() {
  const [token, setToken] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genResult, setGenResult] = useState<string>("");
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("cms_token");
    if (!t) {
      router.push("/admin");
      return;
    }
    setToken(t);
    loadPosts(t);
  }, [router]);

  const loadPosts = async (t: string) => {
    try {
      const res = await fetch("/api/posts", { headers: { Authorization: `Bearer ${t}` } });
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
      } else if (res.status === 401) {
        router.push("/admin");
      }
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const [error, setError] = useState("");

  const generatePost = async () => {
    setGenerating(true);
    setGenResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (res.ok && data.post) {
        // Commit to GitHub
        const commitRes = await fetch("/api/commit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ slug: data.post.slug, content: data.post }),
        });
        const commitData = await commitRes.json();
        if (commitRes.ok) {
          setGenResult("Generated and committed: " + data.post.title);
          loadPosts(token);
        } else {
          setGenResult("Generated but commit failed: " + (commitData.error || "unknown"));
        }
      } else {
        setGenResult(data.message || data.error || "Generation failed");
      }
    } catch (e: any) {
      setGenResult("Error: " + e.message);
    } finally {
      setGenerating(false);
    }
  };

  const deletePost = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, content: {}, action: "delete" }),
      });
      if (res.ok) {
        loadPosts(token);
      }
    } catch {}
  };

  const logout = () => {
    localStorage.removeItem("cms_token");
    router.push("/admin");
  };

  if (loading) {
    return <div className="page-in max-w-4xl mx-auto px-6 py-12 text-[var(--text-dim)]">Loading...</div>;
  }

  return (
    <div className="page-in max-w-7xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="chip chip-gold mb-3">CMS Dashboard</div>
          <h1 className="font-display font-800 text-3xl gradient-gold">Content Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 p-1 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "content"
                  ? "bg-[var(--gold)] text-[#1a1006]"
                  : "text-[var(--text-dim)] hover:text-[var(--text-bright)]"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveTab("neural")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "neural"
                  ? "bg-[var(--cyan)] text-[#08080c]"
                  : "text-[var(--text-dim)] hover:text-[var(--text-bright)]"
              }`}
            >
              Neural Graph
            </button>
            <button
              onClick={() => setActiveTab("webchat")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === "webchat"
                  ? "bg-[var(--cyan)] text-[#08080c]"
                  : "text-[var(--text-dim)] hover:text-[var(--text-bright)]"
              }`}
            >
              WebChat
            </button>
          </div>
          <button onClick={logout} className="btn-chip text-sm text-[var(--text-dim)] hover:text-[var(--red)] transition-colors">
            Logout
          </button>
        </div>
      </div>

      {activeTab === "neural" ? (
        <NeuralGraph />
      ) : activeTab === "webchat" ? (
        <div className="glass p-2" style={{ height: "calc(100vh - 200px)" }}>
          <iframe
            src={WEBCHAT_URL}
            className="w-full h-full rounded-xl border-0"
            title="WebChat-Forge"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      ) : (
        <>
          {/* AI Generation Panel */}
          <div className="glass p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-700 text-lg text-[var(--text-bright)]">AI Content Generation</h2>
              <span className="chip chip-purple">OpenAI GPT-4o</span>
            </div>
            <p className="text-sm text-[var(--text-dim)] mb-4">
              Generate a new blog post using AI. The post will be committed to GitHub and deployed automatically.
            </p>
            <button
              onClick={generatePost}
              disabled={generating}
              className="px-5 py-2.5 bg-[var(--purple)] text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {generating ? "Generating..." : "Generate New Post"}
            </button>
            {genResult && (
              <p className="mt-3 text-sm text-[var(--cyan)] font-mono">{genResult}</p>
            )}
          </div>

          {/* Posts List */}
          <div className="glass p-6">
            <h2 className="font-display font-700 text-lg text-[var(--text-bright)] mb-4">
              Blog Posts ({posts.length})
            </h2>

            {posts.length === 0 ? (
              <p className="text-[var(--text-dim)] text-sm">No posts yet. Generate one above or create manually.</p>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <div key={post.slug} className="flex items-center justify-between p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-bright)] transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`chip chip-${post.accent || "cyan"}`}>{post.category}</span>
                        {post.isAiGenerated && <span className="chip chip-purple">AI</span>}
                        <span className="text-xs text-[var(--text-dim)] font-mono">{post.date}</span>
                      </div>
                      <h3 className="font-medium text-[var(--text-bright)] truncate">{post.title}</h3>
                      <p className="text-sm text-[var(--text-dim)] truncate">{post.description}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => deletePost(post.slug)}
                        className="px-3 py-1.5 text-xs border border-[var(--border)] rounded-lg hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manual Post Creator */}
          <div className="glass p-6 mt-8">
            <h2 className="font-display font-700 text-lg text-[var(--text-bright)] mb-4">Create Post Manually</h2>
            <ManualPostEditor token={token} onCreated={() => loadPosts(token)} />
          </div>
        </>
      )}
    </div>
  );
}

function ManualPostEditor({ token, onCreated }: { token: string; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech");
  const [jsonContent, setJsonContent] = useState('[\n  { "body": "Introduction paragraph here." },\n  { "heading": "Section 1", "body": "Section content.", "list": ["point 1", "point 2"] }\n]');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState("");

  const handleCreate = async () => {
    setSaving(true);
    setResult("");
    try {
      let content;
      try {
        content = JSON.parse(jsonContent);
      } catch {
        setResult("Invalid JSON content");
        setSaving(false);
        return;
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
      const post = {
        slug,
        title,
        description,
        category,
        tags: [],
        author: "Kevin",
        isAiGenerated: false,
        date: new Date().toISOString().slice(0, 10),
        readTime: "5 min",
        accent: category === "AI" ? "cyan" : category === "Sweepstakes" ? "gold" : "purple",
        content,
      };

      const res = await fetch("/api/commit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, content: post }),
      });

      const data = await res.json();
      if (res.ok) {
        setResult("Post created: " + slug);
        setTitle("");
        setDescription("");
        onCreated();
      } else {
        setResult("Error: " + (data.error || "unknown"));
      }
    } catch (e: any) {
      setResult("Error: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          className="px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] text-sm focus:outline-none focus:border-[var(--gold)]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] text-sm focus:outline-none focus:border-[var(--gold)]"
        >
          <option>AI</option>
          <option>Sweepstakes</option>
          <option>Tech</option>
          <option>General</option>
        </select>
      </div>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="One-line description"
        className="w-full px-4 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] text-sm focus:outline-none focus:border-[var(--gold)]"
      />
      <textarea
        value={jsonContent}
        onChange={(e) => setJsonContent(e.target.value)}
        rows={10}
        className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[var(--text)] font-mono text-xs focus:outline-none focus:border-[var(--gold)]"
        placeholder="Content JSON array"
      />
      <button
        onClick={handleCreate}
        disabled={saving || !title || !description}
        className="px-5 py-2.5 bg-[var(--gold)] text-[#1a1006] font-semibold rounded-xl hover:bg-[var(--gold-bright)] transition-colors disabled:opacity-40"
      >
        {saving ? "Creating..." : "Create & Commit"}
      </button>
      {result && <p className="text-sm text-[var(--cyan)] font-mono">{result}</p>}
    </div>
  );
}

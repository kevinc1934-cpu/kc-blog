import Link from "next/link";
import { getAllUpdates, type BlogPost, type ProjectUpdate } from "@/lib/posts";

export const revalidate = 300;

export default async function Home() {
  const feed = await getAllUpdates();

  return (
    <div className="page-in max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12 pb-8 border-b border-[var(--border)]">
        <div className="chip chip-gold mb-4">Personal Blog</div>
        <h1 className="font-display font-800 text-4xl mb-3">
          <span className="gradient-dual">Building at the edge</span>
          <br />
          <span className="text-[var(--text-bright)]">of AI & automation</span>
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-xl">
          AI projects, model breakdowns, sweepstakes casino strategy, and technical deep dives —
          updated daily by AI.
        </p>
      </div>

      {/* Blog Feed */}
      <div className="blog-feed">
        {feed.map((item, i) => {
          if (item.type === "post") {
            return <PostEntry key={`post-${(item.data as BlogPost).slug}`} post={item.data as BlogPost} />;
          } else {
            return <UpdateEntry key={`update-${(item.data as ProjectUpdate).slug}`} update={item.data as ProjectUpdate} />;
          }
        })}
      </div>

      {feed.length === 0 && (
        <div className="text-center py-20 text-[var(--text-dim)]">
          <p className="text-lg">No posts yet. Check back soon — AI generates new content daily.</p>
        </div>
      )}
    </div>
  );
}

function PostEntry({ post }: { post: BlogPost }) {
  const tier = post.tier || "standard";
  return (
    <Link href={`/blog/${post.slug}`} className="blog-entry block group">
      <div className="blog-entry-meta">
        <span className={`chip chip-${post.accent}`}>{post.category}</span>
        {tier === "featured" && (
          <><span>·</span><span className="text-[var(--gold-bright)] font-bold">{"\u2605"} Featured</span></>
        )}
        {tier === "archived" && (
          <><span>·</span><span className="text-[var(--text-dim)]">Archived</span></>
        )}
        <span>·</span>
        <span>{formatDate(post.date)}</span>
        <span>·</span>
        <span>{post.readTime}</span>
        {post.isAiGenerated && <><span>·</span><span className="text-[var(--purple)]">AI-generated</span></>}
      </div>
      <h2 className="blog-entry-title">{post.title}</h2>
      <p className="blog-entry-desc">{post.description}</p>
      <div className="blog-entry-footer">
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="chip chip-neutral">{tag}</span>
        ))}
      </div>
    </Link>
  );
}

function UpdateEntry({ update }: { update: ProjectUpdate }) {
  return (
    <div className="blog-entry">
      <div className="blog-entry-meta">
        <span className={`chip chip-${update.accent}`}>Project Update</span>
        <span>·</span>
        <span>{update.projectName}</span>
        <span>·</span>
        <span>{formatDate(update.date)}</span>
      </div>
      <h2 className="blog-entry-title">{update.title}</h2>
      <p className="blog-entry-desc">{update.description}</p>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

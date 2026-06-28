import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Verify CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "kc-blog-cron-2026";
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Step 1: Generate AI content
  const genRes = await fetch(new URL("/api/generate", request.url), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ force: true }),
  });

  if (!genRes.ok) {
    const err = await genRes.text();
    return NextResponse.json({ error: "Generation failed: " + err }, { status: 500 });
  }

  const genData = await genRes.json();
  if (!genData.post) {
    return NextResponse.json({ message: genData.message || "No post generated" });
  }

  // Step 2: Commit to GitHub
  const cmsToken = process.env.CMS_ADMIN_TOKEN || "K3v1n2585";
  const commitRes = await fetch(new URL("/api/commit", request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cmsToken}`,
    },
    body: JSON.stringify({
      slug: genData.post.slug,
      content: genData.post,
    }),
  });

  if (!commitRes.ok) {
    const err = await commitRes.text();
    return NextResponse.json({ error: "Commit failed: " + err, status: 500 } as any);
  }

  const commitData = await commitRes.json();
  return NextResponse.json({
    success: true,
    post: genData.post.title,
    slug: genData.post.slug,
    topic: genData.topic,
    commit: commitData,
  });
}

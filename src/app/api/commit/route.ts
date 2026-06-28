import { NextRequest, NextResponse } from "next/server";
import { checkAuth, unauthorized } from "@/lib/auth";

const GITHUB_REPO = "kevinc1934-cpu/kc-blog";
const GITHUB_BRANCH = "master";

async function getGithubToken(): Promise<string | null> {
  // Try env first
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  // Try reading from gh CLI auth
  try {
    const { execSync } = require("child_process");
    const token = execSync("gh auth token", { encoding: "utf-8" }).trim();
    return token || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  if (!checkAuth(request)) return unauthorized();

  const { slug, content, action } = await request.json();

  if (!slug || !content) {
    return NextResponse.json({ error: "Missing slug or content" }, { status: 400 });
  }

  const token = await getGithubToken();
  if (!token) {
    return NextResponse.json({ error: "No GitHub token available" }, { status: 500 });
  }

  const filePath = `src/data/posts/${slug}.json`;
  const jsonContent = JSON.stringify(content, null, 2);

  if (action === "delete") {
    return deleteFile(token, filePath);
  }

  return createOrUpdateFile(token, filePath, jsonContent, slug);
}

async function createOrUpdateFile(token: string, filePath: string, content: string, slug: string) {
  // Check if file exists (get SHA)
  let sha: string | undefined;
  try {
    const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    if (checkRes.ok) {
      const checkData = await checkRes.json();
      sha = checkData.sha;
    }
  } catch {}

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
    body: JSON.stringify({
      message: sha ? `Update post: ${slug}` : `Add post: ${slug}`,
      content: Buffer.from(content).toString("base64"),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `GitHub API error: ${err}` }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json({ success: true, url: data.content?.html_url, sha: data.content?.sha });
}

async function deleteFile(token: string, filePath: string) {
  // Get SHA first
  const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
  });

  if (!checkRes.ok) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const checkData = await checkRes.json();
  const sha = checkData.sha;

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json", "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `Delete post: ${filePath}`,
      sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to delete" }, { status: res.status });
  }

  return NextResponse.json({ success: true });
}

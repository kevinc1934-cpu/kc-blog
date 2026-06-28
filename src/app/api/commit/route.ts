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

  // Trigger Vercel redeploy from latest Git commit
  await triggerRedeploy();

  return NextResponse.json({ success: true, url: data.content?.html_url, sha: data.content?.sha });
}

async function triggerRedeploy() {
  try {
    const vercelToken = process.env.VERCEL_API_TOKEN;
    if (!vercelToken) return;
    const projectId = process.env.VERCEL_PROJECT_ID;
    if (!projectId) return;

    // Get the latest Git commit SHA
    const gitRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits/${GITHUB_BRANCH}`, {
      headers: { Authorization: `Bearer ${await getGithubToken()}`, Accept: "application/vnd.github.v3+json" },
    });
    if (!gitRes.ok) return;
    const gitData = await gitRes.json();
    const sha = gitData.sha;

    // Create a new deployment from the Git commit
    await fetch(`https://api.vercel.com/v13/deployments?projectId=${projectId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${vercelToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        gitSource: { type: "github", repo: GITHUB_REPO, ref: GITHUB_BRANCH, sha },
        target: "production",
      }),
    });
  } catch {}
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

  await triggerRedeploy();
  return NextResponse.json({ success: true });
}

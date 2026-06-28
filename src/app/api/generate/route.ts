import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

const KC_AI_ENV = "D:\\kc-ai\\ai-business\\platform\\.env";

function readEnvKey(key: string): string | null {
  try {
    const fs = require("fs");
    const content = fs.readFileSync(KC_AI_ENV, "utf-8");
    const line = content.split("\n").find((l: string) => l.startsWith(key + "="));
    return line ? line.replace(key + "=", "").trim() : null;
  } catch {
    return null;
  }
}

const TOPICS = [
  { category: "AI", accent: "cyan", prompt: "Compare two frontier AI models with real-world benchmarks and cost analysis" },
  { category: "Sweepstakes", accent: "gold", prompt: "Sweepstakes casino strategy for daily bonus optimization and VIP grinding" },
  { category: "Tech", accent: "purple", prompt: "Local LLM deployment with llama.cpp, quantization, and performance tips" },
  { category: "AI", accent: "cyan", prompt: "Analyze a specific AI model version history and capabilities" },
  { category: "Tech", accent: "purple", prompt: "Building AI automation systems with CSPRNG anti-detection" },
  { category: "Sweepstakes", accent: "gold", prompt: "Multi-account bankroll management across sweepstakes platforms" },
  { category: "AI", accent: "cyan", prompt: "Multi-agent orchestration architecture and implementation" },
];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const force = body.force === true;
  const topicIndex = body.topicIndex;

  if (!force) {
    const today = new Date().toISOString().slice(0, 10);
    const existing = (await getAllPosts()).filter((p) => p.date === today && p.isAiGenerated);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Already generated today", date: today });
    }
  }

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const topic = TOPICS[topicIndex !== undefined ? topicIndex % TOPICS.length : dayOfYear % TOPICS.length];

  const apiKey = process.env.OPENROUTER_API_KEY || readEnvKey("OPENROUTER_API_KEY");
  const apiUrl = "https://openrouter.ai/api/v1/chat/completions";
  const model = "openai/gpt-4o-mini";
  if (!apiKey) {
    return NextResponse.json({ error: "No OpenRouter API key" }, { status: 500 });
  }

  const sysPrompt = buildSystemPrompt(topic.category, topic.accent);
  const userPrompt = topic.prompt + ". Return valid JSON only, no markdown fences.";

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + apiKey, "HTTP-Referer": "https://kc.kevcspot.com" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sysPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: "AI error: " + err }, { status: 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No content from AI" }, { status: 500 });
    }

    const parsed = JSON.parse(content);
    const slug = slugify(parsed.title);
    const post = {
      slug,
      title: parsed.title,
      description: parsed.description,
      category: parsed.category || topic.category,
      tags: parsed.tags || [],
      author: "AI",
      isAiGenerated: true,
      date: new Date().toISOString().slice(0, 10),
      readTime: parsed.readTime || "5 min",
      accent: (parsed.accent || topic.accent) as "gold" | "cyan" | "purple",
      content: parsed.content || [],
    };

    return NextResponse.json({ post, topic: topic.prompt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function buildSystemPrompt(category: string, accent: string): string {
  return [
    "You are a technical blog writer for kc.kevcspot.com.",
    "Kevin is an AI engineer, sweepstakes casino strategist, and local LLM enthusiast.",
    "Write in a direct, technical, no-nonsense style with specific numbers and code examples.",
    "",
    "Return a JSON object with this exact structure:",
    "{",
    '  "title": "Engaging title max 70 chars",',
    '  "description": "One-line description max 150 chars",',
    '  "category": "' + category + '",',
    '  "tags": ["tag1", "tag2", "tag3"],',
    '  "readTime": "X min",',
    '  "accent": "' + accent + '",',
    '  "content": [',
    '    { "body": "Introduction paragraph" },',
    '    { "heading": "Section", "body": "Text", "list": ["point 1", "point 2"] },',
    '    { "heading": "Code section", "body": "Text", "code": { "language": "typescript", "code": "const x = 1;" } },',
    '    { "callout": { "type": "tip", "text": "A tip" } }',
    "  ]",
    "}",
    "",
    "Rules:",
    "- Content array should have 5-8 sections",
    "- Use realistic specific data and numbers",
    "- Include at least one code example or table",
    "- Include at least one callout (tip, warning, or info)",
    "- Be practical and hands-on",
  ].join("\n");
}

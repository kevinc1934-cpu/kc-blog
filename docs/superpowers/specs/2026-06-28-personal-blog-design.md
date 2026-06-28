# kc.kevcspot.com — Personal Blog Design

## Overview
Personal blog for Kevin — AI engineer, sweepstakes casino strategist, local LLM enthusiast.
Deployed on Vercel, domain kc.kevcspot.com, Cloudflare DNS.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS for styling
- MDX for content authoring
- Static generation for SEO
- Deployed to Vercel

## Visual Direction: "Neon Noir"
- Deep charcoal #0a0a0f background with radial gradients
- Gold/amber (#fbbf24) + electric cyan (#22d3ee) dual-accent palette
- Glassmorphism cards with border glow on hover
- Fonts: Space Grotesk (headlines), Inter (body), JetBrains Mono (code)
- Smooth page transitions, animated gradient accents

## Site Structure (Hierarchy)
```
kc.kevcspot.com
├── /                    Home — hero + featured content
├── /about               About Me
├── /ai                  AI Section (landing)
│   ├── /ai/projects
│   │   ├── /ai/projects/ai-business      AI Business Platform
│   │   ├── /ai/projects/dotnet-app       KCAI Desktop (.NET 8 WPF)
│   │   └── /ai/projects/memory-forge     Memory Forge
│   └── /ai/models
│       ├── /ai/models/[model-slug]       Per-model pages (version breakdowns + highlights)
│       │   ├── /ai/models/glm-5.1
│       │   ├── /ai/models/claude-4
│       │   ├── /ai/models/gpt-5
│       │   ├── /ai/models/gemini-2.5
│       │   └── /ai/models/deepseek-v4
│       └── (model index with comparison table)
├── /tutorials           Tutorials Section
│   ├── /tutorials/sweepstakes             Sweepstakes Casinos
│   │   ├── getting-started
│   │   ├── daily-bonus-strategy
│   │   └── vip-tiers-explained
│   └── /tutorials/[other]                 Random stuff
│       ├── local-llm-deployment
│       └── csprng-anti-detection
└── /blog               General posts (future)
```

## Content (Prefilled)
- AI Projects: Real descriptions from D:\kc-ai project dirs
- AI Models: Per-model pages with versions, context windows, benchmarks, highlights
- Sweepstakes Tutorials: Getting started, daily bonus, VIP tiers, bankroll management
- About Me: Kevin's background and interests

## Deployment
1. Build Next.js project at E:\kevin-blog
2. git init → push to GitHub (kevinc1934-cpu/kc-blog)
3. Deploy via Vercel API token
4. Configure kc.kevcspot.com CNAME via Cloudflare DNS

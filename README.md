<div align="center">

# 🌐 Blog-Forge

### Personal Blog — AI Projects, Model Breakdowns, Tutorials

**kc.kevcspot.com · Next.js 16 · Tailwind v4 · MDX · AI-powered CMS · 3D Neural Memory Graph**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Pages](#-pages)
- [CMS Dashboard](#-cms-dashboard)
- [3D Neural Memory Graph](#-3d-neural-memory-graph)
- [AI Content Generation](#-ai-content-generation)
- [Deployment](#-deployment)
- [Credits](#-credits)
- [License](#-license)

---

## 🔭 Overview

Blog-Forge is the personal blog for the Forge ecosystem, deployed at [kc.kevcspot.com](https://kc.kevcspot.com). It features a blog-style feed with post tiering, an AI-powered CMS dashboard with daily auto-generated posts, a 3D neural memory graph visualization using Three.js, and project detail pages with scroll-spy navigation.

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.9 | React framework (app router) |
| **React** | 19 | UI library |
| **Tailwind CSS** | v4 | Styling |
| **TypeScript** | — | Type safety |
| **Three.js** | 0.185.0 | 3D neural graph |
| **@react-three/fiber** | 9.6.1 | React renderer for Three.js |
| **@react-three/drei** | 10.7.7 | Three.js helpers |
| **Supabase** | — | Database + Realtime |

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📰 **Blog Feed** | Blog-style feed showing posts + project updates, sorted by tier then date |
| ⭐ **Post Tiering** | `featured` (★ badge) · `standard` · `archived` (excluded from feed) |
| 📁 **Foldertab Navbar** | Rounded foldertab styling with underglow (Blog · About · AI · Tutorials · CMS) |
| 📖 **Project Detail Pages** | Left navigation with IntersectionObserver scroll-spy |
| 🧠 **3D Neural Memory Graph** | Three.js + R3F — 6 brain regions, neurons by type, synapse animations |
| 🤖 **AI CMS** | Login + dashboard with post management + AI generation |
| 📅 **Daily AI Posts** | Cron endpoint (`0 9 * * *`) generates blog posts via OpenRouter |
| ☁️ **Supabase Backend** | `blog_posts` + `project_updates` tables with RLS |
| 🎨 **Neon Noir Design** | Dark `#08080c`, gold `#e0a82e` + cyan `#19e4d4`, glassmorphism |

---

## 📄 Pages

| Path | Description |
|------|-------------|
| `/` | Blog feed (posts + updates sorted by tier → date) |
| `/about` | About page |
| `/ai` | AI projects showcase |
| `/tutorials` | Tutorial listing |
| `/cms` | CMS admin panel (login required) |
| `/blog/[slug]` | Dynamic blog post rendering |
| `/projects/[id]` | Project detail with scroll-spy sidebar |

---

## 🎛️ CMS Dashboard

| Tab | Description |
|-----|-------------|
| **Content** | Post list, manual editor, AI generation |
| **Neural Graph** | 3D brain visualization with recall query activation |

**Auth**: CMS admin token · **Cron**: `vercel.json` `0 9 * * *`

---

## 🧠 3D Neural Memory Graph

The CMS dashboard includes an interactive 3D neural memory graph that models an actual brain:

| Region | Memory Type | Node Shape |
|--------|------------|------------|
| Prefrontal Cortex | Working Memory | Spheres |
| Hippocampus | Episodic Memory | Octahedrons |
| Temporal Lobe | Semantic Memory | Tetrahedrons |
| Cerebellum | Procedural | Spheres (small) |
| Neocortex | Long-Term (LTM) | Octahedrons (w/ sub-level rings) |
| Training Hub | Training Data | Tetrahedrons (dense) |

Features: synapse pulse animations, dormant node dimming, star field, OrbitControls, recall query triggers pathway activation, detail panel, stats panel, legend.

**Snapshot**: 1419 nodes committed from [Brain-Forge](https://github.com/kevinc1934-cpu/Brain-Forge) graph data.

---

## 🤖 AI Content Generation

- **Model**: `openai/gpt-4o-mini` via OpenRouter
- **Trigger**: Daily cron at 9 AM (`vercel.json`)
- **Publishing**: GitHub Contents API → Vercel auto-redeploy
- **Fallback**: JSON files in `src/data/posts/` when Supabase unavailable

---

## 🚀 Deployment

| Platform | Detail |
|----------|--------|
| **Vercel** | Production at `https://kevin-blog-rho.vercel.app` + `https://kc.kevcspot.com` |
| **GitHub** | `kevinc1934-cpu/Blog-Forge` (branch: master) |
| **DNS** | `kc.kevcspot.com` CNAME → `cname.vercel-dns.com` |
| **Supabase** | ref `zflheqcvwihlogxjzofs` — `blog_posts` + `project_updates` tables |

---

## 🙏 Credits

- [Brain-Forge](https://github.com/kevinc1934-cpu/Brain-Forge) — Memory graph snapshot data
- Three.js + React Three Fiber — 3D visualization
- Supabase — Database backend
- Vercel — Hosting + deployment
- OpenRouter — AI content generation

---

## 📄 License

MIT

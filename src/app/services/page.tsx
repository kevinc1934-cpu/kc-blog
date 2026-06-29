import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Development Services & Pricing | KC-AI Ventures",
  description: "Custom AI development services at 50-80% below market rates. AI chatbots, SaaS apps, automation workflows, LLM integration. Transparent pricing with market comparison.",
  openGraph: {
    title: "AI Development Services & Pricing | KC-AI Ventures",
    description: "Custom AI development at 50-80% below market. Chatbots, SaaS, automation, LLM integration.",
  },
};

const services = [
  {
    name: "AI Chatbot Development",
    icon: "💬",
    accent: "cyan",
    description: "Custom AI chatbots with persistent memory, voice, vision, and multi-provider LLM fallback. Deployed on your infrastructure with zero per-message cost.",
    kcPrice: "$500 – $5,000",
    marketPrice: "$1,500 – $15,000",
    savings: "67%",
    deliverables: ["Custom chatbot UI with your branding", "Persistent memory graph (Brain-Forge)", "Voice + vision capabilities", "Multi-LLM fallback (Vultr, Gemini, local)", "MCP tool integration", "Deployment + 30-day support"],
    timeline: "1-3 weeks",
  },
  {
    name: "Custom SaaS / Micro-SaaS",
    icon: "🚀",
    accent: "gold",
    description: "Full-stack SaaS applications built on Vercel + Supabase + free-tier LLMs. Zero infrastructure cost, scalable from day one.",
    kcPrice: "$1,000 – $10,000",
    marketPrice: "$3,000 – $25,000",
    savings: "60%",
    deliverables: ["Full SaaS app (frontend + backend + DB)", "Auth, billing (Stripe), user management", "AI-powered features (chat, search, analytics)", "Admin dashboard", "API + documentation", "Deployment + 60-day support"],
    timeline: "2-6 weeks",
  },
  {
    name: "AI Automation Workflows",
    icon: "⚡",
    accent: "purple",
    description: "End-to-end automation pipelines: content generation, data processing, social media scheduling, email sequences. Runs on cron, zero ongoing cost.",
    kcPrice: "$300 – $3,000",
    marketPrice: "$800 – $8,000",
    savings: "63%",
    deliverables: ["Workflow design + architecture", "Implementation (cron + agents)", "Content generation pipeline", "Multi-platform posting (Twitter, IG, LinkedIn)", "Email sequence automation", "Monitoring dashboard"],
    timeline: "1-2 weeks",
  },
  {
    name: "LLM Integration & Fine-tuning",
    icon: "🧠",
    accent: "cyan",
    description: "Integrate any LLM into your existing systems. Multi-provider routing, fallback chains, prompt engineering, and fine-tuning on your data.",
    kcPrice: "$500 – $5,000",
    marketPrice: "$1,500 – $12,000",
    savings: "58%",
    deliverables: ["Multi-provider LLM router (8+ backends)", "Prompt engineering + optimization", "RAG pipeline with your data", "Fine-tuning on custom datasets", "Cost optimization (free-tier routing)", "Monitoring + logging"],
    timeline: "1-3 weeks",
  },
  {
    name: "Full-Stack AI Applications",
    icon: "🏗️",
    accent: "gold",
    description: "Complete AI-powered applications from concept to deployment. Web, mobile, desktop — with AI at the core.",
    kcPrice: "$2,000 – $15,000",
    marketPrice: "$5,000 – $50,000",
    savings: "70%",
    deliverables: ["Full application (web + mobile + API)", "AI features (chat, vision, search, analytics)", "Database + auth + billing", "CI/CD pipeline", "Documentation + handoff", "90-day support + maintenance"],
    timeline: "4-12 weeks",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "$300",
    period: "/project",
    accent: "cyan",
    tagline: "For small businesses getting started with AI",
    features: ["Single AI chatbot or automation", "1 LLM provider integration", "Basic memory (context retention)", "Email support (48hr response)", "1 revision round", "30-day post-launch support"],
    best: false,
  },
  {
    name: "Professional",
    price: "$2,500",
    period: "/project",
    accent: "gold",
    tagline: "For growing teams that need real AI infrastructure",
    features: ["Full SaaS app or complex automation", "Multi-provider LLM routing (8+ backends)", "Brain-Forge memory graph integration", "Voice + vision capabilities", "Priority support (24hr response)", "3 revision rounds", "60-day post-launch support"],
    best: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    accent: "purple",
    tagline: "For organizations scaling AI across departments",
    features: ["Multiple AI applications + integrations", "Custom model fine-tuning", "On-premise deployment option", "Dedicated agent swarm (31+ agents)", "SLA + 4hr response time", "Unlimited revisions", "Ongoing maintenance contract"],
    best: false,
  },
];

const marketComparison = [
  { service: "AI Chatbot", fiverr: "$100-$1,500", upwork: "$500-$5,000", toptal: "$2,000-$15,000", kcai: "$500-$5,000", advantage: "Enterprise features at Fiverr prices" },
  { service: "SaaS App", fiverr: "$150-$5,000", upwork: "$1,000-$10,000", toptal: "$3,000-$25,000", kcai: "$1,000-$10,000", advantage: "Zero infra cost (free-tier stack)" },
  { service: "Automation", fiverr: "$100-$1,000", upwork: "$300-$3,000", toptal: "$800-$8,000", kcai: "$300-$3,000", advantage: "Persistent memory + multi-agent" },
  { service: "LLM Integration", fiverr: "$200-$2,000", upwork: "$500-$5,000", toptal: "$1,500-$12,000", kcai: "$500-$5,000", advantage: "8 free LLM providers, $0 marginal cost" },
  { service: "Full-Stack AI", fiverr: "$500-$5,000", upwork: "$2,000-$15,000", toptal: "$5,000-$50,000", kcai: "$2,000-$15,000", advantage: "Memory graph + agent swarm included" },
];

const llmPricing = [
  { provider: "OpenAI GPT-5", input: "$15/M tokens", output: "$75/M tokens", note: "Most expensive, best reasoning" },
  { provider: "Anthropic Claude 4", input: "$3/M tokens", output: "$15/M tokens", note: "Long context, coding focus" },
  { provider: "Google Gemini 2.0", input: "$0.10/M tokens", output: "$0.40/M tokens", note: "Cheapest paid option" },
  { provider: "Together.ai", input: "$0.20/M tokens", output: "$0.80/M tokens", note: "Open models at scale" },
  { provider: "Vultr GPU Inference", input: "$0.12/M tokens", output: "$0.12/M tokens", note: "KC-AI primary backend" },
  { provider: "KC-AI (free-tier routing)", input: "$0.00", output: "$0.00", note: "8 free providers, auto-fallback" },
];

export default function ServicesPage() {
  return (
    <div className="page-in main-wrapper">
      {/* Hero */}
      <div className="text-center mb-16 pb-8 border-b border-[var(--border)]">
        <div className="chip chip-gold mb-4">AI Development Services</div>
        <h1 className="font-display font-800 text-4xl md:text-5xl mb-4">
          <span className="gradient-gold">Custom AI at half the cost</span>
        </h1>
        <p className="text-[var(--text-dim)] text-lg max-w-2xl mx-auto">
          We build AI chatbots, SaaS apps, automation workflows, and full-stack AI systems
          using 8 free LLM providers. You get enterprise-grade AI at freelancer prices —
          with persistent memory, agent swarms, and zero per-message cost.
        </p>
        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <a href="#pricing" className="btn-gold px-6 py-3 rounded-xl font-medium text-sm">
            View Pricing
          </a>
          <a href="#comparison" className="btn-chip px-6 py-3 rounded-xl font-medium text-sm">
            Market Comparison
          </a>
          <a href="mailto:crosskevin490@gmail.com" className="btn-chip px-6 py-3 rounded-xl font-medium text-sm">
            Get a Quote
          </a>
        </div>
      </div>

      {/* Services */}
      <div className="mb-16">
        <h2 className="font-display font-700 text-2xl mb-2 text-[var(--text-bright)]">What We Build</h2>
        <p className="text-[var(--text-dim)] text-sm mb-8">Each project includes deployment, documentation, and support.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s) => (
            <div key={s.name} className="glass p-6 rounded-2xl hover:border-[var(--border-bright)] transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-2xl mb-1 block">{s.icon}</span>
                  <h3 className="font-display font-700 text-lg text-[var(--text-bright)]">{s.name}</h3>
                </div>
                <span className={`chip chip-${s.accent} text-xs`}>{s.timeline}</span>
              </div>
              <p className="text-[var(--text-dim)] text-sm mb-4">{s.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <div>
                  <span className="text-2xl font-display font-800 text-[var(--text-bright)]">{s.kcPrice}</span>
                </div>
                <div className="text-xs">
                  <span className="text-[var(--text-dim)] line-through">{s.marketPrice}</span>
                  <span className="chip chip-green text-[10px] ml-1">{s.savings} below market</span>
                </div>
              </div>
              <div className="space-y-1.5">
                {s.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <span className="text-[var(--cyan)] flex-shrink-0">→</span>
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div id="pricing" className="mb-16">
        <h2 className="font-display font-700 text-2xl mb-2 text-[var(--text-bright)]">Pricing Tiers</h2>
        <p className="text-[var(--text-dim)] text-sm mb-8">Transparent, upfront pricing. No hidden fees, no per-message costs.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tiers.map((t) => (
            <div key={t.name} className={`glass p-6 rounded-2xl ${t.best ? "border-2 border-[var(--gold)]" : ""}`}>
              {t.best && (
                <div className="chip chip-gold text-xs mb-3">Most Popular</div>
              )}
              <h3 className="font-display font-700 text-lg text-[var(--text-bright)] mb-1">{t.name}</h3>
              <p className="text-[var(--text-dim)] text-xs mb-3">{t.tagline}</p>
              <div className="mb-4">
                <span className={`text-3xl font-display font-800 ${t.accent === "gold" ? "gradient-gold" : `text-[var(--${t.accent})`}`}>{t.price}</span>
                <span className="text-[var(--text-dim)] text-sm">{t.period}</span>
              </div>
              <div className="space-y-2">
                {t.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-[var(--text)]">
                    <span className="text-[var(--green)] flex-shrink-0">✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Comparison */}
      <div id="comparison" className="mb-16">
        <h2 className="font-display font-700 text-2xl mb-2 text-[var(--text-bright)]">KC-AI vs Market Average</h2>
        <p className="text-[var(--text-dim)] text-sm mb-8">Real prices from Fiverr, Upwork, and Toptal (June 2026 research).</p>
        <div className="glass p-4 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Service</th>
                <th className="text-center py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Fiverr</th>
                <th className="text-center py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Upwork</th>
                <th className="text-center py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Toptal</th>
                <th className="text-center py-3 px-2 text-[var(--gold)] font-mono text-xs uppercase">KC-AI</th>
                <th className="text-left py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Our Advantage</th>
              </tr>
            </thead>
            <tbody>
              {marketComparison.map((row, i) => (
                <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--surface)] transition-colors">
                  <td className="py-3 px-2 text-[var(--text-bright)] font-medium">{row.service}</td>
                  <td className="py-3 px-2 text-center text-[var(--text-dim)]">{row.fiverr}</td>
                  <td className="py-3 px-2 text-center text-[var(--text-dim)]">{row.upwork}</td>
                  <td className="py-3 px-2 text-center text-[var(--text-dim)]">{row.toptal}</td>
                  <td className="py-3 px-2 text-center text-[var(--gold)] font-bold">{row.kcai}</td>
                  <td className="py-3 px-2 text-[var(--cyan)] text-xs">{row.advantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LLM Cost Comparison */}
      <div className="mb-16">
        <h2 className="font-display font-700 text-2xl mb-2 text-[var(--text-bright)]">Why We Cost Less: LLM Pricing</h2>
        <p className="text-[var(--text-dim)] text-sm mb-8">We route across 8 free LLM providers automatically. Your app runs at $0 marginal cost.</p>
        <div className="glass p-4 rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Provider</th>
                <th className="text-center py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Input</th>
                <th className="text-center py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Output</th>
                <th className="text-left py-3 px-2 text-[var(--text-dim)] font-mono text-xs uppercase">Notes</th>
              </tr>
            </thead>
            <tbody>
              {llmPricing.map((row, i) => (
                <tr key={i} className={`border-b border-[var(--border)] ${row.provider.includes("KC-AI") ? "bg-[rgba(224,168,46,0.05)]" : ""}`}>
                  <td className="py-3 px-2 text-[var(--text-bright)] font-medium">{row.provider}</td>
                  <td className="py-3 px-2 text-center text-[var(--text-dim)]">{row.input}</td>
                  <td className="py-3 px-2 text-center text-[var(--text-dim)]">{row.output}</td>
                  <td className="py-3 px-2 text-[var(--cyan)] text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="glass p-8 rounded-2xl text-center mb-8">
        <h2 className="font-display font-700 text-2xl mb-3 text-[var(--text-bright)]">Ready to build with AI?</h2>
        <p className="text-[var(--text-dim)] text-sm mb-6 max-w-lg mx-auto">
          Get a free consultation and quote. We&apos;ll assess your needs and recommend the most cost-effective AI solution.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="mailto:crosskevin490@gmail.com" className="btn-gold px-6 py-3 rounded-xl font-medium text-sm">
            Get a Free Quote
          </a>
          <Link href="/ai/projects" className="btn-chip px-6 py-3 rounded-xl font-medium text-sm">
            View Our Projects
          </Link>
          <Link href="/webchat" className="btn-chip px-6 py-3 rounded-xl font-medium text-sm">
            Try Our AI Chat
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="font-display font-700 text-2xl mb-6 text-[var(--text-bright)]">FAQ</h2>
        <div className="space-y-3">
          {[
            { q: "How do you charge 50-70% less than competitors?", a: "We use 8 free LLM providers (NVIDIA, Gemini, Groq, Cerebras, SambaNova, OpenRouter, Cloudflare AI, Ollama) with automatic fallback. Our marginal cost per message is $0, so we pass the savings to you. We also use Vercel + Supabase free tiers for hosting." },
            { q: "Do you use OpenAI or Claude?", a: "We can integrate any provider including OpenAI and Anthropic, but our default stack uses free-tier providers. If you need GPT-5 or Claude 4, we add those as premium backends with cost pass-through." },
            { q: "What is the memory graph?", a: "Brain-Forge is our cognitive memory platform — it gives AI agents persistent memory across conversations. Unlike standard chatbots that forget everything, ours remember context, learn preferences, and improve over time. It has 1,400+ nodes and 7,400+ relations." },
            { q: "What is the agent swarm?", a: "We run 31 specialized AI agents (CEO, CTO, Marketing, Sales, Finance, Research, Content, SEO, etc.) that work autonomously on business tasks. This swarm can be deployed to work on your project 24/7." },
            { q: "Do you offer ongoing support?", a: "Yes — Starter includes 30 days, Professional includes 60 days, and Enterprise includes ongoing maintenance contracts. We also offer monthly retainer packages for continuous AI improvement." },
            { q: "Can you work with my existing codebase?", a: "Absolutely. We integrate with existing systems, databases, and APIs. Our code review agent analyzes your codebase before we start, ensuring compatibility." },
          ].map((faq, i) => (
            <details key={i} className="glass p-4 rounded-xl group">
              <summary className="cursor-pointer text-[var(--text-bright)] font-medium text-sm flex items-center justify-between">
                {faq.q}
                <span className="text-[var(--text-dim)] group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <p className="text-[var(--text-dim)] text-sm mt-3 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

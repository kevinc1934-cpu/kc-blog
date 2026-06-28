export const metadata = { title: "About — KC // kevcspot" };

export default function AboutPage() {
  return (
    <div className="page-in max-w-4xl mx-auto px-6 py-32">
      <div className="chip chip-gold mb-6">About Me</div>
      <h1 className="font-display font-800 text-4xl md:text-5xl mb-8 gradient-gold">Kevin</h1>

      <div className="content-prose space-y-6">
        <p className="text-lg text-[var(--text)] leading-relaxed">
          I'm an AI engineer building at the intersection of multi-agent systems, local LLM
          deployment, and real-world automation. I work on everything from low-level inference
          optimization to full-stack platforms with real-time dashboards.
        </p>

        <div className="divider-gold" />

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">What I Build</h2>
        <ul className="space-y-3">
          <li className="text-[var(--text)] leading-relaxed pl-0">
            <span className="text-[var(--gold)]">▸</span> <strong className="text-white">Business-Forge</strong> — A multi-agent orchestration
            system with 15+ agents across 6 departments, real-time monitoring, and plugin architecture
          </li>
          <li className="text-[var(--text)] leading-relaxed pl-0">
            <span className="text-[var(--cyan)]">▸</span> <strong className="text-white">Chat-Forge</strong> — A .NET 8 WPF AI assistant with
            local LLM inference (llama.cpp), 4 cloud providers, and MCP tool use
          </li>
          <li className="text-[var(--text)] leading-relaxed pl-0">
            <span className="text-[var(--purple)]">▸</span> <strong className="text-white">Brain-Forge</strong> — A cognitive memory
            platform with 6-tier system, live persistence, and sub-100ms recall
          </li>
          <li className="text-[var(--text)] leading-relaxed pl-0">
            <span className="text-[var(--cyan)]">▸</span> <strong className="text-white">WebChat-Forge</strong> — Web chat with dual LLM
            backends, knowledge hub, and confidence scoring
          </li>
          <li className="text-[var(--text)] leading-relaxed pl-0">
            <span className="text-[var(--gold)]">▸</span> <strong className="text-white">Android-Forge</strong> — Termux thin client with
            Vulkan ARM LoRA training on Snapdragon GPUs
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Technical Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            "TypeScript / Node.js", "C# / .NET 8 / WPF", "Python",
            "Next.js / React", "Playwright Automation", "llama.cpp / Local LLMs",
            "MCP Protocol", "SQLite / PostgreSQL", "Docker / Deployment",
            "CSPRNG / Anti-Detection", "Graph Databases", "Semantic Search",
          ].map((skill) => (
            <div key={skill} className="glass px-4 py-3 text-sm text-[var(--text)]">
              {skill}
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Philosophy</h2>
        <p className="text-[var(--text)] leading-relaxed">
          I believe in building things that work. No vaporware, no hype-driven architecture.
          Every project I ship solves a real problem I face — from managing 20+ sweepstakes casino
          accounts to running frontier LLMs on local hardware. If it doesn't work in production,
          it doesn't ship.
        </p>

        <blockquote className="border-l-2 border-[var(--gold)] pl-6 my-8 italic text-[var(--text-dim)]">
          "The best automation is indistinguishable from human behavior. The best AI is local,
          private, and under your control."
        </blockquote>

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Current Focus</h2>
        <ul className="space-y-3">
          <li className="text-[var(--text)] leading-relaxed">
            <strong className="text-white">Multi-agent orchestration</strong> — Building systems where
            specialized AI agents collaborate on complex tasks
          </li>
          <li className="text-[var(--text)] leading-relaxed">
            <strong className="text-white">CSPRNG anti-detection</strong> — Making browser automation
            statistically invisible using cryptographically secure randomness with human-matched distributions
          </li>
          <li className="text-[var(--text)] leading-relaxed">
            <strong className="text-white">Sweepstakes casino optimization</strong> — Maximizing free
            play value through daily bonus automation, VIP grinding, and multi-account management
          </li>
          <li className="text-[var(--text)] leading-relaxed">
            <strong className="text-white">Local-first AI</strong> — Running frontier models on
            consumer hardware with llama.cpp, optimized quantization, and MCP integration
          </li>
        </ul>

        <div className="divider-cyan mt-12" />

        <h2 className="text-2xl font-bold text-white mt-12 mb-4">Connect</h2>
        <p className="text-[var(--text)] leading-relaxed">
          You can find my projects and writing right here on this site. Check out the
          AI section for project breakdowns and model analysis, or the tutorials section
          for practical guides on sweepstakes casinos and technical deep dives.
        </p>
      </div>
    </div>
  );
}

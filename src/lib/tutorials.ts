export interface Tutorial {
  slug: string;
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  accent: "gold" | "cyan" | "purple";
  content: TutorialSection[];
}

export interface TutorialSection {
  heading?: string;
  body?: string;
  list?: string[];
  code?: { language: string; code: string };
  callout?: { type: "info" | "warning" | "tip"; text: string };
  table?: { headers: string[]; rows: string[][] };
}

export const tutorialCategories: { slug: string; name: string; description: string; accent: "gold" | "cyan" | "purple" }[] = [
  {
    slug: "sweepstakes",
    name: "Sweepstakes Casinos",
    description: "Strategies, tips, and guides for sweepstakes casino platforms",
    accent: "gold",
  },
  {
    slug: "tech",
    name: "Tech & Random Stuff",
    description: "Local LLM deployment, anti-detection techniques, and other technical deep dives",
    accent: "cyan",
  },
];

export const tutorials: Tutorial[] = [
  {
    slug: "getting-started",
    category: "Sweepstakes Casinos",
    categorySlug: "sweepstakes",
    title: "Getting Started with Sweepstakes Casinos",
    description: "Everything you need to know to start playing at sweepstakes casinos — how they work, the dual-currency system, and how to maximize your free play.",
    date: "2026-06-15",
    readTime: "8 min",
    accent: "gold",
    content: [
      {
        body: "Sweepstakes casinos are a unique category of online gaming that operates under sweepstakes law rather than traditional gambling regulations. They're available in most US states where real-money online casinos are not yet legal. The key innovation is the **dual-currency system** that separates gameplay from prize redemption.",
      },
      {
        heading: "How the Dual-Currency System Works",
        body: "Sweepstakes casinos use two types of virtual currency. Understanding the relationship between them is the foundation of everything else.",
        table: {
          headers: ["Currency", "Purpose", "How You Get It", "Can Redeem?"],
          rows: [
            ["Gold Coins (GC)", "Gameplay only — no real value", "Daily bonuses, purchases, promotions", "No"],
            ["Sweepstakes Coins (SC)", "Gameplay with prize redemption potential", "Free with GC purchases, mail-in requests", "Yes — for cash prizes"],
          ],
        },
      },
      {
        heading: "Key Principle: SC is the Prize Currency",
        body: "The entire sweepstakes model hinges on this: Gold Coins are for fun, Sweepstakes Coins are for potential real prizes. You should always prioritize accumulating SC over GC. Every platform gives you free SC daily — never skip that claim.",
        callout: { type: "tip", text: "Most platforms give 1-5 free SC per day through daily login bonuses. At minimum wage conversion rates, that's real money you're leaving on the table by not claiming." },
      },
      {
        heading: "Choosing a Platform",
        body: "Not all sweepstakes casinos are created equal. Here's what to look for when choosing where to play:",
        list: [
          "**Daily SC bonus amount** — Higher daily SC = more free play potential",
          "**Wagering requirements** — Lower playthrough before SC redemption is better",
          "**Game RTP** — Look for platforms with high-RTP slots (96%+)",
          "**VIP program** — Meaningful tiers with real perks, not just cosmetic badges",
          "**Redemption speed** — How fast do they process cash prize redemptions",
          "**Minimum redemption** — Lower minimums mean you can cash out sooner",
        ],
      },
      {
        heading: "The Daily Routine",
        body: "Consistency is the most important factor in sweepstakes casino success. Here's the optimal daily routine:",
        list: [
          "Log in and claim your daily bonus (GC + SC) — every single day",
          "Check for promotional offers (often time-limited SC giveaways)",
          "Play through your SC on high-RTP games to build wagering progress",
          "Monitor your VIP tier progress and adjust play accordingly",
          "Track your cumulative SC balance toward redemption minimum",
        ],
      },
      {
        callout: { type: "info", text: "The daily bonus claim is the single highest-value action in sweepstakes casinos. Over a year, daily SC claims alone can add up to hundreds of dollars in potential prize value." },
      },
      {
        heading: "Common Mistakes to Avoid",
        list: [
          "Skipping daily claims — the streak bonus multiplies your daily SC",
          "Playing GC when you have unplayed SC — always play SC first",
          "Chasing losses with purchased coin packages — stick to free play",
          "Ignoring wagering requirements — you must play through SC before redeeming",
          "Redeeming too early — sometimes waiting for a larger redemption is more efficient",
        ],
      },
      {
        body: "Now that you understand the fundamentals, check out the daily bonus strategy and VIP tiers guides to take your sweepstakes game to the next level.",
      },
    ],
  },
  {
    slug: "daily-bonus-strategy",
    category: "Sweepstakes Casinos",
    categorySlug: "sweepstakes",
    title: "Daily Bonus Optimization Strategy",
    description: "How to maximize your daily bonus claims, maintain streaks, and use automation to never miss a day. Includes a complete strategy framework.",
    date: "2026-06-20",
    readTime: "10 min",
    accent: "gold",
    content: [
      {
        body: "The daily bonus is the lifeblood of sweepstakes casino play. It's the primary source of free Sweepstakes Coins, and the streak multipliers make consistency exponentially valuable. This guide covers the complete optimization strategy.",
      },
      {
        heading: "Understanding Streak Mechanics",
        body: "Most sweepstakes casinos reward consecutive daily logins with increasing bonuses. The streak system is designed to keep you coming back — and it works in your favor if you understand the math.",
        table: {
          headers: ["Day", "Base SC", "Streak Multiplier", "Total SC"],
          rows: [
            ["1-6", "1 SC", "1x", "1 SC"],
            ["7", "1 SC", "2x (weekly bonus)", "2 SC"],
            ["8-13", "1 SC", "1x", "1 SC"],
            ["14", "1 SC", "3x (bi-weekly bonus)", "3 SC"],
            ["30", "1 SC", "5x (monthly bonus)", "5 SC"],
          ],
        },
      },
      {
        callout: { type: "warning", text: "Missing a single day resets your streak to zero. The compounding value of streaks means a missed day costs you not just today's bonus, but all future multiplier bonuses until you rebuild." },
      },
      {
        heading: "The Optimal Claim Window",
        body: "Most platforms allow you to claim your daily bonus within a 24-hour window from your last claim. The optimal strategy is to claim at the same time every day to maximize the window buffer.",
        list: [
          "Pick a consistent time — ideally when you're always awake and available",
          "Claim within the first hour of your window to build maximum buffer",
          "The buffer absorbs unexpected delays (travel, illness, emergencies)",
          "If you're about to miss a day, claim from your phone — it takes 30 seconds",
        ],
      },
      {
        heading: "Multi-Account Strategy",
        body: "Many serious players maintain multiple accounts across different platforms. This multiplies your daily SC intake and diversifies your redemption options.",
        list: [
          "Spread across 5-10 platforms for maximum coverage",
          "Different platforms have different daily bonus amounts — prioritize higher ones",
          "Track each account's streak separately",
          "Use a password manager to handle the credential load",
          "Consider time zone differences for claim scheduling",
        ],
      },
      {
        heading: "Automation: Never Miss a Day",
        body: "For those managing many accounts, manual daily claims become impractical. This is where automation comes in. Using CSPRNG-based automation with human-like behavior avoids detection while claiming daily bonuses across accounts.",
        code: { language: "typescript", code: "// CSPRNG-based human delay — undetectable\nconst delay = humanDelayRng(800, 3500);\n// 70% triangular (fast), 25% gaussian (normal), 5% exponential (long pause)\nawait sleep(delay);\nawait claimDailyBonus();" },
      },
      {
        heading: "Weekly Bonus Maximization",
        body: "Weekly and bi-weekly bonuses are the highest-value claims. Here's how to maximize them:",
        list: [
          "Never miss a day in the week leading up to a bonus day",
          "If you might miss a day, claim early and reset your schedule",
          "Some platforms offer bonus SC on specific days — align your schedule",
          "Track your streak count to predict when bonus days fall",
        ],
      },
      {
        heading: "Tracking and Analytics",
        body: "Serious players track their daily claims, SC accumulation, and redemption history. A simple spreadsheet or a custom dashboard can track:",
        list: [
          "Daily claim time and SC received per account",
          "Streak count and next bonus day prediction",
          "Cumulative SC balance and progress to redemption minimum",
          "VIP tier progress and coinback earned",
          "Redemption history and processing times",
        ],
      },
      {
        callout: { type: "tip", text: "Over a year, optimizing daily bonuses across 10 accounts with proper streak management can accumulate 3,000+ SC in potential prize value — entirely from free play." },
      },
    ],
  },
  {
    slug: "vip-tiers-explained",
    category: "Sweepstakes Casinos",
    categorySlug: "sweepstakes",
    title: "VIP Tiers Explained: Maximizing Coinback and Rewards",
    description: "A complete breakdown of VIP tier systems, coinback rates, and how to efficiently grind through tiers using automated autoplay.",
    date: "2026-06-25",
    readTime: "12 min",
    accent: "gold",
    content: [
      {
        body: "VIP programs in sweepstakes casinos offer tiered rewards based on your wagering volume. The key benefit is **coinback** — a percentage of your Gold Coin wagers returned as Sweepstakes Coins. Understanding and optimizing VIP tiers can significantly boost your SC earnings.",
      },
      {
        heading: "How VIP Tiers Work",
        body: "Each platform has its own tier system, but most follow a similar structure. You earn VIP points by wagering Gold Coins, and points determine your tier. Higher tiers mean better coinback rates and perks.",
        table: {
          headers: ["Tier", "Points Required", "Coinback Rate", "Monthly Reset"],
          rows: [
            ["Entry", "0", "0%", "—"],
            ["Bronze", "500", "1%", "Yes"],
            ["Silver", "2,000", "2.5%", "Yes"],
            ["Gold", "5,000", "5%", "Yes"],
            ["Platinum", "15,000", "8%", "Yes"],
            ["Diamond", "50,000", "12%", "Yes"],
          ],
        },
      },
      {
        heading: "The Coinback Calculation",
        body: "Coinback is the real value of VIP tiers. Here's how to calculate it:",
        code: { language: "typescript", code: "// Example: Bronze tier, 1% coinback\n// Wager 10,000 GC on a 96% RTP slot\nconst wagered = 10000;\nconst coinbackRate = 0.01; // 1% Bronze\nconst coinbackSC = wagered * coinbackRate; // 100 SC equivalent\n\n// But you also need to factor in RTP losses:\nconst rtpLoss = wagered * (1 - 0.96); // 400 GC lost\n// Net: you lose 400 GC but gain 100 SC worth of coinback" },
      },
      {
        callout: { type: "info", text: "At Bronze tier (1% coinback), you need to wager 100 GC to earn 1 SC equivalent in coinback. At Diamond tier (12%), you only need to wager ~8.3 GC per SC. Higher tiers are dramatically more efficient." },
      },
      {
        heading: "Tier Grinding Strategy",
        body: "The challenge is reaching higher tiers efficiently. Since VIP points are earned by wagering GC, and GC is free, the optimal strategy is to maximize GC wagering volume. This is where autoplay comes in.",
        list: [
          "Use autoplay on high-RTP games to wager GC continuously",
          "Set autoplay to run during off-hours (maximizing daily wager volume)",
          "Focus on games with 96%+ RTP to minimize GC loss rate",
          "Target the minimum points needed for each tier — don't overshoot",
          "Monitor monthly reset date — grind hardest in the final week",
        ],
      },
      {
        heading: "Choosing the Right Games",
        body: "Not all games are equal for VIP grinding. The ideal game has high RTP, fast spin speed, and low volatility.",
        table: {
          headers: ["Game Type", "Typical RTP", "Spin Speed", "Volatility", "Grind Rating"],
          rows: [
            ["High RTP Slots", "96-98%", "Fast (1-2s)", "Low-Med", "★★★★★"],
            ["Standard Slots", "94-96%", "Fast", "Medium", "★★★★☆"],
            ["Table Games", "97-99%", "Slow", "Low", "★★★☆☆"],
            ["Live Dealer", "96-98%", "Very Slow", "Low", "★★☆☆☆"],
          ],
        },
      },
      {
        heading: "Automated Autoplay with CSPRNG",
        body: "The automation project includes an autoplay module that uses CSPRNG (cryptographically secure random number generator) for human-like timing. This prevents detection while grinding VIP points around the clock.",
        code: { language: "typescript", code: "// CSPRNG timing distributions for undetectable autoplay\n// 70% triangular (fast spins), 25% gaussian (normal), 5% exponential (long breaks)\nconst pause = spinPauseRng(spinCount, {\n  pauseMin: 3,\n  pauseMax: 10,\n  breakEvery: 60,  // randomized ±20\n  breakMin: 15,\n  breakMax: 30,\n});" },
      },
      {
        heading: "Monthly Reset Planning",
        body: "VIP tiers reset monthly on most platforms. Your strategy should account for this cycle:",
        list: [
          "Week 1-2: Grind to reach your target tier",
          "Week 3: Maintain tier with moderate play",
          "Week 4: Maximize coinback by high-volume grinding at your achieved tier",
          "After reset: Start the cycle again",
        ],
      },
      {
        callout: { type: "tip", text: "The most efficient strategy is to reach your target tier as fast as possible at the start of the month, then spend the rest of the month grinding coinback at that tier's rate." },
      },
      {
        heading: "Perks Beyond Coinback",
        list: [
          "Faster redemption processing at higher tiers",
          "Exclusive game access (some platforms lock games behind tiers)",
          "Bonus daily SC for VIP members",
          "Dedicated account managers (Diamond tier)",
          "Exclusive promotional offers with better conversion rates",
        ],
      },
    ],
  },
  {
    slug: "local-llm-deployment",
    category: "Tech & Random Stuff",
    categorySlug: "tech",
    title: "Local LLM Deployment: Running Frontier Models on Your Own Hardware",
    description: "A practical guide to deploying local LLMs with llama.cpp, including hardware requirements, quantization, and performance optimization.",
    date: "2026-06-10",
    readTime: "15 min",
    accent: "cyan",
    content: [
      {
        body: "Running large language models locally gives you privacy, no API costs, and full control over inference. This guide covers everything from hardware requirements to production deployment using llama.cpp.",
      },
      {
        heading: "Why Local LLMs?",
        list: [
          "Privacy — your data never leaves your machine",
          "No API costs — run unlimited inference for the cost of electricity",
          "Full control — customize quantization, context length, and sampling",
          "Offline capability — works without internet",
          "Fine-tuning — adapt models to your specific domain",
        ],
      },
      {
        heading: "Hardware Requirements",
        table: {
          headers: ["Model Size", "Min VRAM (Q4)", "Recommended VRAM", "RAM", "Example Models"],
          rows: [
            ["7-8B", "6 GB", "8 GB", "16 GB", "Llama 3.1 8B, Qwen 2.5 7B"],
            ["13-14B", "10 GB", "16 GB", "32 GB", "Llama 3.1 13B, Qwen 2.5 14B"],
            ["32-34B", "20 GB", "24 GB", "64 GB", "Qwen 2.5 32B, DeepSeek Coder V2 Lite"],
            ["70B+", "40 GB", "48+ GB", "128 GB", "Llama 3.1 70B, DeepSeek V3 (MoE)"],
          ],
        },
      },
      {
        heading: "Building llama.cpp",
        body: "llama.cpp is the most efficient CPU/GPU inference engine for GGUF models. Here's how to build it with CUDA support:",
        code: { language: "bash", code: "# Clone and build with CUDA support\ngit clone https://github.com/ggerganov/llama.cpp\ncd llama.cpp\nmkdir build && cd build\ncmake .. -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=89  # 89 = RTX 4090\ncmake --build . --config Release -j\n\n# The server binary enables OpenAI-compatible API:\n./bin/llama-server -m model.gguf --port 8080 --n-gpu-layers 99" },
      },
      {
        heading: "Choosing the Right Quantization",
        body: "Quantization reduces model size with minimal quality loss. The sweet spot depends on your VRAM:",
        table: {
          headers: ["Quant", "Bits", "Size (70B)", "Quality Loss", "Recommended For"],
          rows: [
            ["Q8_0", "8-bit", "~70 GB", "Negligible", "Best quality, lots of VRAM"],
            ["Q6_K", "6-bit", "~55 GB", "Minimal", "High quality, good VRAM"],
            ["Q5_K_M", "5-bit", "~48 GB", "Very small", "Best balance (recommended)"],
            ["Q4_K_M", "4-bit", "~40 GB", "Small", "Limited VRAM"],
            ["Q3_K_M", "3-bit", "~32 GB", "Noticeable", "Very limited VRAM"],
          ],
        },
        callout: { type: "tip", text: "Q5_K_M is the sweet spot — nearly indistinguishable from FP16 quality while using 40% less VRAM. Always prefer K-quants over legacy quants." },
      },
      {
        heading: "Performance Optimization",
        list: [
          "Use `--n-gpu-layers 99` to offload all layers to GPU",
          "Set `--ctx-size` to match your needs — larger context = more VRAM",
          "Use `--flash-attn` for faster attention computation",
          "Enable `--mlock` to prevent swapping (if you have enough RAM)",
          "Use `--cont-batching` for continuous batching in server mode",
          "Experiment with `--threads` for CPU-bound inference",
        ],
      },
      {
        heading: "OpenAI-Compatible API",
        body: "llama.cpp's server mode provides an OpenAI-compatible API, so you can use it with any client that supports OpenAI:",
        code: { language: "bash", code: "# Start the server\ncurl http://localhost:8080/v1/chat/completions \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n    \"model\": \"local\",\n    \"messages\": [{\"role\": \"user\", \"content\": \"Hello!\"}],\n    \"temperature\": 0.7\n  }'" },
      },
      {
        heading: "Multi-Model Setup",
        body: "For a production setup, run multiple models on different ports and use a router to direct requests:",
        list: [
          "Small model (7B) on port 8081 for fast, simple tasks",
          "Medium model (32B) on port 8082 for balanced tasks",
          "Large model (70B) on port 8083 for complex reasoning",
          "Use a reverse proxy to route based on task complexity",
        ],
      },
      {
        callout: { type: "info", text: "The KCAI Desktop app (see AI Projects section) integrates directly with llama.cpp for local inference while also supporting cloud providers as fallback." },
      },
    ],
  },
  {
    slug: "csprng-anti-detection",
    category: "Tech & Random Stuff",
    categorySlug: "tech",
    title: "CSPRNG Anti-Detection: Making Automated Browser Actions Undetectable",
    description: "How to use cryptographically secure random number generators with human-like distributions to make browser automation invisible to anti-bot systems.",
    date: "2026-06-18",
    readTime: "12 min",
    accent: "cyan",
    content: [
      {
        body: "Anti-bot detection systems analyze behavioral patterns to distinguish humans from automation. The most common tell is timing — Math.random()-based delays create detectable patterns. This guide covers how CSPRNG with human-matched distributions defeats these systems.",
      },
      {
        heading: "Why Math.random() Gets You Caught",
        body: "JavaScript's Math.random() uses a xorshift128+ PRNG with a deterministic, predictable state. From just a few outputs, the entire sequence can be reconstructed. Anti-bot systems use this to detect automation:",
        list: [
          "Math.random() produces a deterministic sequence — predictable from outputs",
          "Uniform distribution is unnatural — humans don't act with even timing",
          "No long-tail behavior — humans have occasional very long pauses",
          "No correlation between actions — human delays correlate with task complexity",
        ],
      },
      {
        heading: "CSPRNG: Cryptographically Secure Alternative",
        body: "crypto.randomBytes() uses the OS entropy pool (CryptGenRandom on Windows, /dev/urandom on Linux). This produces truly unpredictable output that cannot be reconstructed or correlated:",
        code: { language: "typescript", code: "// CSPRNG with 4096-byte buffer for efficiency\nconst crypto = require('crypto');\nconst BUF_SIZE = 4096;\nlet buf = crypto.randomBytes(BUF_SIZE);\nlet bufOffset = 0;\n\nfunction cryptoRandom(): number {\n  if (bufOffset + 8 > BUF_SIZE) {\n    buf = crypto.randomBytes(BUF_SIZE);\n    bufOffset = 0;\n  }\n  const hi = buf.readUInt32BE(bufOffset);\n  const lo = buf.readUInt32BE(bufOffset + 4);\n  bufOffset += 8;\n  return (((hi >>> 5) * 0x4000000 + (lo >>> 6)) / 0x20000000000000);\n}" },
      },
      {
        heading: "Human-Matched Distributions",
        body: "The key insight is that humans don't act with uniform timing. Real human behavior follows specific statistical distributions. By matching these, automation becomes indistinguishable from human input.",
        table: {
          headers: ["Distribution", "Use Case", "Characteristics", "Percentage"],
          rows: [
            ["Triangular", "Fast actions (clicks, quick typing)", "Peaked at 30% of range — most actions are fast", "70%"],
            ["Gaussian (Normal)", "Normal actions (navigation, reading)", "Bell curve around midpoint", "25%"],
            ["Exponential", "Long pauses (thinking, distracted)", "Long-tail — occasional very long delays", "5%"],
          ],
        },
      },
      {
        heading: "Implementing Human Delay",
        body: "The human delay function combines all three distributions to create natural timing patterns:",
        code: { language: "typescript", code: "function humanDelayRng(min: number, max: number): number {\n  const r = cryptoRandom();\n  if (r < 0.70) {\n    // 70%: Triangular peaked at 30% of range (fast actions)\n    const mode = min + (max - min) * 0.3;\n    return clamp(triangular(min, mode, max), min, max);\n  } else if (r < 0.95) {\n    // 25%: Gaussian around midpoint\n    const mid = (min + max) / 2;\n    const std = (max - min) * 0.2;\n    return clamp(gaussian(mid, std), min, max);\n  } else {\n    // 5%: Exponential tail (long thinking pauses)\n    const rate = 1 / ((max - min) * 0.3);\n    return clamp(min + exponential(rate), min, max * 1.5);\n  }\n}" },
      },
      {
        heading: "Typing Delays: Log-Normal Distribution",
        body: "Human typing follows a log-normal distribution — most keystrokes are fast with occasional slow ones. This is the most critical distribution for detection:",
        code: { language: "typescript", code: "function typingDelay(): number {\n  // Log-normal: most keystrokes fast, occasional slow ones\n  const base = logNormal(60, 0.4); // mean=60ms, sigma=0.4\n  return Math.max(20, Math.min(200, Math.round(base)));\n}" },
      },
      {
        callout: { type: "warning", text: "Typing too fast (sub-20ms per keystroke) or too uniformly (all keystrokes within 5ms of each other) is the #1 detection signal for anti-bot systems." },
      },
      {
        heading: "Mouse Movement: Bezier Curves with Jitter",
        body: "Humans don't move the mouse in straight lines. They follow curved paths with micro-jitters. Implement this with bezier curves and gaussian jitter:",
        code: { language: "typescript", code: "async function humanMouseMove(page, targetX, targetY) {\n  const startX = cryptoInt(0, 1920);\n  const startY = cryptoInt(0, 1080);\n  const steps = cryptoInt(18, 35); // variable step count\n  \n  for (let i = 0; i <= steps; i++) {\n    const t = i / steps;\n    const easeT = t * (2 - t); // ease-out\n    const jitterX = gaussian(0, 10); // micro-jitter\n    const jitterY = gaussian(0, 10);\n    const x = startX + (targetX - startX) * easeT + jitterX;\n    const y = startY + (targetY - startY) * easeT + jitterY;\n    await page.mouse.move(x, y);\n    await wait(10 + cryptoRandom() * 20); // variable step delay\n  }\n}" },
      },
      {
        heading: "Click Position: Not Centered",
        body: "Automation tools click the exact center of elements. Humans click slightly off-center. Randomize click position within element bounds:",
        code: { language: "typescript", code: "function clickOffset(): number {\n  // Click at 30-70% of element bounds, not center\n  return 0.3 + cryptoRandom() * 0.4;\n}" },
      },
      {
        heading: "Putting It All Together",
        body: "The automation project combines all these techniques into a complete anti-detection system. The visual test page shows the CSPRNG keyboard and mouse behavior in real-time.",
        list: [
          "CSPRNG for all random values (crypto.randomBytes, 4096-byte buffer)",
          "Triangular/Gaussian/Exponential distribution mix for delays",
          "Log-normal distribution for typing delays",
          "Bezier curves with gaussian jitter for mouse movement",
          "Off-center click positions (30-70% of element bounds)",
          "Variable mouse step count (18-35 steps)",
          "Human-like scroll amounts with natural variation",
          "Occasional long breaks (exponential tail) during repetitive tasks",
        ],
      },
      {
        callout: { type: "tip", text: "The combination of CSPRNG + human-matched distributions + bezier mouse movement makes automation statistically indistinguishable from human behavior. Anti-bot systems cannot detect the difference." },
      },
    ],
  },
];

export function getTutorialsByCategory(categorySlug: string): Tutorial[] {
  return tutorials.filter((t) => t.categorySlug === categorySlug);
}

export function getTutorial(categorySlug: string, slug: string): Tutorial | undefined {
  return tutorials.find((t) => t.categorySlug === categorySlug && t.slug === slug);
}

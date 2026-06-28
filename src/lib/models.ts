export interface ModelVersion {
  version: string;
  releaseDate: string;
  contextWindow: string;
  parameters: string;
  highlights: string[];
  benchmarks?: { name: string; score: string }[];
}

export interface AIModel {
  slug: string;
  name: string;
  vendor: string;
  tagline: string;
  description: string;
  accent: "gold" | "cyan" | "purple";
  capabilities: string[];
  useCases: string[];
  versions: ModelVersion[];
  overallHighlight: string;
}

export const models: AIModel[] = [
  {
    slug: "glm-5-1",
    name: "GLM-5.1",
    vendor: "Zhipu AI / Zai-Org",
    tagline: "Frontier reasoning model with 128K context and agentic capabilities",
    description:
      "GLM-5.1 is a frontier-class language model from Zhipu AI (marketed as Zai-Org). It excels at complex reasoning, code generation, and agentic tasks with tool use. The FP8 quantized variant delivers near-equivalent performance at reduced compute cost. Known for strong instruction following and multi-step planning abilities.",
    accent: "gold",
    capabilities: [
      "Complex multi-step reasoning",
      "Code generation and debugging",
      "Agentic tool use and function calling",
      "Long-context understanding (128K tokens)",
      "Mathematical problem solving",
      "Creative writing with controlled style",
    ],
    useCases: [
      "Building AI agents with tool use",
      "Code review and refactoring",
      "Technical documentation",
      "Multi-turn conversational assistants",
      "Research and analysis tasks",
    ],
    versions: [
      {
        version: "GLM-5.1-FP8",
        releaseDate: "2026 Q2",
        contextWindow: "128K tokens",
        parameters: "~300B (FP8 quantized)",
        highlights: [
          "FP8 quantization for 2x inference speedup",
          "Near-lossless quality vs FP16 baseline",
          "Optimized for Vultr GPU instances",
          "Agentic tool use with native function calling",
        ],
        benchmarks: [
          { name: "MMLU", score: "88.4" },
          { name: "HumanEval", score: "92.1" },
          { name: "GSM8K", score: "95.3" },
          { name: "MATH", score: "78.6" },
        ],
      },
      {
        version: "GLM-5.1",
        releaseDate: "2026 Q1",
        contextWindow: "128K tokens",
        parameters: "~300B (FP16)",
        highlights: [
          "Full precision reference model",
          "Best-in-class reasoning on math benchmarks",
          "Strong zero-shot instruction following",
          "Native support for structured output (JSON)",
        ],
        benchmarks: [
          { name: "MMLU", score: "89.1" },
          { name: "HumanEval", score: "93.0" },
          { name: "GSM8K", score: "96.0" },
          { name: "MATH", score: "79.8" },
        ],
      },
      {
        version: "GLM-4.5",
        releaseDate: "2025 Q4",
        contextWindow: "64K tokens",
        parameters: "~200B",
        highlights: [
          "Previous generation with strong general capabilities",
          "Widely deployed in production",
          "Good cost-to-performance ratio",
          "Stable API with high availability",
        ],
        benchmarks: [
          { name: "MMLU", score: "84.2" },
          { name: "HumanEval", score: "87.5" },
          { name: "GSM8K", score: "91.0" },
          { name: "MATH", score: "72.1" },
        ],
      },
    ],
    overallHighlight: "Frontier reasoning with FP8 efficiency — 2x faster inference, near-lossless quality",
  },
  {
    slug: "claude-4",
    name: "Claude 4",
    vendor: "Anthropic",
    tagline: "Constitutional AI with exceptional code understanding and safety",
    description:
      "Claude 4 represents Anthropic's frontier model line, known for its constitutional AI approach, strong safety guarantees, and exceptional code understanding. The Opus variant targets complex reasoning while Sonnet balances speed and capability. Particularly strong at nuanced analysis, creative writing, and ethical reasoning.",
    accent: "purple",
    capabilities: [
      "Constitutional AI with safety alignment",
      "Exceptional code understanding and generation",
      "Nuanced ethical reasoning",
      "Long-document analysis (200K context)",
      "Creative and literary writing",
      "Structured output with XML/JSON",
    ],
    useCases: [
      "Code review with security analysis",
      "Content moderation and safety",
      "Long-document summarization",
      "Creative writing assistance",
      "Legal and compliance analysis",
    ],
    versions: [
      {
        version: "Claude 4 Opus",
        releaseDate: "2025 Q4",
        contextWindow: "200K tokens",
        parameters: "Undisclosed",
        highlights: [
          "Highest capability in the Claude 4 family",
          "Best-in-class for complex reasoning",
          "Excellent at multi-step agentic tasks",
          "Strong safety alignment with constitutional AI",
        ],
        benchmarks: [
          { name: "MMLU", score: "89.2" },
          { name: "HumanEval", score: "92.5" },
          { name: "GSM8K", score: "95.8" },
          { name: "MATH", score: "76.4" },
        ],
      },
      {
        version: "Claude 4 Sonnet",
        releaseDate: "2025 Q4",
        contextWindow: "200K tokens",
        parameters: "Undisclosed",
        highlights: [
          "Balanced speed and capability",
          "2x faster than Opus at 90% of quality",
          "Excellent for production workloads",
          "Strong tool use and function calling",
        ],
        benchmarks: [
          { name: "MMLU", score: "86.8" },
          { name: "HumanEval", score: "89.3" },
          { name: "GSM8K", score: "93.5" },
          { name: "MATH", score: "71.2" },
        ],
      },
      {
        version: "Claude 3.5 Sonnet",
        releaseDate: "2024 Q3",
        contextWindow: "200K tokens",
        parameters: "Undisclosed",
        highlights: [
          "Previous generation — still widely used",
          "Excellent cost efficiency",
          "Strong coding and analysis capabilities",
          "Mature API with broad ecosystem support",
        ],
        benchmarks: [
          { name: "MMLU", score: "82.5" },
          { name: "HumanEval", score: "86.1" },
          { name: "GSM8K", score: "90.0" },
          { name: "MATH", score: "65.3" },
        ],
      },
    ],
    overallHighlight: "Constitutional AI with 200K context — best for safety-critical and code-heavy tasks",
  },
  {
    slug: "gpt-5",
    name: "GPT-5",
    vendor: "OpenAI",
    tagline: "Unified model with adaptive reasoning depth and multimodal capabilities",
    description:
      "GPT-5 introduces OpenAI's unified model architecture that dynamically adjusts reasoning depth based on task complexity. Features native multimodal understanding (text, image, audio), improved instruction following, and enhanced tool use. The model automatically allocates more compute to harder problems, reducing the need for manual reasoning mode selection.",
    accent: "cyan",
    capabilities: [
      "Adaptive reasoning depth (auto-scaling compute)",
      "Native multimodal understanding",
      "Improved function calling and tool use",
      "Enhanced instruction following",
      "Code generation with execution feedback",
      "Structured output with strict mode",
    ],
    useCases: [
      "General-purpose AI assistance",
      "Multimodal content analysis",
      "Automated coding with iterative refinement",
      "Data analysis and visualization",
      "Content generation at scale",
    ],
    versions: [
      {
        version: "GPT-5",
        releaseDate: "2025 Q3",
        contextWindow: "256K tokens",
        parameters: "Undisclosed",
        highlights: [
          "Adaptive reasoning — auto-allocates compute to hard problems",
          "Unified model replacing separate reasoning variants",
          "Native multimodal (text + image + audio)",
          "Best-in-class instruction following",
        ],
        benchmarks: [
          { name: "MMLU", score: "90.1" },
          { name: "HumanEval", score: "94.2" },
          { name: "GSM8K", score: "97.1" },
          { name: "MATH", score: "80.3" },
        ],
      },
      {
        version: "GPT-5 mini",
        releaseDate: "2025 Q3",
        contextWindow: "128K tokens",
        parameters: "Undisclosed",
        highlights: [
          "Compact variant for cost-sensitive workloads",
          "3x cheaper than GPT-5",
          "Retains multimodal capabilities",
          "Excellent for high-volume applications",
        ],
        benchmarks: [
          { name: "MMLU", score: "84.0" },
          { name: "HumanEval", score: "88.1" },
          { name: "GSM8K", score: "93.2" },
          { name: "MATH", score: "70.5" },
        ],
      },
      {
        version: "GPT-4o",
        releaseDate: "2024 Q2",
        contextWindow: "128K tokens",
        parameters: "~200B (multimodal)",
        highlights: [
          "Previous flagship — mature and stable",
          "Excellent ecosystem support",
          "Strong multimodal capabilities",
          "Good cost-to-performance ratio",
        ],
        benchmarks: [
          { name: "MMLU", score: "83.1" },
          { name: "HumanEval", score: "85.4" },
          { name: "GSM8K", score: "90.5" },
          { name: "MATH", score: "64.2" },
        ],
      },
    ],
    overallHighlight: "Adaptive reasoning with 256K context — auto-scales compute based on task difficulty",
  },
  {
    slug: "gemini-2-5",
    name: "Gemini 2.5 Pro",
    vendor: "Google DeepMind",
    tagline: "Massive 2M token context with native multimodal and tool integration",
    description:
      "Gemini 2.5 Pro pushes the boundaries of context length with a 2 million token window — the largest of any frontier model. Features native multimodal understanding, strong code generation, and deep integration with Google's ecosystem. Particularly strong for processing large codebases, long documents, and video content.",
    accent: "cyan",
    capabilities: [
      "2 million token context window",
      "Native multimodal (text, image, audio, video)",
      "Strong code generation and analysis",
      "Google ecosystem integration",
      "Long-document and codebase understanding",
      "Function calling with parallel execution",
    ],
    useCases: [
      "Processing entire codebases",
      "Long-document analysis (books, research papers)",
      "Video understanding and transcription",
      "Multimodal content creation",
      "Enterprise knowledge base queries",
    ],
    versions: [
      {
        version: "Gemini 2.5 Pro",
        releaseDate: "2025 Q4",
        contextWindow: "2M tokens",
        parameters: "Undisclosed",
        highlights: [
          "Largest context window of any frontier model",
          "Native video understanding",
          "Strong coding benchmarks",
          "Google Workspace integration",
        ],
        benchmarks: [
          { name: "MMLU", score: "87.8" },
          { name: "HumanEval", score: "90.4" },
          { name: "GSM8K", score: "94.6" },
          { name: "MATH", score: "75.1" },
        ],
      },
      {
        version: "Gemini 2.5 Flash",
        releaseDate: "2025 Q4",
        contextWindow: "1M tokens",
        parameters: "Undisclosed",
        highlights: [
          "Optimized for speed and cost",
          "1M token context (still massive)",
          "Good multimodal capabilities",
          "Best for high-throughput applications",
        ],
        benchmarks: [
          { name: "MMLU", score: "82.3" },
          { name: "HumanEval", score: "85.8" },
          { name: "GSM8K", score: "89.5" },
          { name: "MATH", score: "66.8" },
        ],
      },
      {
        version: "Gemini 2.0 Flash",
        releaseDate: "2025 Q1",
        contextWindow: "1M tokens",
        parameters: "Undisclosed",
        highlights: [
          "Previous generation Flash model",
          "Excellent latency characteristics",
          "Good for real-time applications",
          "Multimodal with image understanding",
        ],
        benchmarks: [
          { name: "MMLU", score: "78.9" },
          { name: "HumanEval", score: "82.1" },
          { name: "GSM8K", score: "86.0" },
          { name: "MATH", score: "60.5" },
        ],
      },
    ],
    overallHighlight: "2M token context — process entire codebases, books, and videos in a single prompt",
  },
  {
    slug: "deepseek-v4",
    name: "DeepSeek V4",
    vendor: "DeepSeek",
    tagline: "Open-weights reasoning model with Mixture-of-Experts architecture",
    description:
      "DeepSeek V4 is an open-weights frontier model using a Mixture-of-Experts (MoE) architecture, activating only a fraction of parameters per token for efficient inference. Known for exceptional reasoning capabilities, strong math performance, and the ability to run locally with sufficient hardware. The open-weights approach enables fine-tuning and self-hosting.",
    accent: "purple",
    capabilities: [
      "Mixture-of-Experts for efficient inference",
      "Open-weights for self-hosting",
      "Strong mathematical reasoning",
      "Code generation and analysis",
      "Fine-tunable for domain adaptation",
      "Chain-of-thought reasoning",
    ],
    useCases: [
      "Local/self-hosted AI inference",
      "Mathematical research and proofs",
      "Code generation with privacy",
      "Domain-specific fine-tuning",
      "Cost-effective batch processing",
    ],
    versions: [
      {
        version: "DeepSeek V4",
        releaseDate: "2026 Q1",
        contextWindow: "128K tokens",
        parameters: "671B (37B active per token)",
        highlights: [
          "MoE architecture — 37B active params per token",
          "Open-weights with permissive license",
          "Best-in-class math reasoning",
          "Self-hostable on multi-GPU setups",
        ],
        benchmarks: [
          { name: "MMLU", score: "87.5" },
          { name: "HumanEval", score: "89.8" },
          { name: "GSM8K", score: "96.2" },
          { name: "MATH", score: "82.1" },
        ],
      },
      {
        version: "DeepSeek V4 Lite",
        releaseDate: "2026 Q1",
        contextWindow: "64K tokens",
        parameters: "236B (21B active per token)",
        highlights: [
          "Compact MoE for single-GPU inference",
          "Retains strong reasoning capabilities",
          "Lower VRAM requirements",
          "Good for edge deployment",
        ],
        benchmarks: [
          { name: "MMLU", score: "82.1" },
          { name: "HumanEval", score: "85.3" },
          { name: "GSM8K", score: "91.0" },
          { name: "MATH", score: "72.4" },
        ],
      },
      {
        version: "DeepSeek V3",
        releaseDate: "2025 Q4",
        contextWindow: "64K tokens",
        parameters: "671B (37B active per token)",
        highlights: [
          "Previous generation — proven in production",
          "Excellent open-weights ecosystem support",
          "Strong coding and math performance",
          "Widely fine-tuned by the community",
        ],
        benchmarks: [
          { name: "MMLU", score: "84.0" },
          { name: "HumanEval", score: "86.5" },
          { name: "GSM8K", score: "93.2" },
          { name: "MATH", score: "75.8" },
        ],
      },
    ],
    overallHighlight: "Open-weights MoE with 671B params — self-hostable frontier reasoning",
  },
];

export function getModel(slug: string): AIModel | undefined {
  return models.find((m) => m.slug === slug);
}

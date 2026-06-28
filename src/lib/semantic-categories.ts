export interface SemanticNode {
  id: string;
  label: string;
  content: string;
  tags: string[];
  entities: string[];
  tier: string;
  recallCount: number;
  baseImportance: number;
  dormant: boolean;
}

export interface SemanticSubSubCategory {
  id: string;
  name: string;
  count: number;
  nodes: SemanticNode[];
}

export interface SemanticSubCategory {
  id: string;
  name: string;
  count: number;
  nodes: SemanticNode[];
  subSubCategories: SemanticSubSubCategory[];
}

export interface SemanticCluster {
  id: string;
  name: string;
  count: number;
  nodeIds: string[];
  subCategories: SemanticSubCategory[];
}

interface KeywordRule {
  name: string;
  patterns: RegExp[];
}

const LLM_SUBCATEGORIES: KeywordRule[] = [
  { name: "Attention", patterns: [/attention|self-attention|cross-modal|dot-product|causal|multi-head|sliding|dilated|linear attention|random feature/i] },
  { name: "Quantization", patterns: [/quantiz|\bbit\b|precision|mixed precision|fp16|bf16|int8|compress|qat|calibrate/i] },
  { name: "Distributed Training", patterns: [/distributed|ddp|pipeline|parallel|split model|shard|world_size|rank|gpu operation/i] },
  { name: "Tokenization", patterns: [/tokeniz|tokenizer|vocab|embed|token\b|encode/i] },
  { name: "Generation", patterns: [/forward pass|generate|decode|autoregressive|sampling|greedy|beam|response:|format input/i] },
  { name: "Optimization", patterns: [/gradient|backward|autograd|differentiat|optim|loss|sgd|adam|learning rate|schedule|clipping/i] },
  { name: "Monitoring & Eval", patterns: [/monitor|safety|metric|evaluat|logging|profiler|trace|perplexity|bleu|rouge/i] },
  { name: "Inference & Serving", patterns: [/inference|serving|batch process|global inference|celery|redis|load balanc|queue|worker/i] },
  { name: "Layers & Architecture", patterns: [/projection|linear layer|feed-forward|ffn|residual|layer norm|reshape|moe\b|ffn\b/i] },
  { name: "Memory Management", patterns: [/memory|kv cache|cache|memory statistics|memory pool/i] },
  { name: "Masking", patterns: [/mask|padding|causal mask|combined mask/i] },
  { name: "Fine-tuning & LoRA", patterns: [/lora|fine-tun|adapter|peft|replace with lora|get original embed/i] },
  { name: "RLHF & PPO", patterns: [/ppo\b|rlhf|reward model|reinforcement|stage 2|stage 3|eos token/i] },
  { name: "Data Processing", patterns: [/dataset|dataloader|data process|preprocess|batch\b|stage 1/i] },
  { name: "Model Setup", patterns: [/model and data|move input|convert to|get model|get original|wrap model|initialize|load.*model/i] },
  { name: "Prompt Engineering", patterns: [/prompt|lstm|instruction template|concatenate prompt/i] },
];

const LLM_SUBSUB_FOR_GENERAL: KeywordRule[] = [
  { name: "Tensor Operations", patterns: [/tensor|autograd|differentiat|common operation|basic tensor/i] },
  { name: "Training Loop", patterns: [/training loop|training\b|epoch|step|iterate/i] },
  { name: "LoRA & Adapters", patterns: [/lora|adapter|replace with|get original/i] },
  { name: "RLHF Pipeline", patterns: [/reward|ppo|stage|eos|response|format input|instruction/i] },
  { name: "Pipeline Parallelism", patterns: [/pipeline|split model|split.*device|stage/i] },
  { name: "Sampling & Decoding", patterns: [/sampling|greedy|beam|top-k|top-p|nucleus|temperature/i] },
];

const CATEGORY_RULES: { prefix: RegExp; name: string }[] = [
  { prefix: /^llm-mastery/i, name: "AI & LLM" },
  { prefix: /^osb\s+skill/i, name: "Knowledge Management" },
  { prefix: /^osb\s+changelog/i, name: "Knowledge Management" },
  { prefix: /^osb\s+arch/i, name: "Knowledge Management" },
  { prefix: /^osb\s+claude/i, name: "Knowledge Management" },
  { prefix: /^osb/i, name: "Knowledge Management" },
  { prefix: /^ai-brain/i, name: "AI Memory & Brain" },
  { prefix: /^second-brain/i, name: "Knowledge Management" },
  { prefix: /^brain-cog/i, name: "AI Memory & Brain" },
  { prefix: /^neural_memory/i, name: "AI Memory & Brain" },
  { prefix: /^nma:/i, name: "AI Memory & Brain" },
  { prefix: /^codeintelligen/i, name: "Code Intelligence" },
  { prefix: /^khoj/i, name: "Knowledge Management" },
];

const TRAINING_KEYWORD_RULES: { patterns: RegExp[]; name: string }[] = [
  { patterns: [/llm|large language model|complete.*guide/i], name: "AI & LLM" },
  { patterns: [/memory|stress.*test|neural.*memory|external memory|nma:/i], name: "AI Memory & Brain" },
  { patterns: [/codeintelligen|code gen|bug detect|code completion|security scan/i], name: "Code Intelligence" },
  { patterns: [/osb|obsidian|second.brain|khoj/i], name: "Knowledge Management" },
  { patterns: [/business|startup|financ|revenue|market|sales/i], name: "Business" },
  { patterns: [/desktop|electron|tauri|native app/i], name: "Desktop" },
  { patterns: [/web|next\.?js|react|frontend|vercel/i], name: "Web" },
  { patterns: [/model|transformer|inference|serving/i], name: "Model" },
];

const OSB_SUBCATEGORIES: KeywordRule[] = [
  { name: "Skills", patterns: [/^osb\s+skill/i] },
  { name: "Architecture", patterns: [/^osb\s+arch/i] },
  { name: "Changelogs", patterns: [/^osb\s+changelog/i] },
  { name: "Claude Integration", patterns: [/^osb\s+claude/i] },
];

function matchKeyword(text: string, rules: KeywordRule[]): string | null {
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) return rule.name;
    }
  }
  return null;
}

function categorizeLLMNode(node: SemanticNode): { sub: string; subSub: string | null } {
  const text = node.label + " " + node.content;
  const sub = matchKeyword(text, LLM_SUBCATEGORIES);
  if (sub && sub !== "General") return { sub, subSub: null };
  const subSub = matchKeyword(text, LLM_SUBSUB_FOR_GENERAL);
  if (subSub) return { sub: "General", subSub };
  return { sub: "General", subSub: null };
}

function categorizeOSBNode(node: SemanticNode): { sub: string; subSub: string | null } {
  const sub = matchKeyword(node.label, OSB_SUBCATEGORIES);
  if (sub) return { sub, subSub: null };
  return { sub: "General", subSub: null };
}

export function categorizeSemantic(nodes: SemanticNode[]): SemanticCluster[] {
  const clusters: Map<string, SemanticCluster> = new Map();

  for (const node of nodes) {
    const label = node.label || "";
    let categoryName = "Other";
    for (const rule of CATEGORY_RULES) {
      if (rule.prefix.test(label)) {
        categoryName = rule.name;
        break;
      }
    }

    let subName = "General";
    let subSubName: string | null = null;

    if (categoryName === "AI & LLM") {
      const result = categorizeLLMNode(node);
      subName = result.sub;
      subSubName = result.subSub;
    } else if (categoryName === "Knowledge Management") {
      const result = categorizeOSBNode(node);
      subName = result.sub;
      subSubName = result.subSub;
    }

    const clusterId = `semantic-cat-${categoryName.toLowerCase().replace(/\s+/g, "-")}`;
    if (!clusters.has(clusterId)) {
      clusters.set(clusterId, {
        id: clusterId,
        name: categoryName,
        count: 0,
        nodeIds: [],
        subCategories: [],
      });
    }
    const cluster = clusters.get(clusterId)!;
    cluster.count++;
    cluster.nodeIds.push(node.id);

    let subCat = cluster.subCategories.find(s => s.name === subName);
    if (!subCat) {
      subCat = {
        id: `${clusterId}-sub-${subName.toLowerCase().replace(/\s+/g, "-")}`,
        name: subName,
        count: 0,
        nodes: [],
        subSubCategories: [],
      };
      cluster.subCategories.push(subCat);
    }
    subCat.count++;
    subCat.nodes.push(node);

    if (subSubName) {
      let subSubCat = subCat.subSubCategories.find(s => s.name === subSubName);
      if (!subSubCat) {
        subSubCat = {
          id: `${subCat.id}-subsub-${subSubName.toLowerCase().replace(/\s+/g, "-")}`,
          name: subSubName,
          count: 0,
          nodes: [],
        };
        subCat.subSubCategories.push(subSubCat);
      }
      subSubCat.count++;
      subSubCat.nodes.push(node);
    }
  }

  const result = Array.from(clusters.values());
  result.sort((a, b) => b.count - a.count);
  const MAX_SUBCATS = 6;
  const MAX_SUBSUBCATS = 6;
  for (const cluster of result) {
    cluster.subCategories.sort((a, b) => b.count - a.count);
    if (cluster.subCategories.length > MAX_SUBCATS) {
      const overflow = cluster.subCategories.splice(MAX_SUBCATS);
      const otherSub: SemanticSubCategory = {
        id: `${cluster.id}-sub-other`,
        name: "Other",
        count: overflow.reduce((sum, s) => sum + s.count, 0),
        nodes: overflow.flatMap(s => s.nodes),
        subSubCategories: [],
      };
      for (const s of overflow) {
        otherSub.subSubCategories.push(...s.subSubCategories);
      }
      cluster.subCategories.push(otherSub);
    }
    for (const sub of cluster.subCategories) {
      sub.subSubCategories.sort((a, b) => b.count - a.count);
      if (sub.subSubCategories.length > MAX_SUBSUBCATS) {
        const overflow = sub.subSubCategories.splice(MAX_SUBSUBCATS);
        const otherSubSub: SemanticSubSubCategory = {
          id: `${sub.id}-subsub-other`,
          name: "Other",
          count: overflow.reduce((sum, s) => sum + s.count, 0),
          nodes: overflow.flatMap(s => s.nodes),
        };
        sub.subSubCategories.push(otherSubSub);
      }
    }
  }
  return result;
}

export function categorizeTraining(nodes: SemanticNode[]): SemanticCluster[] {
  const clusters: Map<string, SemanticCluster> = new Map();

  for (const node of nodes) {
    const text = (node.label + " " + node.content).toLowerCase();
    let categoryName = "AI Memory & Brain";
    for (const rule of TRAINING_KEYWORD_RULES) {
      for (const pattern of rule.patterns) {
        if (pattern.test(text)) {
          categoryName = rule.name;
          break;
        }
      }
      if (categoryName !== "AI Memory & Brain") break;
    }

    const clusterId = `training-cat-${categoryName.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and")}`;
    if (!clusters.has(clusterId)) {
      clusters.set(clusterId, {
        id: clusterId,
        name: categoryName,
        count: 0,
        nodeIds: [],
        subCategories: [],
      });
    }
    const cluster = clusters.get(clusterId)!;
    cluster.count++;
    cluster.nodeIds.push(node.id);

    const sourceName = (node.label || "").replace(/\s*\[chunk \d+\/\d+\]\s*$/, "").trim() || "General";
    let subCat = cluster.subCategories.find(s => s.name === sourceName);
    if (!subCat) {
      subCat = {
        id: `${clusterId}-sub-${sourceName.toLowerCase().replace(/\s+/g, "-").slice(0, 40)}`,
        name: sourceName,
        count: 0,
        nodes: [],
        subSubCategories: [],
      };
      cluster.subCategories.push(subCat);
    }
    subCat.count++;
    subCat.nodes.push(node);
  }

  const result = Array.from(clusters.values());
  result.sort((a, b) => b.count - a.count);
  return result;
}

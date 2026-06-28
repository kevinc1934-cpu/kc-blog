"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, Text } from "@react-three/drei";
import * as THREE from "three";
import { categorizeSemantic, categorizeTraining, type SemanticCluster, type SemanticSubCategory, type SemanticSubSubCategory } from "@/lib/semantic-categories";

type Tier = "working" | "stm" | "episodic" | "semantic" | "ltm" | "training";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  tier: string;
  content: string;
  tags: string[];
  entities: string[];
  createdAt: string;
  accessCount: number;
  recallCount: number;
  decayFactor: number;
  dormant: boolean;
  confidence: number;
  baseImportance: number;
  ltmLevel?: number;
  consolidationLevel: number;
  mergedFromCount: number;
  usefulCount: number;
  rejectedCount: number;
  usefulnessScore: number;
  sessionMarker?: string | null;
  sessionTask?: string;
  procedure?: { name: string; successCount: number; stepCount: number; triggerKeywords: string[] };
  valid: boolean;
  source?: string;
}

interface GraphRelation {
  id: string;
  source: string;
  target: string;
  type: string;
  weight: number;
}

interface GraphSnapshot {
  exportedAt: string;
  version: number;
  stats: {
    totalNodes: number;
    totalRelations: number;
    tierBreakdown: Record<string, number>;
    ltmLevels: { level1: number; level2: number; level3: number };
    dormantCount: number;
    invalidatedCount: number;
    avgAccessCount: number;
    avgDecayFactor: number;
  };
  nodes: GraphNode[];
  relations: GraphRelation[];
}

const TIER_COLORS: Record<Tier, string> = {
  working: "#19e4d4",
  stm: "#4dd0e1",
  episodic: "#b388ff",
  semantic: "#e0a82e",
  ltm: "#ff8a3d",
  training: "#66bb6a",
};

const TIER_LABELS: Record<Tier, string> = {
  working: "Working",
  stm: "STM",
  episodic: "Episodic",
  semantic: "Semantic",
  ltm: "LTM",
  training: "Training",
};

const TIER_DESC: Record<Tier, string> = {
  working: "Active context (15-min TTL)",
  stm: "Short-term (24h TTL)",
  episodic: "Experiences (30-day decay)",
  semantic: "Knowledge (180-day decay)",
  ltm: "Long-term (sub-levels 1-3)",
  training: "Training material (no decay)",
};

const TIER_REGIONS: Record<Tier, THREE.Vector3> = {
  working: new THREE.Vector3(0, 8, 0),
  stm: new THREE.Vector3(0, 4.5, 0),
  episodic: new THREE.Vector3(5.5, 0, 0),
  semantic: new THREE.Vector3(-5.5, 0, 0),
  ltm: new THREE.Vector3(0, -1.5, 0),
  training: new THREE.Vector3(0, -6, 0),
};

const MAX_NODES = 250;
const MAX_EDGES = 350;
const SEMANTIC_CLUSTER_PREFIX = "semantic-cat-";
const TRAINING_CLUSTER_PREFIX = "training-cat-";

function tierRadius(count: number, isTraining: boolean, trainingCategoryCount: number): number {
  if (isTraining) {
    const catCount = Math.max(1, trainingCategoryCount);
    return 2.5 + Math.min(6, catCount * 0.8);
  }
  if (count === 0) return 1.8;
  return 2.5 + Math.min(6, Math.sqrt(count) * 0.22);
}

function isClusterNode(node: GraphNode): boolean {
  return node.id.startsWith(SEMANTIC_CLUSTER_PREFIX) || node.id.startsWith(TRAINING_CLUSTER_PREFIX);
}

function makeClusterNode(cluster: SemanticCluster): GraphNode {
  return {
    id: cluster.id,
    label: cluster.name,
    type: "cluster",
    tier: "semantic",
    content: `${cluster.count} neurons across ${cluster.subCategories.length} sub-categories`,
    tags: [],
    entities: [],
    createdAt: "",
    accessCount: 0,
    recallCount: cluster.count,
    decayFactor: 1,
    dormant: false,
    confidence: 1,
    baseImportance: Math.min(1, 0.5 + cluster.count * 0.003),
    consolidationLevel: 0,
    mergedFromCount: 0,
    usefulCount: 0,
    rejectedCount: 0,
    usefulnessScore: 1,
    sessionMarker: null,
    sessionTask: undefined,
    valid: true,
    source: "semantic-cluster",
  };
}

function makeTrainingClusterNode(cluster: SemanticCluster): GraphNode {
  return {
    id: cluster.id,
    label: cluster.name,
    type: "cluster",
    tier: "training",
    content: `${cluster.count} chunks across ${cluster.subCategories.length} sources`,
    tags: [],
    entities: [],
    createdAt: "",
    accessCount: 0,
    recallCount: cluster.count,
    decayFactor: 1,
    dormant: false,
    confidence: 1,
    baseImportance: Math.min(1, 0.4 + cluster.count * 0.002),
    consolidationLevel: 0,
    mergedFromCount: 0,
    usefulCount: 0,
    rejectedCount: 0,
    usefulnessScore: 1,
    sessionMarker: null,
    sessionTask: undefined,
    valid: true,
    source: "training-cluster",
  };
}

function sampleNodes(snapshot: GraphSnapshot): GraphNode[] {
  const byTier: Record<string, GraphNode[]> = {};
  for (const n of snapshot.nodes) {
    const t = n.tier || "ltm";
    if (!byTier[t]) byTier[t] = [];
    byTier[t].push(n);
  }

  const result: GraphNode[] = [];

  const semanticNodes = byTier["semantic"] || [];
  const trainingNodes = byTier["training"] || [];
  const clusteredTiers = new Set(["semantic", "training"]);
  const otherTotal = snapshot.nodes.length - semanticNodes.length - trainingNodes.length;

  if (semanticNodes.length > 0) {
    const clusters = categorizeSemantic(semanticNodes);
    for (const cluster of clusters) {
      result.push(makeClusterNode(cluster));
    }
  }

  if (trainingNodes.length > 0) {
    const clusters = categorizeTraining(trainingNodes);
    for (const cluster of clusters) {
      result.push(makeTrainingClusterNode(cluster));
    }
  }

  for (const tier of Object.keys(byTier)) {
    if (clusteredTiers.has(tier)) continue;
    const tierNodes = byTier[tier];
    const proportion = tierNodes.length / Math.max(1, otherTotal);
    const budget = Math.max(3, Math.round((MAX_NODES - result.length) * proportion));
    tierNodes.sort((a, b) => {
      if (a.dormant !== b.dormant) return a.dormant ? 1 : -1;
      return (b.baseImportance + b.recallCount * 0.02) - (a.baseImportance + a.recallCount * 0.02);
    });
    result.push(...tierNodes.slice(0, budget));
  }

  return result.slice(0, MAX_NODES);
}

function distributeInRegion(region: THREE.Vector3, index: number, total: number, maxR: number): THREE.Vector3 {
  const phi = Math.acos(1 - 2 * (index + 0.5) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
  const r = maxR * (0.4 + ((index * 0.371) % 1) * 0.55);
  return new THREE.Vector3(
    region.x + r * Math.sin(phi) * Math.cos(theta),
    region.y + r * Math.sin(phi) * Math.sin(theta),
    region.z + r * Math.cos(phi),
  );
}

function distributeClusters(region: THREE.Vector3, index: number, total: number, count: number, maxR: number): THREE.Vector3 {
  const phi = Math.acos(1 - 2 * (index + 0.5) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
  const r = maxR * (0.5 + Math.min(0.4, count * 0.02));
  return new THREE.Vector3(
    region.x + r * Math.sin(phi) * Math.cos(theta),
    region.y + r * Math.sin(phi) * Math.sin(theta),
    region.z + r * Math.cos(phi),
  );
}

interface BrainNode {
  data: GraphNode;
  position: THREE.Vector3;
  basePosition: THREE.Vector3;
  radius: number;
  tier: Tier;
  color: THREE.Color;
  active: boolean;
  isCluster: boolean;
}

function InstancedNeurons({ brain, onSelect, activeIds }: {
  brain: BrainNode[];
  onSelect: (n: GraphNode) => void;
  activeIds: string[];
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(), []);
  const phases = useMemo(() => brain.map(() => Math.random() * 10), [brain]);

  const activeSet = useMemo(() => new Set(activeIds), [activeIds]);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < brain.length; i++) {
      brain[i].active = activeSet.has(brain[i].data.id);
    }
  }, [activeSet, brain]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < brain.length; i++) {
      const node = brain[i];
      const active = node.active;
      const pulse = active ? 1 + Math.sin(t * 4 + phases[i]) * 0.15 : 1 + Math.sin(t * 0.5 + phases[i]) * 0.03;
      dummy.position.copy(node.basePosition);
      const scale = node.isCluster ? node.radius * pulse * 3 : node.radius * pulse * 2;
      dummy.scale.setScalar(scale);
      dummy.rotation.y = t * (active ? 0.01 : 0.003) + phases[i];
      dummy.rotation.x = t * 0.0015 + phases[i] * 0.5;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      const isDormant = node.data.dormant;
      if (node.isCluster) {
        colorObj.set(node.color);
      } else {
        colorObj.set(isDormant ? "#444450" : node.color);
      }
      meshRef.current.setColorAt(i, colorObj);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx !== undefined && idx < brain.length) onSelect(brain[idx].data);
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined as any, undefined as any, brain.length]}
      onClick={handleClick}
    >
      <sphereGeometry args={[0.5, 12, 12]} />
      <meshStandardMaterial
        emissive={"#222233"}
        emissiveIntensity={0.15}
        transparent
        roughness={0.4}
        metalness={0.2}
        vertexColors
      />
    </instancedMesh>
  );
}

function EdgeSegments({ brain, snapshot, activeIds }: {
  brain: BrainNode[];
  snapshot: GraphSnapshot;
  activeIds: string[];
}) {
  const ref = useRef<THREE.LineSegments>(null);
  const activeSet = useMemo(() => new Set(activeIds), [activeIds]);

  const { positions, colors } = useMemo(() => {
    const nodeMap = new Map(brain.map(b => [b.data.id, b]));
    const pos: number[] = [];
    const col: number[] = [];
    let count = 0;

    for (const rel of snapshot.relations) {
      if (count >= MAX_EDGES) break;
      const s = nodeMap.get(rel.source);
      const t = nodeMap.get(rel.target);
      if (!s || !t) continue;
      pos.push(s.basePosition.x, s.basePosition.y, s.basePosition.z);
      pos.push(t.basePosition.x, t.basePosition.y, t.basePosition.z);
      const isActive = activeSet.has(rel.source) && activeSet.has(rel.target);
      const c = isActive ? new THREE.Color(TIER_COLORS[s.tier]) : new THREE.Color("#444466");
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      count++;
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(col) };
  }, [brain, snapshot, activeSet]);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={0.4} depthWrite={false} />
    </lineSegments>
  );
}

function BrainRegionLabel({ tier, count, radius }: { tier: Tier; count: number; radius: number }) {
  const pos = TIER_REGIONS[tier].clone();
  pos.y += radius + 0.8;
  pos.x -= radius * 0.7;
  return (
    <Text
      position={pos}
      fontSize={0.5}
      color={TIER_COLORS[tier]}
      anchorX="left"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#08080c"
    >
      {TIER_LABELS[tier].toUpperCase() + "  (" + count + ")"}
    </Text>
  );
}

function BrainRegionGlow({ tier, radius }: { tier: Tier; radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.04 + Math.sin(state.clock.elapsedTime * 0.3) * 0.01;
  });
  return (
    <mesh ref={meshRef} position={TIER_REGIONS[tier]}>
      <sphereGeometry args={[radius, 16, 16]} />
      <meshBasicMaterial
        color={TIER_COLORS[tier]}
        transparent
        opacity={0.04}
        wireframe
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function StarField() {
  const points = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#333344" transparent opacity={0.4} />
    </points>
  );
}

function CameraController({ selectedNode }: { selectedNode: BrainNode | null }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  useEffect(() => {
    if (selectedNode && controlsRef.current) {
      controlsRef.current.target.lerp(selectedNode.basePosition, 0.1);
    }
  }, [selectedNode]);
  return <OrbitControls ref={controlsRef} enablePan enableZoom enableRotate zoomSpeed={0.6} rotateSpeed={0.5} minDistance={5} maxDistance={30} />;
}

interface SceneProps {
  snapshot: GraphSnapshot;
  selected: GraphNode | null;
  setSelected: (n: GraphNode | null) => void;
  activeIds: string[];
  visibleNodes: GraphNode[];
  semanticClusters: SemanticCluster[];
}

function Scene({ snapshot, selected, setSelected, activeIds, visibleNodes, semanticClusters }: SceneProps) {
  const tierRadii = useMemo(() => {
    const radii: Record<string, number> = {};
    const trainingCount = snapshot.stats.tierBreakdown["training"] || 0;
    const trainingCatCount = visibleNodes.filter(n => n.tier === "training" && isClusterNode(n)).length;
    for (const tier of Object.keys(TIER_REGIONS)) {
      const count = snapshot.stats.tierBreakdown[tier] || 0;
      radii[tier] = tierRadius(count, tier === "training", trainingCatCount || 1);
    }
    return radii;
  }, [snapshot, visibleNodes]);

  const brain = useMemo<BrainNode[]>(() => {
    const tierCounts: Record<string, number> = {};
    const tierIndices: Record<string, number> = {};

    return visibleNodes.map((node) => {
      const tier = (node.tier || "ltm") as Tier;
      tierCounts[tier] = (tierCounts[tier] || 0) + 1;
      tierIndices[tier] = (tierIndices[tier] || 0) + 1;
      const idx = tierIndices[tier];

      const region = TIER_REGIONS[tier] || TIER_REGIONS.ltm;
      const maxR = tierRadii[tier] || 3;
      const total = Math.max(1, tierCounts[tier] + 1);
      const cluster = isClusterNode(node);
      const pos = cluster
        ? distributeClusters(region, idx, total, parseInt(node.recallCount?.toString() || "1"), maxR)
        : distributeInRegion(region, idx, total, maxR);

      const importance = node.baseImportance + (node.recallCount || 0) * 0.02;
      const radius = cluster
        ? Math.max(0.35, 0.4 + importance * 0.4)
        : Math.max(0.15, 0.2 + importance * 0.35);

      return {
        data: node,
        position: pos.clone(),
        basePosition: pos.clone(),
        radius,
        tier,
        color: new THREE.Color(TIER_COLORS[tier] || TIER_COLORS.ltm),
        active: false,
        isCluster: cluster,
      };
    });
  }, [visibleNodes, tierRadii]);

  const selectedBrain = useMemo(() => {
    return selected ? brain.find(b => b.data.id === selected.id) || null : null;
  }, [selected, brain]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#19e4d4" />
      <pointLight position={[10, 0, 5]} intensity={0.3} color="#b388ff" />
      <pointLight position={[-10, 0, -5]} intensity={0.3} color="#e0a82e" />
      <pointLight position={[0, -10, 0]} intensity={0.3} color="#66bb6a" />

      <StarField />

      {(Object.keys(TIER_REGIONS) as Tier[]).map(tier => {
        const count = snapshot.stats.tierBreakdown[tier] || 0;
        return <BrainRegionGlow key={tier} tier={tier} radius={tierRadii[tier] || 3} />;
      })}

      {(Object.keys(TIER_REGIONS) as Tier[]).map(tier => {
        const count = snapshot.stats.tierBreakdown[tier] || 0;
        return <BrainRegionLabel key={"label-" + tier} tier={tier} count={count} radius={tierRadii[tier] || 3} />;
      })}

      <EdgeSegments brain={brain} snapshot={snapshot} activeIds={activeIds} />
      <InstancedNeurons brain={brain} onSelect={setSelected} activeIds={activeIds} />

      {brain.filter(b => b.isCluster).map((b) => (
        <Text
          key={b.data.id}
          position={[b.basePosition.x, b.basePosition.y + 1.2, b.basePosition.z]}
          fontSize={0.35}
          color={TIER_COLORS[b.tier]}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#08080c"
          maxWidth={6}
        >
          {`${b.data.label}\n(${b.data.recallCount})`}
        </Text>
      ))}

      {selectedBrain && (
        <Html position={[selectedBrain.basePosition.x, selectedBrain.basePosition.y + 1, selectedBrain.basePosition.z]} center>
          <div style={{
            background: "rgba(10,10,16,0.92)",
            border: `1px solid ${TIER_COLORS[selectedBrain.tier]}55`,
            borderRadius: "8px",
            padding: "6px 10px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            fontFamily: "'Space Mono', monospace",
          }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", color: TIER_COLORS[selectedBrain.tier] }}>
              {selectedBrain.data.label.substring(0, 30)}
            </div>
          </div>
        </Html>
      )}

      <CameraController selectedNode={selectedBrain} />
    </>
  );
}

function DetailPanel({ selected, onClose, pathwayCount }: {
  selected: GraphNode | null;
  onClose: () => void;
  pathwayCount: number;
}) {
  if (!selected) return null;
  const tier = selected.tier as Tier;
  const color = TIER_COLORS[tier] || TIER_COLORS.ltm;

  return (
    <div className="glass p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="chip chip-cyan text-xs">Selected Neuron</span>
        <button onClick={onClose} className="text-xs text-[var(--text-dim)] hover:text-[var(--red)]">✕</button>
      </div>
      <div className="text-sm font-mono font-bold text-[var(--text-bright)] mb-1 break-words">{selected.label}</div>
      <div className="text-xs text-[var(--text-dim)] mb-3 break-words">{selected.content.substring(0, 200)}</div>

      <div className="space-y-1.5 text-xs">
        <Row label="Tier" value={selected.tier} color={color} />
        <Row label="Type" value={selected.type} />
        {selected.ltmLevel && <Row label="LTM Level" value={selected.ltmLevel + "/3"} />}
        <Row label="Recall Count" value={String(selected.recallCount)} />
        <Row label="Access Count" value={String(selected.accessCount)} />
        <Row label="Decay Factor" value={selected.decayFactor.toFixed(3)} color={selected.decayFactor < 0.3 ? "var(--red)" : selected.decayFactor < 0.6 ? "var(--gold)" : "var(--cyan)"} />
        <Row label="Confidence" value={selected.confidence.toFixed(2)} />
        <Row label="Importance" value={selected.baseImportance.toFixed(2)} />
        <Row label="Usefulness" value={selected.usefulnessScore.toFixed(3)} />
        {selected.mergedFromCount > 0 && <Row label="Merged From" value={selected.mergedFromCount + " nodes"} />}
        {selected.consolidationLevel > 0 && <Row label="Consolidation" value={"L" + selected.consolidationLevel} />}
        {selected.dormant && <Row label="Status" value="DORMANT" color="var(--red)" />}
        {!selected.valid && <Row label="Status" value="INVALIDATED" color="var(--red)" />}
        {selected.sessionMarker && <Row label="Session" value={selected.sessionMarker} />}
        {selected.procedure && <Row label="Procedure" value={selected.procedure.name + " (" + selected.procedure.successCount + "x)"} />}
      </div>

      {selected.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {selected.tags.slice(0, 8).map(t => (
            <span key={t} className="chip chip-neutral text-xs">{t}</span>
          ))}
        </div>
      )}

      {selected.entities.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.entities.slice(0, 6).map(e => (
            <span key={e} className="text-xs font-mono text-[var(--cyan)]">#{e}</span>
          ))}
        </div>
      )}

      {pathwayCount > 1 && (
        <div className="mt-3 pt-3 border-t border-[var(--border)]">
          <div className="text-xs text-[var(--text-dim)] mb-1">Recall pathway activates:</div>
          <div className="text-xs font-mono text-[var(--cyan)]">{pathwayCount} connected neurons</div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[var(--text-dim)]">{label}</span>
      <span className="font-mono" style={{ color: color || "var(--text-bright)" }}>{value}</span>
    </div>
  );
}

function CategoryTreePanel({ cluster, onClose, onNodeSelect }: {
  cluster: SemanticCluster;
  onClose: () => void;
  onNodeSelect: (node: GraphNode) => void;
}) {
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());
  const [expandedSubSubs, setExpandedSubSubs] = useState<Set<string>>(new Set());
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleSub = (id: string) => {
    const next = new Set(expandedSubs);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedSubs(next);
  };
  const toggleSubSub = (id: string) => {
    const next = new Set(expandedSubSubs);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedSubSubs(next);
  };
  const toggleNodeList = (id: string) => {
    const next = new Set(expandedNodes);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedNodes(next);
  };

  return (
    <div className="glass p-4 max-h-[560px] overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="chip chip-gold text-xs">Semantic Cluster</span>
          <div className="text-sm font-mono font-bold text-[var(--gold)] mt-1">{cluster.name}</div>
        </div>
        <button onClick={onClose} className="text-xs text-[var(--text-dim)] hover:text-[var(--red)]">✕</button>
      </div>

      <div className="text-xs text-[var(--text-dim)] mb-3">
        {cluster.count} neurons · {cluster.subCategories.length} sub-categories
      </div>

      <div className="space-y-1">
        {cluster.subCategories.map((sub: SemanticSubCategory) => (
          <div key={sub.id}>
            <button
              onClick={() => toggleSub(sub.id)}
              className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[var(--surface)] transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-dim)]">{expandedSubs.has(sub.id) ? "▼" : "▶"}</span>
                <span className="text-xs font-mono font-bold text-[var(--text-bright)]">{sub.name}</span>
                {sub.subSubCategories.length > 0 && (
                  <span className="text-xs text-[var(--text-dim)]">· {sub.subSubCategories.length} groups</span>
                )}
              </div>
              <span className="text-xs font-mono text-[var(--gold)]">{sub.count}</span>
            </button>

            {expandedSubs.has(sub.id) && (
              <div className="ml-4 mt-0.5 space-y-0.5">
                {sub.subSubCategories.length > 0 ? (
                  sub.subSubCategories.map((subSub: SemanticSubSubCategory) => (
                    <div key={subSub.id}>
                      <button
                        onClick={() => toggleSubSub(subSub.id)}
                        className="w-full flex items-center justify-between px-2 py-1 rounded-lg hover:bg-[var(--surface)] transition-colors text-left"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--text-dim)]">{expandedSubSubs.has(subSub.id) ? "▼" : "▶"}</span>
                          <span className="text-xs font-mono text-[var(--text-dim)]">{subSub.name}</span>
                        </div>
                        <span className="text-xs font-mono text-[var(--text-dim)]">{subSub.count}</span>
                      </button>

                      {expandedSubSubs.has(subSub.id) && (
                        <div className="ml-4 space-y-0.5">
                          <button
                            onClick={() => toggleNodeList(subSub.id)}
                            className="w-full text-left px-2 py-1 text-xs text-[var(--cyan)] hover:text-[var(--text-bright)] transition-colors"
                          >
                            {expandedNodes.has(subSub.id) ? "▼" : "▶"} Show nodes ({subSub.nodes.length})
                          </button>
                          {expandedNodes.has(subSub.id) && (
                            <div className="ml-2 space-y-0.5 max-h-40 overflow-y-auto">
                              {subSub.nodes.map((n) => (
                                <button
                                  key={n.id}
                                  onClick={() => onNodeSelect(n as unknown as GraphNode)}
                                  className="block w-full text-left px-2 py-1 text-xs font-mono text-[var(--text-dim)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded truncate transition-colors"
                                  title={n.content}
                                >
                                  {n.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <>
                    <button
                      onClick={() => toggleNodeList(sub.id)}
                      className="w-full text-left px-2 py-1 text-xs text-[var(--cyan)] hover:text-[var(--text-bright)] transition-colors"
                    >
                      {expandedNodes.has(sub.id) ? "▼" : "▶"} Show nodes ({sub.nodes.length})
                    </button>
                    {expandedNodes.has(sub.id) && (
                      <div className="ml-2 space-y-0.5 max-h-48 overflow-y-auto">
                        {sub.nodes.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => onNodeSelect(n as unknown as GraphNode)}
                            className="block w-full text-left px-2 py-1 text-xs font-mono text-[var(--text-dim)] hover:text-[var(--cyan)] hover:bg-[var(--surface)] rounded truncate transition-colors"
                            title={n.content}
                          >
                            {n.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[var(--text-dim)]">{label}</span>
        <span className="font-mono text-[var(--text-bright)]">{value}</span>
      </div>
      <div className="h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: pct + "%", background: color }} />
      </div>
    </div>
  );
}

export function NeuralGraph() {
  const [snapshot, setSnapshot] = useState<GraphSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [showStats, setShowStats] = useState(true);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<SemanticCluster | null>(null);

  const fetchGraph = async () => {
    try {
      const res = await fetch("/api/memory-graph");
      if (!res.ok) throw new Error("Failed to load graph");
      setSnapshot(await res.json());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGraph(); }, []);

  const semanticClusters = useMemo<SemanticCluster[]>(() => {
    if (!snapshot) return [];
    const all: SemanticCluster[] = [];
    const semanticNodes = snapshot.nodes.filter(n => n.tier === "semantic");
    if (semanticNodes.length > 0) {
      all.push(...categorizeSemantic(semanticNodes as unknown as Parameters<typeof categorizeSemantic>[0]));
    }
    const trainingNodes = snapshot.nodes.filter(n => n.tier === "training");
    if (trainingNodes.length > 0) {
      all.push(...categorizeTraining(trainingNodes as unknown as Parameters<typeof categorizeTraining>[0]));
    }
    return all;
  }, [snapshot]);

  const visibleNodes = useMemo(() => {
    if (!snapshot) return [];
    return sampleNodes(snapshot);
  }, [snapshot]);

  const handleSelect = (node: GraphNode | null) => {
    if (!node) { handleClose(); return; }
    if (isClusterNode(node)) {
      const cluster = semanticClusters.find(c => c.id === node.id);
      if (cluster) {
        setSelectedCluster(cluster);
        setSelected(null);
        setActiveIds(cluster.nodeIds.slice(0, 50));
      }
      return;
    }
    setSelectedCluster(null);
    setSelected(node);
    const connected = new Set<string>([node.id]);
    for (const rel of snapshot?.relations || []) {
      if (rel.source === node.id) connected.add(rel.target);
      if (rel.target === node.id) connected.add(rel.source);
    }
    setActiveIds(Array.from(connected));
  };

  const handleNodeFromTree = (node: GraphNode) => {
    setSelectedCluster(null);
    setSelected(node);
    const connected = new Set<string>([node.id]);
    for (const rel of snapshot?.relations || []) {
      if (rel.source === node.id) connected.add(rel.target);
      if (rel.target === node.id) connected.add(rel.source);
    }
    setActiveIds(Array.from(connected));
  };

  const handleClose = () => {
    setSelected(null);
    setSelectedCluster(null);
    setActiveIds([]);
  };

  const triggerRecall = (query: string) => {
    if (!snapshot) return;
    const q = query.toLowerCase();
    const matches = snapshot.nodes.filter(n =>
      n.content.toLowerCase().includes(q) ||
      n.label.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 15);
    setActiveIds(matches.map(m => m.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] text-[var(--text-dim)]">
        <div className="text-center">
          <div className="text-2xl font-mono mb-2 text-[var(--cyan)] animate-pulse">Loading neural graph...</div>
          <div className="text-sm">Fetching 3D memory brain snapshot</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[600px] text-[var(--red)]">
        <div className="text-center">
          <div className="text-lg font-mono mb-2">Failed to load graph</div>
          <div className="text-sm">{error}</div>
          <button onClick={fetchGraph} className="mt-4 px-4 py-2 border border-[var(--border)] rounded-lg text-sm hover:border-[var(--cyan)] transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  const stats = snapshot?.stats;

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display font-700 text-lg text-[var(--text-bright)]">Neural Memory Brain</h2>
          {stats && (
            <span className="chip chip-cyan text-xs">
              {stats.totalNodes} neurons · {stats.totalRelations} synapses · {visibleNodes.length} rendered · 3D
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Recall query..."
            onKeyDown={(e) => { if (e.key === "Enter") triggerRecall((e.target as HTMLInputElement).value); }}
            className="px-3 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-sm text-[var(--text)] focus:outline-none focus:border-[var(--cyan)] w-40"
          />
          <button onClick={() => setShowStats(!showStats)} className={"btn-chip text-xs " + (showStats ? "border-[var(--cyan)] text-[var(--cyan)]" : "")}>
            Stats
          </button>
          <button onClick={fetchGraph} className="btn-chip text-xs">Refresh</button>
          <button onClick={handleClose} className="btn-chip text-xs">Reset</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="relative glass overflow-hidden rounded-2xl" style={{ height: 600 }}>
          {snapshot && (
            <Canvas
              camera={{ position: [0, 2, 15], fov: 60 }}
              dpr={[1, 1.5]}
              gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <Scene
                  snapshot={snapshot}
                  selected={selected}
                  setSelected={handleSelect}
                  activeIds={activeIds}
                  visibleNodes={visibleNodes}
                  semanticClusters={semanticClusters}
                />
              </Suspense>
            </Canvas>
          )}

          <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 pointer-events-none">
            {(Object.keys(TIER_COLORS) as Tier[]).map(tier => {
              const count = stats?.tierBreakdown[tier] || 0;
              if (count === 0) return null;
              return (
                <div key={tier} className="flex items-center gap-1.5 bg-[var(--surface)]/80 backdrop-blur px-2 py-1 rounded-lg">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: TIER_COLORS[tier], boxShadow: "0 0 6px " + TIER_COLORS[tier] }} />
                  <span className="text-xs font-mono text-[var(--text-dim)]">{TIER_LABELS[tier]}</span>
                  <span className="text-xs font-mono font-bold" style={{ color: TIER_COLORS[tier] }}>{count}</span>
                </div>
              );
            })}
          </div>

          <div className="absolute top-3 right-3 bg-[var(--surface)]/80 backdrop-blur px-3 py-1.5 rounded-lg pointer-events-none">
            <span className="text-xs font-mono text-[var(--text-dim)]">Drag to rotate · Scroll to zoom · Click neuron to trace</span>
          </div>
        </div>

        <div className="space-y-3">
          {selectedCluster && (
            <CategoryTreePanel
              cluster={selectedCluster}
              onClose={handleClose}
              onNodeSelect={handleNodeFromTree}
            />
          )}

          {!selectedCluster && (
            <DetailPanel
              selected={selected}
              onClose={handleClose}
              pathwayCount={activeIds.length}
            />
          )}

          {showStats && stats && (
            <div className="glass p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-3">Graph Statistics</div>
              <div className="space-y-2 text-xs">
                <StatBar label="Total Neurons" value={stats.totalNodes} max={stats.totalNodes} color="var(--cyan)" />
                <StatBar label="Synapses" value={stats.totalRelations} max={Math.max(stats.totalRelations, 1)} color="var(--purple)" />
                <StatBar label="Dormant" value={stats.dormantCount} max={stats.totalNodes} color="var(--red)" />
                <StatBar label="Invalidated" value={stats.invalidatedCount} max={stats.totalNodes} color="var(--gold)" />
                <div className="pt-2 border-t border-[var(--border)] space-y-1">
                  <div className="flex justify-between"><span className="text-[var(--text-dim)]">Avg Access</span><span className="font-mono text-[var(--text-bright)]">{stats.avgAccessCount}</span></div>
                  <div className="flex justify-between"><span className="text-[var(--text-dim)]">Avg Decay</span><span className="font-mono text-[var(--text-bright)]">{stats.avgDecayFactor}</span></div>
                </div>
                {(stats.ltmLevels.level2 > 0 || stats.ltmLevels.level3 > 0) && (
                  <div className="pt-2 border-t border-[var(--border)]">
                    <div className="text-[var(--text-dim)] mb-1">LTM Sub-Levels</div>
                    <div className="flex gap-2">
                      <span className="font-mono text-[var(--cyan)]">L1: {stats.ltmLevels.level1}</span>
                      <span className="font-mono text-[var(--gold)]">L2: {stats.ltmLevels.level2}</span>
                      <span className="font-mono text-[var(--purple)]">L3: {stats.ltmLevels.level3}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-[var(--border)]">
                <div className="text-xs font-mono text-[var(--text-dim)] mb-2">Exported: {new Date(snapshot!.exportedAt).toLocaleString()}</div>
                <div className="text-xs font-mono text-[var(--text-dim)]">Graph v{snapshot!.version}</div>
              </div>
            </div>
          )}

          {!selected && (
            <div className="glass p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-[var(--text-dim)] mb-3">Brain Regions</div>
              <div className="space-y-2">
                {(Object.keys(TIER_COLORS) as Tier[]).map(tier => {
                  const count = stats?.tierBreakdown[tier] || 0;
                  return (
                    <div key={tier} className="flex items-start gap-2">
                      <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: TIER_COLORS[tier], boxShadow: "0 0 8px " + TIER_COLORS[tier] }} />
                      <div>
                        <div className="text-xs font-mono font-bold" style={{ color: TIER_COLORS[tier] }}>{TIER_LABELS[tier]} ({count})</div>
                        <div className="text-xs text-[var(--text-dim)]">{TIER_DESC[tier]}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

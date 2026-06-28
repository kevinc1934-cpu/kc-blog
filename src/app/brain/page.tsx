import { NeuralGraph } from "@/app/admin/dashboard/neural-graph";

export const metadata = {
  title: "Neural Memory Brain — KC // kevcspot",
  description: "Interactive 3D visualization of the KC-AI memory graph across 6 cognitive tiers.",
};

export default function BrainPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pt-20">
      <div className="mb-6">
        <div className="chip chip-cyan mb-3">3D Neural Visualization</div>
        <h1 className="font-display font-800 text-3xl gradient-cyan mb-2">Neural Memory Brain</h1>
        <p className="text-sm text-[var(--text-dim)] max-w-2xl">
          Real-time 3D visualization of the KC-AI memory graph. Each region represents a memory tier —
          Working, Short-Term, Episodic, Semantic, Long-Term, and Training — sized by node volume.
          Click neurons to trace recall pathways. Drag to rotate, scroll to zoom.
        </p>
      </div>
      <NeuralGraph />
    </div>
  );
}

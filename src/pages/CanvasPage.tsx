import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CanvasBoard } from "../components/CanvasBoard";
import { NodeInspector } from "../components/NodeInspector";
import { NodePalette } from "../components/NodePalette";
import { GitHubRepoBrowser } from "../components/GitHubRepoBrowser";
import { ArrowLeft } from "lucide-react";

export default function CanvasPage() {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(0.8);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setZoom(0.8);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-accent/70"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="h-[calc(100vh-73px)] p-6">
        <div className="grid grid-cols-1 gap-6 h-full lg:grid-cols-[1fr,320px]">
          <div className="h-full">
            <CanvasBoard zoom={zoom} onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onResetZoom={handleResetZoom} />
          </div>
          
          <div className="flex flex-col gap-4 overflow-auto">
            <NodePalette />
            <NodeInspector />
            <GitHubRepoBrowser />
          </div>
        </div>
      </main>
    </div>
  );
}

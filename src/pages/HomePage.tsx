import { useNavigate } from "react-router-dom";
import { TemplateGallery } from "../components/TemplateGallery";
import { NodePalette } from "../components/NodePalette";
import { GitHubRepoBrowser } from "../components/GitHubRepoBrowser";
import { Sparkles, Maximize2 } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent2 text-slate-950 font-black">
              SD
            </div>
            <div>
              <p className="text-sm text-slate-400">Systems Design Studio</p>
              <p className="text-lg font-semibold text-slate-50">Sketch, compare, and share architecture ideas</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/canvas")}
              className="flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-3 py-2 text-sm text-accent transition hover:border-accent/70 hover:bg-accent/20"
            >
              <Maximize2 className="h-4 w-4" />
              <span>Open Canvas</span>
            </button>
            <a
              href="https://github.com/danielsuit/systems-design"
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 transition hover:border-accent/70"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              <span>Open Repo</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <TemplateGallery />
          <NodePalette />
          <GitHubRepoBrowser />
        </div>
      </main>
    </div>
  );
}

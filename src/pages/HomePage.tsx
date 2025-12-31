import { useNavigate } from "react-router-dom";
import { TemplateGallery } from "../components/TemplateGallery";
import { NodePalette } from "../components/NodePalette";
import { GitHubRepoBrowser } from "../components/GitHubRepoBrowser";
import { Maximize2 } from "lucide-react";

function SystemsDesignLogo() {
  return (
    <div className="relative w-10 h-10">
      <svg viewBox="0 0 40 40" className="w-full h-full">
        {/* Background circle */}
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="logoGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        
        {/* Top cylinder */}
        <ellipse cx="20" cy="10" rx="8" ry="3" fill="url(#logoGrad)" />
        <rect x="12" y="10" width="16" height="6" fill="url(#logoGrad)" opacity="0.8" />
        <ellipse cx="20" cy="16" rx="8" ry="3" fill="url(#logoGradDark)" />
        
        {/* Middle cylinder */}
        <ellipse cx="20" cy="18" rx="8" ry="3" fill="url(#logoGrad)" />
        <rect x="12" y="18" width="16" height="6" fill="url(#logoGrad)" opacity="0.8" />
        <ellipse cx="20" cy="24" rx="8" ry="3" fill="url(#logoGradDark)" />
        
        {/* Bottom cylinder */}
        <ellipse cx="20" cy="26" rx="8" ry="3" fill="url(#logoGrad)" />
        <rect x="12" y="26" width="16" height="6" fill="url(#logoGrad)" opacity="0.8" />
        <ellipse cx="20" cy="32" rx="8" ry="3" fill="url(#logoGradDark)" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <SystemsDesignLogo />
            <div>
              <p className="text-sm text-slate-400">Systems Design Studio</p>
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

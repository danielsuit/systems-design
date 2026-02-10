import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CanvasBoard } from "../components/CanvasBoard";
import { NodeInspector } from "../components/NodeInspector";
import { NodePalette } from "../components/NodePalette";
import { GitHubRepoBrowser } from "../components/GitHubRepoBrowser";
import { ArrowLeft, PanelRightClose, PanelRight } from "lucide-react";

export default function CanvasPage() {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(0.8);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setZoom(0.8);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(0.3, Math.min(newZoom, 2)));
  };

  return (
    <div className="noise-bg min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <header
        className="glass sticky top-0 border-b"
        style={{ borderColor: 'var(--color-border)', zIndex: 30 }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="btn-ghost group"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            </button>
            <div
              className="hidden sm:block h-5"
              style={{ width: '1px', background: 'var(--color-border)' }}
            />
            <p
              className="hidden sm:block font-display text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Canvas
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="btn-ghost"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main canvas area */}
      <main className="h-[calc(100vh-57px)] p-3 md:p-4">
        <div
          className="grid h-full gap-4 transition-all duration-300"
          style={{
            gridTemplateColumns: sidebarOpen ? '1fr 320px' : '1fr',
          }}
        >
          {/* Canvas */}
          <div className="h-full min-h-0 opacity-0 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
            <CanvasBoard
              zoom={zoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onResetZoom={handleResetZoom}
              onZoomChange={handleZoomChange}
            />
          </div>

          {/* Sidebar */}
          {sidebarOpen && (
            <aside
              className="hidden lg:flex flex-col gap-4 overflow-y-auto min-h-0 opacity-0 animate-slide-in"
              style={{
                animationDelay: '200ms',
                animationFillMode: 'forwards',
                scrollbarWidth: 'thin',
              }}
            >
              <NodeInspector />
              <NodePalette />
              <GitHubRepoBrowser />
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}

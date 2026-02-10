import { useNavigate } from "react-router-dom";
import { TemplateGallery } from "../components/TemplateGallery";
import { NodePalette } from "../components/NodePalette";
import { GitHubRepoBrowser } from "../components/GitHubRepoBrowser";
import { ArrowRight } from "lucide-react";

function SystemsDesignLogo() {
  return (
    <div className="relative w-9 h-9">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <defs>
          <linearGradient id="logoWarm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4864e" />
            <stop offset="100%" stopColor="#e09a65" />
          </linearGradient>
        </defs>
        {/* Abstract architectural mark */}
        <rect x="4" y="4" width="12" height="12" rx="2" fill="url(#logoWarm)" opacity="0.9" />
        <rect x="20" y="4" width="12" height="12" rx="2" fill="url(#logoWarm)" opacity="0.5" />
        <rect x="4" y="20" width="12" height="12" rx="2" fill="url(#logoWarm)" opacity="0.5" />
        <rect x="20" y="20" width="12" height="12" rx="2" fill="url(#logoWarm)" opacity="0.25" />
        {/* Connection lines */}
        <line x1="16" y1="10" x2="20" y2="10" stroke="#d4864e" strokeWidth="1.5" opacity="0.6" />
        <line x1="10" y1="16" x2="10" y2="20" stroke="#d4864e" strokeWidth="1.5" opacity="0.6" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="noise-bg min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Decorative background shapes */}
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute animate-pulse-soft"
          style={{
            top: '-20%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,134,78,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute animate-pulse-soft"
          style={{
            bottom: '-15%',
            left: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212,134,78,0.04) 0%, transparent 70%)',
            animationDelay: '1.5s',
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <header className="glass sticky top-0 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <SystemsDesignLogo />
              <div>
                <p
                  className="font-display text-lg"
                  style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}
                >
                  Systems Design Studio
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/canvas")}
              className="btn-primary group"
            >
              <span>Open Canvas</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </header>

        {/* Hero section */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 lg:px-8">
          <div
            className="opacity-0 animate-fade-up stagger-1"
          >
            <p className="overline mb-4">Architecture Toolkit</p>
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl max-w-2xl"
              style={{
                color: 'var(--color-text-primary)',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
              }}
            >
              Design systems that <em className="not-italic" style={{ color: 'var(--color-accent)' }}>scale</em>
            </h1>
            <p
              className="mt-6 max-w-lg text-base leading-relaxed"
              style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}
            >
              Sketch distributed architectures visually. Drag nodes, draw connections, and
              explore templates — all in an infinite canvas.
            </p>
          </div>
        </section>

        {/* Decorative divider */}
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--color-border), var(--color-accent-muted), var(--color-border), transparent)',
            }}
          />
        </div>

        {/* Main content — asymmetric 2-column layout */}
        <main className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,380px]">
            {/* Left column — Templates (larger, focal) */}
            <div className="opacity-0 animate-fade-up stagger-2">
              <TemplateGallery />
            </div>

            {/* Right column — Stacked panels */}
            <div className="flex flex-col gap-8">
              <div className="opacity-0 animate-fade-up stagger-3">
                <NodePalette />
              </div>
              <div className="opacity-0 animate-fade-up stagger-4">
                <GitHubRepoBrowser />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="mx-auto max-w-6xl px-6 pb-12 lg:px-8">
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--color-border), transparent)',
              marginBottom: '24px',
            }}
          />
          <p
            className="text-xs"
            style={{ color: 'var(--color-text-ghost)' }}
          >
            Systems Design Studio — craft your architecture
          </p>
        </footer>
      </div>
    </div>
  );
}

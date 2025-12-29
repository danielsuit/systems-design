# Systems Design Studio

A lightweight web app to sketch system architectures, start from curated templates, and visualize GitHub repository trees to connect code layout with design diagrams.

## Features
- Interactive canvas with draggable nodes
- Template library (modern web app, data pipeline, blank)
- Node palette to add services, databases, queues, caches, storage, search
- GitHub file tree viewer (mocked; ready for a real API call)
- Dark, Tailwind-powered UI

## Getting started
```bash
npm install
npm run dev
```
Then open the dev server URL (default `http://localhost:5173`).

## Wiring the GitHub viewer
The GitHub panel currently loads mock data from `src/data/mockRepoTrees.ts`. To connect real repositories:
1. Create a small API function to call the GitHub Contents or Tree API (e.g., `GET /repos/{owner}/{repo}/git/trees/{sha}?recursive=1`).
2. Add an input for a personal access token or use unauthenticated requests with rate limits.
3. Normalize the response into the `FileNode` shape used by `GitHubRepoBrowser`.

## Project structure
- `src/App.tsx` — page layout
- `src/components/` — canvas, templates, palette, inspector, GitHub viewer
- `src/store/designStore.ts` — Zustand state for nodes/templates
- `src/data/templates.ts` — starter architectures
- `src/data/mockRepoTrees.ts` — mock file trees

## Next ideas
- Add edges/lines between nodes and export as PNG/SVG
- Persist diagrams to localStorage or a backend
- Collaborate in real time using websockets
- Generate diagrams from repo scans or ADRs

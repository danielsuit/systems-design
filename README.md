# Systems Design Studio

Live app: [https://systems-design-studio.web.app/](https://systems-design-studio.web.app/)

![Canvas](canvas.avif)

## What this program does

Systems Design Studio is a visual architecture editor for designing system diagrams on an interactive canvas.

- Lets you start from built-in templates (for example: **Blank Canvas**, **Modern Web App**, and **Data Pipeline**).
- Lets you drag, place, and multi-select nodes to lay out an architecture.
- Lets you create and remove directed connections (edges) between nodes.
- Lets you pan and zoom the canvas for large diagrams.
- Lets you edit node properties in an inspector (label, details, type, and color).
- Lets you add custom nodes from a node library and grouped infrastructure categories.
- Persists your current nodes, edges, and selected repository link in local browser storage.
- Includes a GitHub repository browser panel that loads and displays a repo file tree (`owner/repo` + branch + optional token).

## App flow

1. Open the home page and choose a template.
2. Enter the canvas workspace.
3. Add/edit/move nodes and connect them.
4. Optionally load a GitHub repo tree in the sidebar for reference.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```
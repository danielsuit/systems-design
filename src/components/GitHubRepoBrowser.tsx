import { FormEvent, useState } from "react";
import { 
  Folder, FolderOpen, Github, GitBranch, FileText, 
  Code2, FileJson, FileCode, Settings, Package,
  Type, Database, Image as ImageIcon, Loader2, ChevronRight
} from "lucide-react";
import { FileNode, mockRepoTrees } from "../data/mockRepoTrees";
import { useDesignStore } from "../store/designStore";

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const iconProps = { className: "h-4 w-4", style: { color: 'var(--color-text-ghost)' } };

  const iconMap: Record<string, JSX.Element> = {
    tsx: <Code2 {...iconProps} />,
    ts: <Type {...iconProps} />,
    jsx: <Code2 {...iconProps} />,
    js: <Code2 {...iconProps} />,
    html: <Code2 {...iconProps} />,
    css: <Code2 {...iconProps} />,
    scss: <Code2 {...iconProps} />,
    less: <Code2 {...iconProps} />,
    json: <FileJson {...iconProps} />,
    xml: <FileCode {...iconProps} />,
    yaml: <Settings {...iconProps} />,
    yml: <Settings {...iconProps} />,
    toml: <Settings {...iconProps} />,
    env: <Settings {...iconProps} />,
    config: <Settings {...iconProps} />,
    conf: <Settings {...iconProps} />,
    package: <Package {...iconProps} />,
    lock: <Package {...iconProps} />,
    md: <FileText {...iconProps} />,
    markdown: <FileText {...iconProps} />,
    txt: <FileText {...iconProps} />,
    py: <Code2 {...iconProps} />,
    java: <Code2 {...iconProps} />,
    sql: <Database {...iconProps} />,
    db: <Database {...iconProps} />,
    png: <ImageIcon {...iconProps} />,
    jpg: <ImageIcon {...iconProps} />,
    jpeg: <ImageIcon {...iconProps} />,
    gif: <ImageIcon {...iconProps} />,
    svg: <ImageIcon {...iconProps} />,
  };

  return iconMap[ext] || <FileText {...iconProps} />;
}

function TreeNode({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const padding = 16 * depth;

  if (node.type === "file") {
    return (
      <div
        className="flex items-center gap-2.5 py-1.5 text-sm rounded-md px-2 transition-colors duration-150"
        style={{
          paddingLeft: padding + 8,
          color: 'var(--color-text-secondary)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        {getFileIcon(node.name)}
        <span>{node.name}</span>
      </div>
    );
  }

  return (
    <div style={{ paddingLeft: padding }}>
      <button
        className="flex w-full items-center gap-2.5 text-left text-sm py-1.5 px-2 rounded-md transition-colors duration-150"
        style={{ color: 'var(--color-text-primary)' }}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
        }}
      >
        {open ? (
          <FolderOpen className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
        ) : (
          <Folder className="h-4 w-4" style={{ color: 'var(--color-text-ghost)' }} />
        )}
        <span className="font-medium">{node.name}</span>
      </button>
      {open && node.children ? (
        <div className="space-y-0.5">
          {node.children.map((child) => (
            <TreeNode key={child.path} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function GitHubRepoBrowser() {
  const repoLink = useDesignStore((s) => s.repoLink);
  const setRepoLink = useDesignStore((s) => s.setRepoLink);
  const [repo, setRepo] = useState(repoLink);
  const [branch, setBranch] = useState("main");
  const [token, setToken] = useState("");
  const [tree, setTree] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGitHubTree = async (repoStr: string, branchStr: string, tokenStr: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3.raw',
      };
      
      if (tokenStr) {
        headers['Authorization'] = `token ${tokenStr}`;
      }

      const response = await fetch(
        `https://api.github.com/repos/${repoStr}/git/trees/${branchStr}?recursive=1`,
        { headers }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Repository not found");
        } else if (response.status === 401) {
          throw new Error("Invalid GitHub token");
        } else {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }
      }

      const data = await response.json() as { tree: Array<{ path: string; type: string }> };
      
      const treeMap = new Map<string, FileNode>();
      const rootNodes: FileNode[] = [];

      data.tree.forEach((item) => {
        const parts = item.path.split("/");
        let current = rootNodes;
        let currentPath = "";

        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          currentPath += (currentPath ? "/" : "") + part;
          const isFile = item.type === "blob" && i === parts.length - 1;
          const key = currentPath;

          let node = treeMap.get(key);
          if (!node) {
            node = {
              name: part,
              path: currentPath,
              type: isFile ? "file" : "dir",
              children: [],
            };
            treeMap.set(key, node);
            current.push(node);
          }

          if (!node) {
            continue;
          }

          if (!isFile) {
            if (!node.children) {
              node.children = [];
            }
            current = node.children;
          }
        }
      });

      setTree(rootNodes);
      setRepoLink(repoStr);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch repository";
      setError(message);
      setTree([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const key = repo.trim();
    if (key) {
      fetchGitHubTree(key, branch, token);
    }
  };

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* Section header — clickable to toggle */}
      <button
        className="flex w-full items-center gap-3 text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'var(--color-surface-2)' }}
        >
          <Github className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-base" style={{ color: 'var(--color-text-primary)' }}>
            Repository
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Browse a GitHub file tree
          </p>
        </div>
        <ChevronRight
          className="h-4 w-4 transition-transform duration-200"
          style={{
            color: 'var(--color-text-ghost)',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {!expanded ? null : <div className="flex flex-col gap-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Repo input */}
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3"
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-ghost)' }}>
            repo
          </span>
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text-primary)' }}
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repo"
          />
        </div>

        {/* Branch input */}
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3"
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <GitBranch className="h-4 w-4" style={{ color: 'var(--color-text-ghost)' }} />
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text-primary)' }}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
          />
        </div>

        {/* Token input */}
        <div
          className="flex items-center gap-2 rounded-lg px-4 py-3"
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-ghost)' }}>
            token
          </span>
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--color-text-primary)' }}
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="optional"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>Load tree</span>
          )}
        </button>
      </form>

      {/* Error state */}
      {error && (
        <div
          className="rounded-lg p-3 text-sm"
          style={{
            background: 'rgba(192, 57, 43, 0.08)',
            border: '1px solid rgba(192, 57, 43, 0.2)',
            color: '#e74c3c',
          }}
        >
          {error}
        </div>
      )}

      {/* Tree view */}
      <div
        className="max-h-64 overflow-auto rounded-xl p-3"
        style={{
          background: 'var(--color-surface-1)',
          border: '1px solid var(--color-border)',
          scrollbarWidth: 'thin',
        }}
      >
        {tree && tree.length > 0 ? (
          <div className="space-y-0.5">
            {tree.map((node) => (
              <TreeNode key={node.path} node={node} />
            ))}
          </div>
        ) : (
          <p className="text-sm py-4 text-center" style={{ color: 'var(--color-text-ghost)' }}>
            {loading ? "Loading..." : "No data loaded yet"}
          </p>
        )}
      </div>
      </div>}
    </div>
  );
}

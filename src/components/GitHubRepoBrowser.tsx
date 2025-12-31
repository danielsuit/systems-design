import { FormEvent, useMemo, useState } from "react";
import { 
  Folder, FolderOpen, Github, GitBranch, FileText, 
  Code2, FileJson, FileCode, FileX, Settings, Package,
  Type, Database, Image as ImageIcon
} from "lucide-react";
import { FileNode, mockRepoTrees } from "../data/mockRepoTrees";
import { useDesignStore } from "../store/designStore";

function getFileIcon(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const iconProps = { className: "h-4 w-4 text-slate-500" };

  const iconMap: Record<string, JSX.Element> = {
    // Web
    tsx: <Code2 {...iconProps} />,
    ts: <Type {...iconProps} />,
    jsx: <Code2 {...iconProps} />,
    js: <Code2 {...iconProps} />,
    html: <Code2 {...iconProps} />,
    css: <Code2 {...iconProps} />,
    scss: <Code2 {...iconProps} />,
    less: <Code2 {...iconProps} />,
    // Data
    json: <FileJson {...iconProps} />,
    xml: <FileCode {...iconProps} />,
    yaml: <Settings {...iconProps} />,
    yml: <Settings {...iconProps} />,
    toml: <Settings {...iconProps} />,
    // Config
    env: <Settings {...iconProps} />,
    config: <Settings {...iconProps} />,
    conf: <Settings {...iconProps} />,
    // Package managers
    package: <Package {...iconProps} />,
    lock: <Package {...iconProps} />,
    // Docs
    md: <FileText {...iconProps} />,
    markdown: <FileText {...iconProps} />,
    txt: <FileText {...iconProps} />,
    // Python
    py: <Code2 {...iconProps} />,
    // Java
    java: <Code2 {...iconProps} />,
    // Database
    sql: <Database {...iconProps} />,
    db: <Database {...iconProps} />,
    // Images
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
  const padding = 12 * depth;

  if (node.type === "file") {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-300" style={{ paddingLeft: padding }}>
        {getFileIcon(node.name)}
        <span>{node.name}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1" style={{ paddingLeft: padding }}>
      <button
        className="flex w-full items-center gap-2 text-left text-sm text-slate-200 hover:text-accent"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FolderOpen className="h-4 w-4 text-accent" /> : <Folder className="h-4 w-4 text-slate-500" />}
        <span>{node.name}</span>
      </button>
      {open && node.children ? (
        <div className="space-y-1">
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
      
      // Convert flat API response to tree structure
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

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Github className="h-4 w-4" />
        <span>GitHub file tree</span>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <span className="text-slate-500">repo:</span>
          <input
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="owner/repo"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <GitBranch className="h-4 w-4 text-slate-500" />
          <input
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="main"
          />
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
          <span className="text-slate-500">token:</span>
          <input
            className="flex-1 bg-transparent text-sm text-slate-100 outline-none"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="GitHub token (optional)"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-accent to-accent2 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Load tree"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-900/20 border border-red-800/50 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="max-h-64 overflow-auto rounded-lg border border-slate-800 bg-slate-900/70 p-3">
        {tree && tree.length > 0 ? (
          <div className="space-y-1">
            {tree.map((node) => (
              <TreeNode key={node.path} node={node} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">{loading ? "Loading..." : "No data loaded yet."}</p>
        )}
      </div>
    </div>
  );
}

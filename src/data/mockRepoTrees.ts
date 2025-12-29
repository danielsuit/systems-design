export type FileNode = {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: FileNode[];
};

export const mockRepoTrees: Record<string, FileNode[]> = {
  "danielsuit/systems-design": [
    {
      name: "src",
      path: "src",
      type: "dir",
      children: [
        { name: "App.tsx", path: "src/App.tsx", type: "file" },
        { name: "main.tsx", path: "src/main.tsx", type: "file" },
      ],
    },
    {
      name: "package.json",
      path: "package.json",
      type: "file",
    },
  ],
  "acme/payments-platform": [
    {
      name: "services",
      path: "services",
      type: "dir",
      children: [
        { name: "api", path: "services/api", type: "dir", children: [] },
        { name: "worker", path: "services/worker", type: "dir", children: [] },
      ],
    },
    {
      name: "infra",
      path: "infra",
      type: "dir",
      children: [
        { name: "k8s", path: "infra/k8s", type: "dir", children: [] },
        { name: "terraform", path: "infra/terraform", type: "dir", children: [] },
      ],
    },
    { name: "README.md", path: "README.md", type: "file" },
  ],
};

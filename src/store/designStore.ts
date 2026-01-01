import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { templates } from "../data/templates";

export type NodeKind =
  | "service"
  | "database"
  | "queue"
  | "cache"
  | "client"
  | "storage"
  | "search";

export interface NodeModel {
  id: string;
  label: string;
  kind: NodeKind;
  x: number;
  y: number;
  color: string;
  detail?: string;
}

export interface ConnectionModel {
  id: string;
  from: string;
  to: string;
}

export interface TemplateModel {
  id: string;
  name: string;
  description: string;
  nodes: NodeModel[];
  notes?: string;
  connections?: ConnectionModel[];
}

interface DesignState {
  nodes: NodeModel[];
  connections: ConnectionModel[];
  selectedNodeId?: string;
  activeTemplateId: string;
  repoLink: string;
  setTemplate: (templateId: string) => void;
  addNode: (partial: Omit<NodeModel, "id" | "x" | "y">) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  updateNode: (id: string, updates: Partial<Omit<NodeModel, "id" | "x" | "y">>) => void;
  deleteNode: (id: string) => void;
  addConnection: (from: string, to: string) => void;
  deleteConnection: (connectionId: string) => void;
  selectNode: (id?: string) => void;
  setRepoLink: (link: string) => void;
}

const defaultTemplateId = templates[0]?.id ?? "blank";

export const useDesignStore = create<DesignState>()(
  persist(
    (set) => ({
      nodes: templates[0]?.nodes ?? [],
      connections: templates[0]?.connections ?? [],
      activeTemplateId: defaultTemplateId,
      selectedNodeId: undefined,
      repoLink: "danielsuit/systems-design",
      setTemplate: (templateId) => {
        const tpl = templates.find((t) => t.id === templateId);
        set({
          activeTemplateId: templateId,
          nodes: tpl ? tpl.nodes.map((n) => ({ ...n })) : [],
          connections: tpl?.connections ? tpl.connections.map((c) => ({ ...c })) : [],
          selectedNodeId: undefined,
        });
      },
      addNode: (partial) =>
        set((state) => ({
          nodes: [
            ...state.nodes,
            {
              id: nanoid(6),
              label: partial.label,
              kind: partial.kind,
              color: partial.color,
              detail: partial.detail,
              x: 80 + Math.random() * 320,
              y: 80 + Math.random() * 240,
            },
          ],
        })),
      updateNodePosition: (id, x, y) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, x: Math.max(24, x), y: Math.max(24, y) } : node
          ),
        })),
      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((node) =>
            node.id === id ? { ...node, ...updates } : node
          ),
        })),
      deleteNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((node) => node.id !== id),
          connections: state.connections.filter((c) => c.from !== id && c.to !== id),
          selectedNodeId: state.selectedNodeId === id ? undefined : state.selectedNodeId,
        })),
      addConnection: (from, to) =>
        set((state) => {
          if (from === to) return state;
          const exists = state.connections.some((c) => c.from === from && c.to === to);
          if (exists) return state;
          const hasNodes = state.nodes.find((n) => n.id === from) && state.nodes.find((n) => n.id === to);
          if (!hasNodes) return state;
          return {
            ...state,
            connections: [...state.connections, { id: nanoid(5), from, to }],
          };
        }),
      deleteConnection: (connectionId) =>
        set((state) => ({
          connections: state.connections.filter((c) => c.id !== connectionId),
        })),
      selectNode: (id) => set({ selectedNodeId: id }),
      setRepoLink: (link) => set({ repoLink: link }),
    }),
    {
      name: "design-store",
    }
  )
);

import { Palette, PlusCircle, ChevronRight, ChevronDown, Trash2 } from "lucide-react";
import { useDesignStore, NodeKind } from "../store/designStore";
import { useState } from "react";

type NodeCategory = "databases" | "apis" | "backends" | "cloud" | "frontends" | "storage" | "cache" | "messaging" | "ml" | "analytics" | "monitoring";

const categories: Record<NodeCategory, { label: string; nodes: { label: string; kind: NodeKind; color: string; detail: string; services: string[] }[] }> = {
  databases: {
    label: "Databases",
    nodes: [
      { label: "SQL Database", kind: "db", color: "#34d399", detail: "PostgreSQL, MySQL, etc", services: ["PostgreSQL", "MySQL", "MariaDB", "SQL Server"] },
      { label: "NoSQL Database", kind: "db", color: "#10b981", detail: "MongoDB, Cassandra", services: ["MongoDB", "Cassandra", "DynamoDB", "CosmosDB"] },
      { label: "Time Series DB", kind: "db", color: "#059669", detail: "InfluxDB, Prometheus", services: ["InfluxDB", "Prometheus", "TimescaleDB"] },
    ],
  },
  apis: {
    label: "APIs",
    nodes: [
      { label: "REST API", kind: "service", color: "#6366f1", detail: "HTTP/REST endpoint", services: ["Express", "FastAPI", "Spring Boot", "Django"] },
      { label: "GraphQL API", kind: "service", color: "#818cf8", detail: "GraphQL server", services: ["Apollo", "Hasura", "GraphQL Yoga"] },
      { label: "API Gateway", kind: "service", color: "#a855f7", detail: "Edge termination + routing", services: ["API Gateway", "Kong", "Traefik"] },
    ],
  },
  backends: {
    label: "Backends",
    nodes: [
      { label: "App Service", kind: "service", color: "#6366f1", detail: "Business logic tier", services: ["Node.js", "Python", "Java", "Go"] },
      { label: "Worker", kind: "service", color: "#8b5cf6", detail: "Async processing", services: ["Celery", "Bull", "RQ", "Hangfire"] },
      { label: "Microservice", kind: "service", color: "#7c3aed", detail: "Independent service", services: ["Node.js", "Spring Boot", "Go", "Rust"] },
    ],
  },
  cloud: {
    label: "Cloud Hosting",
    nodes: [
      { label: "Compute Instance", kind: "service", color: "#f59e0b", detail: "EC2, GCE, Azure VM", services: ["AWS EC2", "Google Compute", "Azure VMs"] },
      { label: "Container Runtime", kind: "service", color: "#f97316", detail: "ECS, GKE, AKS", services: ["ECS", "GKE", "AKS", "Fargate"] },
      { label: "Serverless", kind: "service", color: "#fb923c", detail: "Lambda, Cloud Functions", services: ["Lambda", "Cloud Functions", "Azure Functions"] },
    ],
  },
  frontends: {
    label: "Frontends",
    nodes: [
      { label: "Web App", kind: "client", color: "#22d3ee", detail: "React, Vue, Angular", services: ["React", "Vue", "Angular", "Svelte"] },
      { label: "Mobile App", kind: "client", color: "#06b6d4", detail: "iOS, Android, React Native", services: ["React Native", "Flutter", "Swift", "Kotlin"] },
      { label: "Desktop App", kind: "client", color: "#0891b2", detail: "Electron, Tauri", services: ["Electron", "Tauri", "PyQt"] },
    ],
  },
  storage: {
    label: "Storage",
    nodes: [
      { label: "Object Storage", kind: "storage", color: "#38bdf8", detail: "S3, GCS, Azure Blob", services: ["AWS S3", "Google Cloud Storage", "Azure Blob"] },
      { label: "File Storage", kind: "storage", color: "#0ea5e9", detail: "EFS, Persistent volumes", services: ["AWS EFS", "NFS", "Azure Files"] },
      { label: "Data Lake", kind: "storage", color: "#0284c7", detail: "S3, ADLS, Cloud Storage", services: ["S3", "ADLS", "GCS"] },
    ],
  },
  cache: {
    label: "Cache",
    nodes: [
      { label: "In-Memory Cache", kind: "cache", color: "#f59e0b", detail: "Redis, Memcached", services: ["Redis", "Memcached", "DragonflyDB"] },
      { label: "CDN", kind: "cache", color: "#fbbf24", detail: "CloudFront, Akamai", services: ["CloudFront", "Akamai", "Cloudflare"] },
      { label: "Cache Layer", kind: "cache", color: "#fcd34d", detail: "Varnish, nginx", services: ["Varnish", "nginx", "HAProxy"] },
    ],
  },
  messaging: {
    label: "Messaging",
    nodes: [
      { label: "Message Queue", kind: "queue", color: "#f97316", detail: "SQS, RabbitMQ, Kafka", services: ["SQS", "RabbitMQ", "Kafka", "ActiveMQ"] },
      { label: "Pub/Sub", kind: "queue", color: "#fb923c", detail: "SNS, Pub/Sub, EventBus", services: ["SNS", "Pub/Sub", "EventBus", "NATS"] },
      { label: "Event Stream", kind: "queue", color: "#fdba74", detail: "Kafka, Kinesis", services: ["Kafka", "Kinesis", "Pulsar"] },
    ],
  },
  ml: {
    label: "Machine Learning",
    nodes: [
      { label: "ML Model", kind: "service", color: "#ec4899", detail: "TensorFlow, PyTorch", services: ["TensorFlow", "PyTorch", "scikit-learn"] },
      { label: "Vector DB", kind: "db", color: "#f472b6", detail: "Pinecone, Weaviate", services: ["Pinecone", "Weaviate", "Milvus"] },
      { label: "LLM Service", kind: "service", color: "#f9a8d4", detail: "OpenAI, Anthropic", services: ["OpenAI", "Anthropic", "Hugging Face"] },
    ],
  },
  analytics: {
    label: "Analytics",
    nodes: [
      { label: "Data Warehouse", kind: "storage", color: "#34d399", detail: "BigQuery, Snowflake", services: ["BigQuery", "Snowflake", "Redshift"] },
      { label: "Analytics DB", kind: "db", color: "#6ee7b7", detail: "ClickHouse, Druid", services: ["ClickHouse", "Druid", "Presto"] },
      { label: "Search Index", kind: "search", color: "#f472b6", detail: "Elasticsearch, Algolia", services: ["Elasticsearch", "Algolia", "OpenSearch"] },
    ],
  },
  monitoring: {
    label: "Monitoring",
    nodes: [
      { label: "Metrics Store", kind: "db", color: "#06b6d4", detail: "Prometheus, Datadog", services: ["Prometheus", "Datadog", "New Relic"] },
      { label: "Log Aggregation", kind: "storage", color: "#22d3ee", detail: "ELK, Splunk, Loki", services: ["ELK Stack", "Splunk", "Loki"] },
      { label: "Tracing", kind: "service", color: "#0891b2", detail: "Jaeger, Zipkin, DataDog", services: ["Jaeger", "Zipkin", "Datadog"] },
    ],
  },
};

const colorPresets = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Purple", value: "#a855f7" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f97316" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Green", value: "#22c55e" },
  { name: "Teal", value: "#14b8a6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Blue", value: "#3b82f6" },
];

export function NodePalette() {
  const addNode = useDesignStore((s) => s.addNode);
  const [expandedCategories, setExpandedCategories] = useState<Set<NodeCategory>>(
    new Set(["backends"])
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [customNodes, setCustomNodes] = useState<{ id: string; name: string; color: string }[]>([]);
  const [customNodeName, setCustomNodeName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colorPresets[0].value);
  const [expandedCustom, setExpandedCustom] = useState(true);
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);

  const toggleCategory = (category: NodeCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleNode = (nodeKey: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeKey)) {
      newExpanded.delete(nodeKey);
    } else {
      newExpanded.add(nodeKey);
    }
    setExpandedNodes(newExpanded);
  };

  const addCustomNode = () => {
    if (customNodeName.trim()) {
      const newCustomNode = {
        id: `custom-${Date.now()}`,
        name: customNodeName.trim(),
        color: selectedColor,
      };
      setCustomNodes([newCustomNode, ...customNodes]);
      setCustomNodeName("");
    }
  };

  const removeCustomNode = (id: string) => {
    setCustomNodes(customNodes.filter((node) => node.id !== id));
  };

  return (
    <div className="space-y-2 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between px-2 py-1 sticky top-0 bg-slate-950">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Palette className="h-4 w-4" />
          <span className="font-medium">Node library</span>
        </div>
        <button
          onClick={() => setShowAddNodeForm(!showAddNodeForm)}
          className="flex items-center gap-1 px-2 py-1 text-xs rounded transition bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span>Add Custom Node</span>
          {showAddNodeForm ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Add Node Form (Dropdown) */}
      {showAddNodeForm && (
        <div className="px-3 py-3 border border-slate-800 rounded-lg bg-slate-900/50 space-y-2">
          <input
            type="text"
            value={customNodeName}
            onChange={(e) => setCustomNodeName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomNode()}
            placeholder="Node name..."
            className="w-full px-2 py-1.5 text-sm bg-slate-800/50 border border-slate-700 rounded text-slate-100 placeholder-slate-500 outline-none focus:border-accent/60 transition"
          />
          <div className="flex gap-1 flex-wrap">
            {colorPresets.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-6 h-6 rounded transition border-2 ${
                  selectedColor === color.value ? "border-accent" : "border-slate-600 hover:border-slate-500"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
          <button
            onClick={addCustomNode}
            disabled={!customNodeName.trim()}
            className="w-full px-2 py-1.5 text-sm bg-accent/10 text-accent border border-accent/30 rounded transition hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Custom Node
          </button>
        </div>
      )}

      {/* Custom Nodes */}
      {customNodes.length > 0 && (
        <div>
          <button
            onClick={() => setExpandedCustom(!expandedCustom)}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900/50 hover:text-slate-100 transition rounded"
          >
            {expandedCustom ? (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-500" />
            )}
            <span className="font-medium">Custom Nodes</span>
            <span className="text-xs text-slate-500">({customNodes.length})</span>
          </button>

          {expandedCustom && (
            <div className="pl-4 space-y-1">
              {customNodes.map((customNode) => (
                <div
                  key={customNode.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded hover:bg-slate-800/60 group"
                >
                  <button
                    onClick={() =>
                      addNode({
                        label: customNode.name,
                        kind: "service",
                        color: customNode.color,
                        detail: "Custom",
                      })
                    }
                    className="flex-1 text-left flex items-center gap-2 min-w-0"
                  >
                    <div
                      className="w-3 h-3 rounded flex-shrink-0"
                      style={{ backgroundColor: customNode.color }}
                    />
                    <span className="text-slate-50 truncate">{customNode.name}</span>
                  </button>
                  <button
                    onClick={() => removeCustomNode(customNode.id)}
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="h-4 w-4 text-slate-600 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Nodes */}
      {Object.entries(categories).map(([key, category]) => {
        const isExpanded = expandedCategories.has(key as NodeCategory);
        return (
          <div key={key}>
            <button
              onClick={() => toggleCategory(key as NodeCategory)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-900/50 hover:text-slate-100 transition rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-slate-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-500" />
              )}
              <span className="font-medium">{category.label}</span>
            </button>

            {isExpanded && (
              <div className="pl-4 space-y-1">
                {category.nodes.map((item) => {
                  const nodeKey = `${key}-${item.label}`;
                  const nodeIsExpanded = expandedNodes.has(nodeKey);
                  return (
                    <div key={nodeKey}>
                      <button
                        onClick={() => toggleNode(nodeKey)}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded transition hover:bg-slate-800/60 text-slate-400 hover:text-slate-100"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {nodeIsExpanded ? (
                            <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          )}
                          <div className="text-left min-w-0">
                            <p className="text-slate-50 truncate">{item.label}</p>
                            <p className="text-xs text-slate-500 truncate">{item.detail}</p>
                          </div>
                        </div>
                      </button>

                      {nodeIsExpanded && (
                        <div className="pl-4 space-y-1">
                          {item.services.map((service) => (
                            <button
                              key={service}
                              onClick={() =>
                                addNode({
                                  label: service,
                                  kind: item.kind,
                                  color: item.color,
                                  detail: item.label,
                                })
                              }
                              className="w-full group flex items-center justify-between gap-2 px-3 py-2 text-sm rounded transition hover:bg-slate-800/60 text-slate-500 hover:text-slate-50"
                            >
                              <span className="truncate">{service}</span>
                              <PlusCircle className="h-4 w-4 text-slate-700 group-hover:text-accent flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

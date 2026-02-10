import { Palette, PlusCircle, ChevronRight, ChevronDown, X } from "lucide-react";
import { useDesignStore, NodeKind } from "../store/designStore";
import { useState } from "react";

type NodeCategory = "databases" | "apis" | "backends" | "cloud" | "frontends" | "storage" | "cache" | "messaging" | "ml" | "analytics" | "monitoring";

const categories: Record<NodeCategory, { label: string; nodes: { label: string; kind: NodeKind; color: string; detail: string; services: string[] }[] }> = {
  databases: {
    label: "Databases",
    nodes: [
      { label: "SQL Database", kind: "database", color: "#34d399", detail: "PostgreSQL, MySQL, etc", services: ["PostgreSQL", "MySQL", "MariaDB", "SQL Server"] },
      { label: "NoSQL Database", kind: "database", color: "#10b981", detail: "MongoDB, Cassandra", services: ["MongoDB", "Cassandra", "DynamoDB", "CosmosDB"] },
      { label: "Time Series DB", kind: "database", color: "#059669", detail: "InfluxDB, Prometheus", services: ["InfluxDB", "Prometheus", "TimescaleDB"] },
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
      { label: "Vector DB", kind: "database", color: "#f472b6", detail: "Pinecone, Weaviate", services: ["Pinecone", "Weaviate", "Milvus"] },
      { label: "LLM Service", kind: "service", color: "#f9a8d4", detail: "OpenAI, Anthropic", services: ["OpenAI", "Anthropic", "Hugging Face"] },
    ],
  },
  analytics: {
    label: "Analytics",
    nodes: [
      { label: "Data Warehouse", kind: "storage", color: "#34d399", detail: "BigQuery, Snowflake", services: ["BigQuery", "Snowflake", "Redshift"] },
      { label: "Analytics DB", kind: "database", color: "#6ee7b7", detail: "ClickHouse, Druid", services: ["ClickHouse", "Druid", "Presto"] },
      { label: "Search Index", kind: "search", color: "#f472b6", detail: "Elasticsearch, Algolia", services: ["Elasticsearch", "Algolia", "OpenSearch"] },
    ],
  },
  monitoring: {
    label: "Monitoring",
    nodes: [
      { label: "Metrics Store", kind: "database", color: "#06b6d4", detail: "Prometheus, Datadog", services: ["Prometheus", "Datadog", "New Relic"] },
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
  const [customNodeName, setCustomNodeName] = useState("");
  const [customNodeDetail, setCustomNodeDetail] = useState("");
  const [customNodeType, setCustomNodeType] = useState<NodeKind>("service");
  const [selectedColor, setSelectedColor] = useState(colorPresets[0].value);
  const [showAddNodeForm, setShowAddNodeForm] = useState(false);

  const nodeKinds: NodeKind[] = ["service", "database", "queue", "cache", "client", "storage", "search"];

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

  const createCustomNode = () => {
    if (customNodeName.trim()) {
      addNode({
        label: customNodeName.trim(),
        kind: customNodeType,
        color: selectedColor,
        detail: customNodeDetail.trim() || "Custom",
      });
      setCustomNodeName("");
      setCustomNodeDetail("");
      setCustomNodeType("service");
      setSelectedColor(colorPresets[0].value);
    }
  };

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      {/* Section Header */}
      <div
        className="flex items-center justify-between sticky top-0 py-2 px-1"
        style={{ background: 'var(--color-bg)', zIndex: 5 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'var(--color-accent-subtle)' }}
          >
            <Palette className="h-4 w-4" style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <h2 className="font-display text-base" style={{ color: 'var(--color-text-primary)' }}>
              Node Library
            </h2>
          </div>
        </div>
        <button
          onClick={() => setShowAddNodeForm(!showAddNodeForm)}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200"
          style={{
            background: showAddNodeForm ? 'var(--color-accent-muted)' : 'var(--color-accent-subtle)',
            color: 'var(--color-accent)',
            border: '1px solid transparent',
          }}
        >
          {showAddNodeForm ? (
            <X className="h-3.5 w-3.5" />
          ) : (
            <PlusCircle className="h-3.5 w-3.5" />
          )}
          <span>{showAddNodeForm ? "Close" : "Custom"}</span>
        </button>
      </div>

      {/* Add Node Form */}
      {showAddNodeForm && (
        <div
          className="rounded-xl p-4 space-y-3 animate-fade-up"
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
            animationDuration: '0.3s',
          }}
        >
          <input
            type="text"
            value={customNodeName}
            onChange={(e) => setCustomNodeName(e.target.value)}
            placeholder="Node name..."
            className="input-field"
          />
          <input
            type="text"
            value={customNodeDetail}
            onChange={(e) => setCustomNodeDetail(e.target.value)}
            placeholder="Detail / description..."
            className="input-field"
          />
          <select
            value={customNodeType}
            onChange={(e) => setCustomNodeType(e.target.value as NodeKind)}
            className="input-field"
            style={{ cursor: 'pointer' }}
          >
            {nodeKinds.map((kind) => (
              <option key={kind} value={kind}>
                {kind.charAt(0).toUpperCase() + kind.slice(1)}
              </option>
            ))}
          </select>

          {/* Color picker */}
          <div>
            <p className="overline mb-2">Color</p>
            <div className="flex gap-1.5 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className="w-7 h-7 rounded-lg transition-all duration-150"
                  style={{
                    backgroundColor: color.value,
                    boxShadow: selectedColor === color.value
                      ? `0 0 0 2px var(--color-bg), 0 0 0 4px ${color.value}`
                      : 'none',
                    transform: selectedColor === color.value ? 'scale(1.1)' : 'scale(1)',
                  }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={createCustomNode}
              disabled={!customNodeName.trim()}
              className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              style={{ padding: '10px 16px' }}
            >
              Create Node
            </button>
            <button
              onClick={() => {
                setShowAddNodeForm(false);
                setCustomNodeName("");
                setCustomNodeDetail("");
                setCustomNodeType("service");
                setSelectedColor(colorPresets[0].value);
              }}
              className="btn-ghost flex-1"
              style={{ padding: '10px 16px' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category Tree */}
      <div className="space-y-1">
        {Object.entries(categories).map(([key, category]) => {
          const isExpanded = expandedCategories.has(key as NodeCategory);
          return (
            <div key={key}>
              <button
                onClick={() => toggleCategory(key as NodeCategory)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all duration-150"
                style={{
                  color: isExpanded ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  background: isExpanded ? 'var(--color-surface-1)' : 'transparent',
                }}
              >
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--color-accent)' }} />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--color-text-ghost)' }} />
                )}
                <span className="font-medium">{category.label}</span>
                <span
                  className="ml-auto text-xs tabular-nums"
                  style={{ color: 'var(--color-text-ghost)' }}
                >
                  {category.nodes.length}
                </span>
              </button>

              {isExpanded && (
                <div className="ml-3 pl-3 space-y-0.5 mt-0.5" style={{ borderLeft: '1px solid var(--color-border)' }}>
                  {category.nodes.map((item) => {
                    const nodeKey = `${key}-${item.label}`;
                    const nodeIsExpanded = expandedNodes.has(nodeKey);
                    return (
                      <div key={nodeKey}>
                        <button
                          onClick={() => toggleNode(nodeKey)}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-150 group"
                          style={{
                            color: nodeIsExpanded ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            background: nodeIsExpanded ? 'var(--color-surface-2)' : 'transparent',
                          }}
                        >
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ background: item.color }}
                            />
                            <div className="text-left min-w-0">
                              <p className="truncate text-sm">{item.label}</p>
                              <p
                                className="text-xs truncate"
                                style={{ color: 'var(--color-text-ghost)' }}
                              >
                                {item.detail}
                              </p>
                            </div>
                          </div>
                          {nodeIsExpanded ? (
                            <ChevronDown className="h-3 w-3 flex-shrink-0" style={{ color: 'var(--color-text-ghost)' }} />
                          ) : (
                            <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-text-ghost)' }} />
                          )}
                        </button>

                        {nodeIsExpanded && (
                          <div className="ml-4 pl-3 space-y-0.5 py-1" style={{ borderLeft: '1px solid var(--color-border-subtle)' }}>
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
                                className="w-full group/service flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg transition-all duration-150"
                                style={{
                                  color: 'var(--color-text-muted)',
                                }}
                                onMouseEnter={(e) => {
                                  (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)';
                                  (e.currentTarget as HTMLElement).style.color = 'var(--color-text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                                  (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
                                }}
                              >
                                <span className="truncate">{service}</span>
                                <PlusCircle
                                  className="h-3.5 w-3.5 flex-shrink-0 opacity-0 group-hover/service:opacity-100 transition-opacity duration-150"
                                  style={{ color: 'var(--color-accent)' }}
                                />
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
    </div>
  );
}

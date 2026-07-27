"use client";
import { ComposeConfig, ServiceConfig } from "@/types/compose";
import { ServiceCard } from "./ServiceCard";
import { generateId } from "@/lib/utils";
import { Plus, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComposeFormProps {
  config: ComposeConfig;
  onChange: (config: ComposeConfig) => void;
}

function createDefaultService(): ServiceConfig {
  return {
    id: generateId(),
    name: "service",
    preset: "custom",
    image: "",
    useDockerfile: false,
    dockerfilePath: "Dockerfile",
    ports: [],
    environment: [],
    volumes: [],
    dependsOn: [],
    restart: "unless-stopped",
    networks: [],
    containerName: "",
    command: "",
  };
}

function Input({ id, value, onChange, placeholder }: {
  id?: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded px-3 py-2 text-sm transition-colors duration-150"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        outline: "none",
      }}
      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
    />
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1" style={{ background: "var(--border-muted)" }} />
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-subtle)" }}>{label}</span>
      <div className="h-px flex-1" style={{ background: "var(--border-muted)" }} />
    </div>
  );
}

export function ComposeForm({ config, onChange }: ComposeFormProps) {
  const update = <K extends keyof ComposeConfig>(key: K, value: ComposeConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const addService = () => {
    const newService = createDefaultService();
    newService.name = `service-${config.services.length + 1}`;
    update("services", [...config.services, newService]);
  };

  const updateService = (index: number, updated: ServiceConfig) => {
    const services = [...config.services];
    services[index] = updated;
    update("services", services);
  };

  const removeService = (index: number) => {
    update("services", config.services.filter((_, i) => i !== index));
  };

  const allServiceNames = config.services.map((s) => s.name).filter(Boolean);

  return (
    <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 260px)" }}>

      {/* Project Settings */}
      <div className="space-y-3">
        <Divider label="Project Settings" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Project Name</label>
            <Input id="project-name" value={config.projectName} onChange={(v) => update("projectName", v)} placeholder="my-project" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>Compose Version</label>
            <select
              value={config.version}
              onChange={(e) => update("version", e.target.value)}
              className="w-full rounded px-3 py-2 text-sm transition-all"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                outline: "none",
              }}
            >
              <option value="3.9" style={{ background: "var(--bg-panel)" }}>3.9 (latest)</option>
              <option value="3.8" style={{ background: "var(--bg-panel)" }}>3.8</option>
              <option value="3.7" style={{ background: "var(--bg-panel)" }}>3.7</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={13} style={{ color: "var(--accent)" }} />
            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Services</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-bold"
              style={{ background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
            >
              {config.services.length}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {config.services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              allServiceNames={allServiceNames}
              onChange={(updated) => updateService(index, updated)}
              onRemove={() => removeService(index)}
            />
          ))}

          <button
            onClick={addService}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded text-sm font-medium transition-colors duration-150"
            style={{ border: "1px dashed var(--border)", color: "var(--text-subtle)", background: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-border)";
              e.currentTarget.style.color = "var(--accent)";
              e.currentTarget.style.background = "var(--accent-dim)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-subtle)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Plus size={13} />
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import { DockerfileConfig, EnvVar } from "@/types/dockerfile";
import { FRAMEWORK_TEMPLATES } from "@/lib/generators/templates";
import { FrameworkSelector } from "./FrameworkSelector";
import { cn } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import { generateId } from "@/lib/utils";

interface DockerfileFormProps {
  config: DockerfileConfig;
  onChange: (config: DockerfileConfig) => void;
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium mb-1" style={{ color: "var(--text-muted)" }}>
      {children}
    </label>
  );
}

function Input({
  id, value, onChange, type = "text", placeholder, className,
}: {
  id?: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string; className?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full rounded px-3 py-2 text-sm transition-colors duration-150", className)}
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

function Toggle({ checked, onChange, label, description }: {
  checked: boolean; onChange: (v: boolean) => void; label: string; description?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 px-3 py-2.5 rounded cursor-pointer transition-colors duration-150"
      style={{ border: "1px solid var(--border)", background: checked ? "rgba(13,183,237,0.04)" : "var(--bg-elevated)" }}
      onClick={() => onChange(!checked)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onChange(!checked)}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-subtle)" }}>{description}</p>}
      </div>
      <div
        className="relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0"
        style={{ background: checked ? "var(--accent)" : "var(--border)" }}
      >
        <div
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }}
        />
      </div>
    </div>
  );
}

function Select({ id, value, onChange, options }: {
  id?: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded px-3 py-2 text-sm transition-colors duration-150"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
        outline: "none",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} style={{ background: "var(--bg-panel)" }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 my-1">
      <div className="h-px flex-1" style={{ background: "var(--border-muted)" }} />
      <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-subtle)" }}>{label}</span>
      <div className="h-px flex-1" style={{ background: "var(--border-muted)" }} />
    </div>
  );
}

export function DockerfileForm({ config, onChange }: DockerfileFormProps) {
  const fw = FRAMEWORK_TEMPLATES[config.framework];
  const isJsFramework = ["nodejs", "nextjs", "react-vite"].includes(config.framework);

  const update = <K extends keyof DockerfileConfig>(key: K, value: DockerfileConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const handleFrameworkChange = (fwId: DockerfileConfig["framework"]) => {
    const newFw = FRAMEWORK_TEMPLATES[fwId];
    onChange({
      ...config,
      framework: fwId,
      version: newFw.defaultVersion,
      port: newFw.defaultPort,
      buildCommand: newFw.defaultBuildCmd,
      startCommand: newFw.defaultStartCmd,
      workdir: newFw.defaultWorkdir,
      multiStage: newFw.supportsMultiStage,
    });
  };

  const addEnvVar = () => update("envVars", [...config.envVars, { key: "", value: "" }]);

  const updateEnvVar = (index: number, field: keyof EnvVar, value: string) => {
    const newVars = [...config.envVars];
    newVars[index] = { ...newVars[index], [field]: value };
    update("envVars", newVars);
  };

  const removeEnvVar = (index: number) => {
    update("envVars", config.envVars.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 260px)" }}>

      {/* Framework */}
      <div>
        <Divider label="Framework" />
        <FrameworkSelector selected={config.framework} onChange={handleFrameworkChange} />
      </div>

      {/* Configuration */}
      <div className="space-y-3">
        <Divider label="Configuration" />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="version">Version</Label>
            <Select id="version" value={config.version} onChange={(v) => update("version", v)} options={fw.versions.map((v) => ({ value: v, label: v }))} />
          </div>
          <div>
            <Label htmlFor="base-image">Base Image</Label>
            <Select
              id="base-image"
              value={config.baseImage}
              onChange={(v) => update("baseImage", v as DockerfileConfig["baseImage"])}
              options={[
                { value: "alpine", label: "Alpine (smallest)" },
                { value: "slim", label: "Slim (balanced)" },
                { value: "debian", label: "Debian (compat.)" },
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="workdir">Work Directory</Label>
            <Input id="workdir" value={config.workdir} onChange={(v) => update("workdir", v)} placeholder="/app" />
          </div>
          <div>
            <Label htmlFor="port">Port</Label>
            <Input id="port" type="number" value={config.port} onChange={(v) => update("port", parseInt(v) || 3000)} placeholder="3000" />
          </div>
        </div>

        <div>
          <Label htmlFor="build-cmd">Build Command</Label>
          <Input id="build-cmd" value={config.buildCommand} onChange={(v) => update("buildCommand", v)} placeholder="npm run build" className="font-mono text-xs" />
        </div>

        <div>
          <Label htmlFor="start-cmd">Start Command</Label>
          <Input id="start-cmd" value={config.startCommand} onChange={(v) => update("startCommand", v)} placeholder="npm start" className="font-mono text-xs" />
        </div>
      </div>

      {/* Optimizations */}
      <div className="space-y-2">
        <Divider label="Optimizations" />
        {fw.supportsMultiStage && (
          <Toggle checked={config.multiStage} onChange={(v) => update("multiStage", v)} label="Multi-Stage Build" description="Smaller production image" />
        )}
        <Toggle checked={config.nonRootUser} onChange={(v) => update("nonRootUser", v)} label="Non-Root User" description="Run as non-privileged user (security)" />
        <Toggle checked={config.healthCheck} onChange={(v) => update("healthCheck", v)} label="Health Check" description="Docker health check endpoint" />
      </div>

      {/* Health Check Config */}
      {config.healthCheck && (
        <div className="space-y-3">
          <Divider label="Health Check" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hc-path">Endpoint Path</Label>
              <Input id="hc-path" value={config.healthCheckPath} onChange={(v) => update("healthCheckPath", v)} placeholder="/health" />
            </div>
            <div>
              <Label htmlFor="hc-interval">Interval (sec)</Label>
              <Input id="hc-interval" type="number" value={config.healthCheckInterval} onChange={(v) => update("healthCheckInterval", parseInt(v) || 30)} />
            </div>
          </div>
        </div>
      )}

      {/* Environment Variables */}
      <div className="space-y-2">
        <Divider label="Environment Variables" />
        {config.envVars.map((envVar, index) => (
          <div key={index} className="flex gap-2">
            <Input value={envVar.key} onChange={(v) => updateEnvVar(index, "key", v)} placeholder="KEY" className="flex-1 font-mono text-xs" />
            <Input value={envVar.value} onChange={(v) => updateEnvVar(index, "value", v)} placeholder="value" className="flex-1 font-mono text-xs" />
            <button
              onClick={() => removeEnvVar(index)}
              className="p-2 rounded transition-colors flex-shrink-0"
              style={{ color: "var(--text-subtle)", border: "1px solid var(--border)", background: "var(--bg-elevated)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#f85149"; e.currentTarget.style.borderColor = "rgba(248,81,73,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-subtle)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              aria-label="Remove variable"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={addEnvVar}
          className="w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-medium transition-colors duration-150"
          style={{ border: "1px dashed var(--border)", color: "var(--text-subtle)", background: "transparent" }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-border)"; e.currentTarget.style.color = "var(--accent)"; e.currentTarget.style.background = "var(--accent-dim)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-subtle)"; e.currentTarget.style.background = "transparent"; }}
        >
          <Plus size={12} />
          Add Variable
        </button>
      </div>
    </div>
  );
}

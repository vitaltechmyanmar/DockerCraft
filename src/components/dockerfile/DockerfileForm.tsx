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
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-400 mb-1.5">
      {children}
    </label>
  );
}

function Input({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
}: {
  id?: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2.5 text-sm text-slate-200 placeholder:text-slate-600",
        "focus:outline-none focus:border-docker-blue/50 focus:ring-1 focus:ring-docker-blue/20 transition-all duration-200",
        className
      )}
    />
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div
      className="flex items-center justify-between gap-4 p-3 sm:p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.99]"
      onClick={() => onChange(!checked)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onChange(!checked)}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
          checked ? "bg-docker-blue" : "bg-slate-700"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
            checked ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </div>
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2.5 text-sm text-slate-200",
        "focus:outline-none focus:border-docker-blue/50 focus:ring-1 focus:ring-docker-blue/20 transition-all duration-200",
        "[&>option]:bg-slate-900 [&>option]:text-base"
      )}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-px flex-1 bg-white/[0.08]" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        {children}
      </span>
      <div className="h-px flex-1 bg-white/[0.08]" />
    </div>
  );
}

export function DockerfileForm({ config, onChange }: DockerfileFormProps) {
  const fw = FRAMEWORK_TEMPLATES[config.framework];

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

  const addEnvVar = () => {
    update("envVars", [...config.envVars, { key: "", value: "" }]);
  };

  const updateEnvVar = (index: number, field: keyof EnvVar, value: string) => {
    const newVars = [...config.envVars];
    newVars[index] = { ...newVars[index], [field]: value };
    update("envVars", newVars);
  };

  const removeEnvVar = (index: number) => {
    update("envVars", config.envVars.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-5 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 280px)" }}>
      {/* Framework */}
      <div>
        <SectionTitle>Framework</SectionTitle>
        <FrameworkSelector selected={config.framework} onChange={handleFrameworkChange} />
      </div>

      {/* Base Config */}
      <div>
        <SectionTitle>Configuration</SectionTitle>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="version">Version</Label>
              <Select
                id="version"
                value={config.version}
                onChange={(v) => update("version", v)}
                options={fw.versions.map((v) => ({ value: v, label: v }))}
              />
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
              <Label htmlFor="workdir">Working Directory</Label>
              <Input
                id="workdir"
                value={config.workdir}
                onChange={(v) => update("workdir", v)}
                placeholder="/app"
              />
            </div>
            <div>
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                value={config.port}
                onChange={(v) => update("port", parseInt(v) || 3000)}
                placeholder="3000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="build-cmd">Build Command</Label>
            <Input
              id="build-cmd"
              value={config.buildCommand}
              onChange={(v) => update("buildCommand", v)}
              placeholder="npm run build"
              className="font-mono text-xs"
            />
          </div>

          <div>
            <Label htmlFor="start-cmd">Start Command</Label>
            <Input
              id="start-cmd"
              value={config.startCommand}
              onChange={(v) => update("startCommand", v)}
              placeholder="npm start"
              className="font-mono text-xs"
            />
          </div>
        </div>
      </div>

      {/* Optimizations */}
      <div>
        <SectionTitle>Optimizations</SectionTitle>
        <div className="space-y-2">
          {fw.supportsMultiStage && (
            <Toggle
              checked={config.multiStage}
              onChange={(v) => update("multiStage", v)}
              label="Multi-Stage Build"
              description="Smaller production image by separating build & runtime"
            />
          )}
          <Toggle
            checked={config.nonRootUser}
            onChange={(v) => update("nonRootUser", v)}
            label="Non-Root User"
            description="Run container as non-privileged user (security)"
          />
          <Toggle
            checked={config.healthCheck}
            onChange={(v) => update("healthCheck", v)}
            label="Health Check"
            description="Docker health check endpoint"
          />
        </div>
      </div>

      {/* Health Check Config */}
      {config.healthCheck && (
        <div>
          <SectionTitle>Health Check</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="hc-path">Endpoint Path</Label>
              <Input
                id="hc-path"
                value={config.healthCheckPath}
                onChange={(v) => update("healthCheckPath", v)}
                placeholder="/health"
              />
            </div>
            <div>
              <Label htmlFor="hc-interval">Interval (sec)</Label>
              <Input
                id="hc-interval"
                type="number"
                value={config.healthCheckInterval}
                onChange={(v) => update("healthCheckInterval", parseInt(v) || 30)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Environment Variables */}
      <div>
        <SectionTitle>Environment Variables</SectionTitle>
        <div className="space-y-2">
          {config.envVars.map((envVar, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={envVar.key}
                onChange={(v) => updateEnvVar(index, "key", v)}
                placeholder="KEY"
                className="flex-1 font-mono text-xs"
              />
              <Input
                value={envVar.value}
                onChange={(v) => updateEnvVar(index, "value", v)}
                placeholder="value"
                className="flex-1 font-mono text-xs"
              />
              <button
                onClick={() => removeEnvVar(index)}
                className="p-2.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 flex-shrink-0"
                aria-label="Remove variable"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
          <button
            onClick={addEnvVar}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-slate-500 hover:text-slate-300 hover:border-docker-blue/30 hover:bg-docker-blue/5 transition-all duration-200 text-xs font-medium"
          >
            <Plus size={13} />
            Add Variable
          </button>
        </div>
      </div>
    </div>
  );
}

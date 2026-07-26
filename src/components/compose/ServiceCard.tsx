"use client";
import { ServiceConfig, ServicePreset, PortMapping, VolumeMount } from "@/types/compose";
import { EnvVar } from "@/types/dockerfile";
import { SERVICE_PRESETS } from "@/lib/generators/templates";
import { cn } from "@/lib/utils";
import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ServiceCardProps {
  service: ServiceConfig;
  allServiceNames: string[];
  onChange: (service: ServiceConfig) => void;
  onRemove: () => void;
}

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-medium text-slate-400 mb-1">
      {children}
    </label>
  );
}

function Input({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  id?: string;
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
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
        "focus:outline-none focus:border-docker-blue/50 focus:ring-1 focus:ring-docker-blue/20 transition-all duration-200"
      )}
    />
  );
}

const PRESET_OPTIONS: { value: ServicePreset; label: string; icon: string }[] = [
  { value: "custom", label: "Custom", icon: "⚙️" },
  { value: "postgres", label: "PostgreSQL", icon: "🐘" },
  { value: "mysql", label: "MySQL", icon: "🐬" },
  { value: "mongodb", label: "MongoDB", icon: "🍃" },
  { value: "redis", label: "Redis", icon: "🔴" },
  { value: "nginx", label: "Nginx", icon: "🌐" },
  { value: "rabbitmq", label: "RabbitMQ", icon: "🐰" },
  { value: "elasticsearch", label: "Elastic", icon: "🔍" },
];

export function ServiceCard({ service, allServiceNames, onChange, onRemove }: ServiceCardProps) {
  const [expanded, setExpanded] = useState(true);

  const update = <K extends keyof ServiceConfig>(key: K, value: ServiceConfig[K]) => {
    onChange({ ...service, [key]: value });
  };

  const handlePresetChange = (preset: ServicePreset) => {
    if (preset === "custom") {
      onChange({ ...service, preset, image: "", useDockerfile: false });
      return;
    }
    const presetData = SERVICE_PRESETS[preset];
    if (presetData) {
      onChange({
        ...service,
        preset,
        image: presetData.image,
        useDockerfile: false,
        environment: presetData.environment,
        ports: presetData.ports,
        volumes: presetData.volumes,
      });
    }
  };

  const addPort = () => update("ports", [...service.ports, { host: 8080, container: 8080 }]);
  const removePort = (i: number) => update("ports", service.ports.filter((_, idx) => idx !== i));
  const updatePort = (i: number, field: keyof PortMapping, val: string) => {
    const ports = [...service.ports];
    ports[i] = { ...ports[i], [field]: parseInt(val) || 0 };
    update("ports", ports);
  };

  const addEnv = () => update("environment", [...service.environment, { key: "", value: "" }]);
  const removeEnv = (i: number) => update("environment", service.environment.filter((_, idx) => idx !== i));
  const updateEnv = (i: number, field: keyof EnvVar, val: string) => {
    const envs = [...service.environment];
    envs[i] = { ...envs[i], [field]: val };
    update("environment", envs);
  };

  const addVolume = () => update("volumes", [...service.volumes, { source: "", target: "" }]);
  const removeVolume = (i: number) => update("volumes", service.volumes.filter((_, idx) => idx !== i));
  const updateVolume = (i: number, field: keyof VolumeMount, val: string) => {
    const vols = [...service.volumes];
    vols[i] = { ...vols[i], [field]: val };
    update("volumes", vols);
  };

  const PRESET_ICONS: Record<ServicePreset, string> = {
    custom: "⚙️", postgres: "🐘", mysql: "🐬", mongodb: "🍃",
    redis: "🔴", nginx: "🌐", rabbitmq: "🐰", elasticsearch: "🔍",
  };

  return (
    <div className="border border-white/[0.08] rounded-xl bg-white/[0.02] overflow-hidden transition-all duration-200 hover:border-white/[0.12]">
      {/* Header */}
      <div
        className="flex items-center justify-between p-3.5 sm:p-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-docker-blue/10 border border-docker-blue/20 flex items-center justify-center text-sm flex-shrink-0">
            {PRESET_ICONS[service.preset]}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{service.name || "unnamed-service"}</p>
            <p className="text-xs text-slate-500 truncate">{service.image || (service.useDockerfile ? "build from Dockerfile" : "no image set")}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            aria-label="Remove service"
          >
            <Trash2 size={13} />
          </button>
          {expanded
            ? <ChevronUp size={15} className="text-slate-500" />
            : <ChevronDown size={15} className="text-slate-500" />
          }
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-3.5 sm:px-4 pb-4 space-y-4 border-t border-white/[0.05]">
          {/* Preset Grid — 4 cols always, but icons only on very small */}
          <div className="pt-4">
            <Label>Service Preset</Label>
            <div className="grid grid-cols-4 gap-1.5">
              {PRESET_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handlePresetChange(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg border text-center transition-all duration-200",
                    service.preset === opt.value
                      ? "border-docker-blue/50 bg-docker-blue/10 text-docker-blue shadow-[0_0_12px_rgba(13,183,237,0.1)]"
                      : "border-white/10 bg-transparent text-slate-400 hover:border-white/20 hover:text-slate-200 hover:bg-white/[0.03]"
                  )}
                >
                  <span className="text-sm sm:text-base">{opt.icon}</span>
                  <span className="text-[9px] sm:text-[10px] font-medium leading-tight">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Basic fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor={`svc-name-${service.id}`}>Service Name</Label>
              <Input
                id={`svc-name-${service.id}`}
                value={service.name}
                onChange={(v) => update("name", v)}
                placeholder="app"
              />
            </div>
            <div>
              <Label htmlFor={`svc-cname-${service.id}`}>Container Name</Label>
              <Input
                id={`svc-cname-${service.id}`}
                value={service.containerName}
                onChange={(v) => update("containerName", v)}
                placeholder="my-app"
              />
            </div>
          </div>

          {/* Image / Build toggle */}
          <div>
            <div className="flex items-center gap-1 mb-2 p-1 rounded-lg bg-white/[0.03] border border-white/[0.08] w-fit">
              <button
                onClick={() => update("useDockerfile", false)}
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-md transition-all",
                  !service.useDockerfile
                    ? "bg-docker-blue/20 text-docker-blue shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Use Image
              </button>
              <button
                onClick={() => update("useDockerfile", true)}
                className={cn(
                  "text-xs font-medium px-2.5 py-1 rounded-md transition-all",
                  service.useDockerfile
                    ? "bg-docker-blue/20 text-docker-blue shadow-sm"
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                Dockerfile
              </button>
            </div>
            {service.useDockerfile ? (
              <Input
                value={service.dockerfilePath}
                onChange={(v) => update("dockerfilePath", v)}
                placeholder="Dockerfile"
              />
            ) : (
              <Input
                value={service.image}
                onChange={(v) => update("image", v)}
                placeholder="nginx:alpine"
              />
            )}
          </div>

          {/* Restart Policy */}
          <div>
            <Label>Restart Policy</Label>
            <select
              value={service.restart}
              onChange={(e) => update("restart", e.target.value as ServiceConfig["restart"])}
              className="w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2.5 text-sm text-slate-200 [&>option]:bg-slate-900 focus:outline-none focus:border-docker-blue/50"
            >
              <option value="no">no</option>
              <option value="always">always</option>
              <option value="unless-stopped">unless-stopped</option>
              <option value="on-failure">on-failure</option>
            </select>
          </div>

          {/* Ports */}
          <div>
            <Label>Port Mappings</Label>
            <div className="space-y-2">
              {service.ports.map((port, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={port.host} onChange={(v) => updatePort(i, "host", v)} placeholder="Host" type="number" />
                  <span className="text-slate-500 text-xs flex-shrink-0">→</span>
                  <Input value={port.container} onChange={(v) => updatePort(i, "container", v)} placeholder="Container" type="number" />
                  <button
                    onClick={() => removePort(i)}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                    aria-label="Remove port"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={addPort}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-white/15 text-slate-500 hover:text-slate-300 hover:border-white/25 hover:bg-white/[0.02] transition-all text-xs"
              >
                <Plus size={12} /> Add Port
              </button>
            </div>
          </div>

          {/* Environment Variables */}
          <div>
            <Label>Environment Variables</Label>
            <div className="space-y-2">
              {service.environment.map((env, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={env.key} onChange={(v) => updateEnv(i, "key", v)} placeholder="KEY" />
                  <Input value={env.value} onChange={(v) => updateEnv(i, "value", v)} placeholder="value" />
                  <button
                    onClick={() => removeEnv(i)}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                    aria-label="Remove variable"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={addEnv}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-white/15 text-slate-500 hover:text-slate-300 hover:border-white/25 hover:bg-white/[0.02] transition-all text-xs"
              >
                <Plus size={12} /> Add Variable
              </button>
            </div>
          </div>

          {/* Volumes */}
          <div>
            <Label>Volume Mounts</Label>
            <div className="space-y-2">
              {service.volumes.map((vol, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input value={vol.source} onChange={(v) => updateVolume(i, "source", v)} placeholder="./data" />
                  <span className="text-slate-500 text-xs flex-shrink-0">→</span>
                  <Input value={vol.target} onChange={(v) => updateVolume(i, "target", v)} placeholder="/app/data" />
                  <button
                    onClick={() => removeVolume(i)}
                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                    aria-label="Remove volume"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              <button
                onClick={addVolume}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-white/15 text-slate-500 hover:text-slate-300 hover:border-white/25 hover:bg-white/[0.02] transition-all text-xs"
              >
                <Plus size={12} /> Add Volume
              </button>
            </div>
          </div>

          {/* Depends On */}
          {allServiceNames.filter((n) => n !== service.name).length > 0 && (
            <div>
              <Label>Depends On</Label>
              <div className="flex flex-wrap gap-2">
                {allServiceNames
                  .filter((n) => n !== service.name)
                  .map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        const deps = service.dependsOn.includes(n)
                          ? service.dependsOn.filter((d) => d !== n)
                          : [...service.dependsOn, n];
                        update("dependsOn", deps);
                      }}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium border transition-all",
                        service.dependsOn.includes(n)
                          ? "bg-docker-blue/20 border-docker-blue/50 text-docker-blue"
                          : "bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                      )}
                    >
                      {n}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

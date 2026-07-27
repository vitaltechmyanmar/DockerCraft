"use client";
import { ComposeConfig, ServiceConfig } from "@/types/compose";
import { ServiceCard } from "./ServiceCard";
import { generateId } from "@/lib/utils";
import { Plus, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

function Input({
  id,
  value,
  onChange,
  placeholder,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
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
    <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 280px)" }}>
      {/* Project Config */}
      <div className="space-y-3 p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Project Settings</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Project Name</label>
            <Input
              id="project-name"
              value={config.projectName}
              onChange={(v) => update("projectName", v)}
              placeholder="my-project"
            />
          </div>
          <div>
            <label
              className={cn(
                "block text-xs font-medium mb-1.5 transition-colors",
                config.useV2Spec ? "text-slate-600 line-through" : "text-slate-400"
              )}
            >
              Compose Version
            </label>
            <select
              value={config.version}
              disabled={config.useV2Spec}
              onChange={(e) => update("version", e.target.value)}
              className={cn(
                "w-full rounded-lg bg-white/[0.05] border border-white/10 px-3 py-2.5 text-sm [&>option]:bg-slate-900 focus:outline-none focus:border-docker-blue/50 transition-all",
                config.useV2Spec ? "text-slate-600 cursor-not-allowed opacity-50" : "text-slate-200"
              )}
            >
              <option value="3.9">3.9 (latest)</option>
              <option value="3.8">3.8</option>
              <option value="3.7">3.7</option>
            </select>
          </div>
        </div>

        {/* Compose v2 spec toggle */}
        <div
          className="flex items-center justify-between gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] cursor-pointer hover:bg-white/[0.05] transition-all duration-200 active:scale-[0.99]"
          onClick={() => update("useV2Spec", !config.useV2Spec)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && update("useV2Spec", !config.useV2Spec)}
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-200">Use Compose v2 Spec</p>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Omits the <code className="font-mono text-docker-blue">version:</code> field (modern Compose Spec standard)
            </p>
          </div>
          <div
            className={cn(
              "relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0",
              config.useV2Spec ? "bg-docker-blue" : "bg-slate-700"
            )}
          >
            <div
              className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200",
                config.useV2Spec ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </div>
        </div>
      </div>

      {/* Services Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-docker-blue" />
          <span className="text-sm font-medium text-slate-300">Services</span>
          <span className="px-2 py-0.5 rounded-full bg-docker-blue/10 border border-docker-blue/20 text-docker-blue text-xs font-bold">
            {config.services.length}
          </span>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {config.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ServiceCard
                service={service}
                allServiceNames={allServiceNames}
                onChange={(updated) => updateService(index, updated)}
                onRemove={() => removeService(index)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={addService}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-docker-blue/30 text-docker-blue hover:bg-docker-blue/5 hover:border-docker-blue/50 transition-all duration-200 text-sm font-medium"
        >
          <Plus size={15} />
          Add Service
        </button>
      </div>
    </div>
  );
}

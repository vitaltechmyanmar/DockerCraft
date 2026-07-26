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
        "w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600",
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
    <div className="space-y-4 overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 220px)" }}>
      {/* Project Config */}
      <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/10">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Project Settings</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Project Name</label>
            <Input
              id="project-name"
              value={config.projectName}
              onChange={(v) => update("projectName", v)}
              placeholder="my-project"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Compose Version</label>
            <select
              value={config.version}
              onChange={(e) => update("version", e.target.value)}
              className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm text-slate-200 [&>option]:bg-slate-900 focus:outline-none focus:border-docker-blue/50"
            >
              <option value="3.9">3.9 (latest)</option>
              <option value="3.8">3.8</option>
              <option value="3.7">3.7</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-docker-blue" />
            <span className="text-sm font-medium text-slate-300">Services</span>
            <span className="px-2 py-0.5 rounded-full bg-docker-blue/10 text-docker-blue text-xs font-bold">
              {config.services.length}
            </span>
          </div>
        </div>

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
          <Plus size={16} />
          Add Service
        </button>
      </div>
    </div>
  );
}

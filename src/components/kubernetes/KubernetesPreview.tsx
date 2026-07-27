"use client";

import { useMemo, useState, useCallback } from "react";
import {
  Box,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  CheckCircleOutline,
  ContentCopy,
  Download,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import yaml from "react-syntax-highlighter/dist/esm/languages/hljs/yaml";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { generateKubernetes } from "@/lib/generators/kubernetes";
import { generateHelmChart } from "@/lib/generators/helm";
import { ComposeConfig } from "@/types/compose";
import { downloadFile } from "@/lib/utils";
import { HelmExportButton } from "./HelmExportButton";

SyntaxHighlighter.registerLanguage("yaml", yaml);

const DOCKER_BLUE = "#0db7ed";
const BG_ELEVATED = "#1c2230";
const BORDER = "#2a3344";
const TEXT_SECONDARY = "#7d8fa3";

type KubeTab = "kubernetes" | "helm-values" | "helm-deployment" | "helm-service";

interface KubernetesPreviewProps {
  config: ComposeConfig;
}

export function KubernetesPreview({ config }: KubernetesPreviewProps) {
  const [tab, setTab] = useState<KubeTab>("kubernetes");
  const [copied, setCopied] = useState(false);

  const k8sOutput = useMemo(() => generateKubernetes(config), [config]);
  const helmFiles = useMemo(() => generateHelmChart(config), [config]);

  const currentContent = useMemo(() => {
    switch (tab) {
      case "kubernetes":
        return k8sOutput;
      case "helm-values":
        return helmFiles.find((f) => f.path === "values.yaml")?.content ?? "";
      case "helm-deployment":
        return helmFiles.find((f) => f.path === "templates/deployment.yaml")?.content ?? "";
      case "helm-service":
        return helmFiles.find((f) => f.path === "templates/service.yaml")?.content ?? "";
    }
  }, [tab, k8sOutput, helmFiles]);

  const currentFilename = useMemo(() => {
    switch (tab) {
      case "kubernetes": return "k8s-manifests.yaml";
      case "helm-values": return "values.yaml";
      case "helm-deployment": return "templates/deployment.yaml";
      case "helm-service": return "templates/service.yaml";
    }
  }, [tab]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentContent]);

  const handleDownload = useCallback(() => {
    downloadFile(currentContent, currentFilename, "text/yaml");
  }, [currentContent, currentFilename]);

  const TAB_ITEMS: { value: KubeTab; label: string }[] = [
    { value: "kubernetes",      label: "k8s-manifests.yaml" },
    { value: "helm-values",     label: "values.yaml" },
    { value: "helm-deployment", label: "deployment.yaml" },
    { value: "helm-service",    label: "service.yaml" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", gap: 0 }}>
      {/* Tab bar + actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${BORDER}`,
          px: 1,
          minHeight: 40,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 40,
            "& .MuiTabs-indicator": { backgroundColor: DOCKER_BLUE, height: 2 },
          }}
        >
          {TAB_ITEMS.map(({ value, label }) => (
            <Tab
              key={value}
              value={value}
              label={label}
              sx={{
                minHeight: 40,
                px: 1.5,
                fontSize: "0.68rem",
                fontWeight: 500,
                fontFamily: "monospace",
                textTransform: "none",
                color: TEXT_SECONDARY,
                "&.Mui-selected": { color: DOCKER_BLUE },
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
          <HelmExportButton config={config} helmFiles={generateHelmChart(config)} />
          <Tooltip title="Copy">
            <IconButton size="small" onClick={handleCopy} sx={{ color: TEXT_SECONDARY, p: 0.75 }}>
              {copied ? (
                <CheckCircleOutline sx={{ fontSize: 16, color: "#3fb950" }} />
              ) : (
                <ContentCopy sx={{ fontSize: 16 }} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={`Download ${currentFilename}`}>
            <IconButton size="small" onClick={handleDownload} sx={{ color: TEXT_SECONDARY, p: 0.75 }}>
              <Download sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Code output */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          background: BG_ELEVATED,
          borderRadius: 1,
          mt: 1,
          fontSize: "12px",
          lineHeight: 1.6,
        }}
      >
        <SyntaxHighlighter
          language="yaml"
          style={atomOneDark}
          customStyle={{
            margin: 0,
            padding: "14px 16px",
            background: "transparent",
            fontSize: "12px",
            lineHeight: "1.6",
          }}
          showLineNumbers
          lineNumberStyle={{ color: "#3a4a5e", userSelect: "none", minWidth: 32 }}
        >
          {currentContent}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
}

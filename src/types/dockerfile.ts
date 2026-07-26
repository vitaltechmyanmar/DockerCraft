export interface EnvVar {
  key: string;
  value: string;
}

export type BaseImage =
  | "alpine"
  | "slim"
  | "debian"
  | "ubuntu"
  | "scratch";

export type FrameworkId =
  | "nodejs"
  | "nextjs"
  | "react-vite"
  | "bun"
  | "python-fastapi"
  | "python-django"
  | "python-flask"
  | "go"
  | "java-spring"
  | "php-laravel"
  | "rust"
  | "ruby-rails"
  | "nginx"
  | "static";

export interface FrameworkTemplate {
  id: FrameworkId;
  label: string;
  category: string;
  icon: string;
  color: string;
  defaultVersion: string;
  versions: string[];
  defaultPort: number;
  defaultBuildCmd: string;
  defaultStartCmd: string;
  defaultWorkdir: string;
  supportsMultiStage: boolean;
  packageManager: "npm" | "yarn" | "pnpm" | "pip" | "go" | "cargo" | "maven" | "gradle" | "composer" | "bundle" | "none";
}

export interface DockerfileConfig {
  framework: FrameworkId;
  version: string;
  baseImage: BaseImage;
  workdir: string;
  port: number;
  envVars: EnvVar[];
  buildCommand: string;
  startCommand: string;
  multiStage: boolean;
  nonRootUser: boolean;
  healthCheck: boolean;
  healthCheckPath: string;
  healthCheckInterval: number;
  dockerignoreContent?: string;
}

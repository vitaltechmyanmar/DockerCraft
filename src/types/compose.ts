export interface EnvVar {
  key: string;
  value: string;
}

export interface VolumeMount {
  source: string;
  target: string;
}

export interface PortMapping {
  host: number;
  container: number;
}

export type RestartPolicy =
  | "no"
  | "always"
  | "unless-stopped"
  | "on-failure";

export type ServicePreset =
  | "custom"
  | "postgres"
  | "mysql"
  | "mongodb"
  | "redis"
  | "nginx"
  | "rabbitmq"
  | "elasticsearch";

export interface ServiceConfig {
  id: string;
  name: string;
  preset: ServicePreset;
  image: string;
  useDockerfile: boolean;
  dockerfilePath: string;
  ports: PortMapping[];
  environment: EnvVar[];
  volumes: VolumeMount[];
  dependsOn: string[];
  restart: RestartPolicy;
  networks: string[];
  containerName: string;
  command: string;
}

export interface ComposeConfig {
  version: string;
  projectName: string;
  services: ServiceConfig[];
  networks: string[];
  volumes: string[];
}

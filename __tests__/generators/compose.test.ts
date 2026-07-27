import { generateCompose } from "@/lib/generators/compose";
import { ComposeConfig } from "@/types/compose";

const baseConfig: ComposeConfig = {
  version: "3.9",
  projectName: "testapp",
  services: [
    {
      id: "svc-1",
      name: "app",
      preset: "custom",
      image: "",
      useDockerfile: true,
      dockerfilePath: "Dockerfile",
      ports: [{ host: 3000, container: 3000 }],
      environment: [{ key: "NODE_ENV", value: "production" }],
      volumes: [],
      dependsOn: ["db"],
      restart: "unless-stopped",
      networks: ["app-network"],
      containerName: "my-app",
      command: "",
    },
    {
      id: "svc-2",
      name: "db",
      preset: "postgres",
      image: "postgres:16-alpine",
      useDockerfile: false,
      dockerfilePath: "Dockerfile",
      ports: [{ host: 5432, container: 5432 }],
      environment: [
        { key: "POSTGRES_USER", value: "postgres" },
        { key: "POSTGRES_PASSWORD", value: "password" },
        { key: "POSTGRES_DB", value: "mydb" },
      ],
      volumes: [{ source: "postgres_data", target: "/var/lib/postgresql/data" }],
      dependsOn: [],
      restart: "unless-stopped",
      networks: ["app-network"],
      containerName: "my-db",
      command: "",
    },
  ],
  networks: ["app-network"],
  volumes: ["postgres_data"],
};

// ─── generateCompose ──────────────────────────────────────────────────────────

describe("generateCompose", () => {
  it("includes project name", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("name: testapp");
  });

  it("renders services block", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("services:");
    expect(out).toContain("  app:");
    expect(out).toContain("  db:");
  });

  it("uses build context for services with useDockerfile=true", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("    build:");
    expect(out).toContain("      context: .");
  });

  it("uses image for services with useDockerfile=false", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("    image: postgres:16-alpine");
  });

  it("renders port mappings", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain('"3000:3000"');
    expect(out).toContain('"5432:5432"');
  });

  it("renders environment variables", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("- NODE_ENV=production");
    expect(out).toContain("- POSTGRES_USER=postgres");
  });

  it("renders volume mounts", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("- postgres_data:/var/lib/postgresql/data");
  });

  it("renders depends_on", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("    depends_on:");
    expect(out).toContain("      - db");
  });

  it("renders named networks section", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("networks:");
    expect(out).toContain("  app-network:");
  });

  it("renders named volumes section from service mounts", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("volumes:");
    expect(out).toContain("  postgres_data:");
  });

  it("renders container_name", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("    container_name: my-app");
    expect(out).toContain("    container_name: my-db");
  });

  it("renders restart policy", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("    restart: unless-stopped");
  });

  it("does not render version key (compose v2 style)", () => {
    const out = generateCompose(baseConfig);
    // Modern compose files don't need a version key
    // The generator currently doesn't output it either
    expect(out).not.toMatch(/^version:/m);
  });

  it("renders networks on services", () => {
    const out = generateCompose(baseConfig);
    expect(out).toContain("    networks:");
    expect(out).toContain("      - app-network");
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("generateCompose — edge cases", () => {
  it("handles service with no ports gracefully", () => {
    const cfg = {
      ...baseConfig,
      services: [
        {
          ...baseConfig.services[0],
          ports: [],
        },
      ],
    };
    const out = generateCompose(cfg);
    expect(out).not.toContain("    ports:");
  });

  it("handles service with no env vars gracefully", () => {
    const cfg = {
      ...baseConfig,
      services: [
        {
          ...baseConfig.services[0],
          environment: [],
        },
      ],
    };
    const out = generateCompose(cfg);
    expect(out).not.toContain("    environment:");
  });

  it("omits networks section when no named networks", () => {
    const cfg = { ...baseConfig, networks: [] };
    // Only named volumes from services should appear
    const out = generateCompose(cfg);
    // networks: block should not appear when no named networks defined
    const networksSection = out.split("\n").filter((l) => l === "networks:");
    expect(networksSection.length).toBe(0);
  });

  it("does not render path-based volumes in named volumes section", () => {
    const cfg = {
      ...baseConfig,
      services: [
        {
          ...baseConfig.services[0],
          volumes: [{ source: "./data", target: "/data" }],
        },
      ],
    };
    const out = generateCompose(cfg);
    // Path-based mounts (starting with .) should not appear in top-level volumes:
    expect(out).not.toContain("  ./data:");
  });
});

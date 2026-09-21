import type { Config } from "@netlify/functions";

interface HealthResponse {
  status: "ok" | "degraded";
  service: string;
  site: string;
  deployContext: string;
  checks: Record<string, string>;
  timestamp: string;
}

export default async (req: Request, context: Context): Promise<Response> => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return Response.json(
      { error: "Method not allowed. Use GET." },
      { status: 405, headers: { Allow: "GET, HEAD" } },
    );
  }

  const started = Date.now();

  const health: HealthResponse = {
    status: "ok",
    service: "litellm-gateway-console",
    site: context.site.name,
    deployContext: context.deploy.context,
    checks: {
      runtime: "ok",
      respondMs: String(Date.now() - started),
    },
    timestamp: new Date().toISOString(),
  };

  return Response.json(health, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
};

export const config: Config = {
  path: "/api/health",
  method: ["GET", "HEAD"],
};

import { z } from "zod";

export const sendRequestSchema = z.object({
  type: z.literal("VULNERABILITY_ALERT"),
  origin: z.object({
    repo_title: z.string(),
    repo_url: z.string(),
  }),
  destination: z.object({
    kind: z.enum(["CHAT", "CHANNEL"]),
    recipients: z.array(z.string()),
  }),
  dependabot: z.object({
    action: z.enum([
      "created",
      "dismissed",
      "reopened",
      "fixed",
      "reintroduced",
    ]),
    alert_number: z.number().int(),
    state: z.enum(["open", "dismissed", "fixed", "auto_dismissed"]),
    severity: z.enum(["low", "medium", "high", "critical"]),
    package: z.object({ ecosystem: z.string(), name: z.string() }),
    manifest_path: z.string(),
    scope: z.enum(["runtime", "development"]).optional(),
    relationship: z.enum(["direct", "transitive", "unknown"]).optional(),
    vulnerable_version_range: z.string(),
    first_patched_version: z.string().nullish(),
    advisory: z.object({
      ghsa_id: z.string(),
      cve_id: z.string().nullish(),
      summary: z.string(),
      description: z.string().optional(),
      cvss_score: z.number().min(0).max(10).nullish(),
      cwes: z.array(z.string()).optional(),
      references: z.array(z.string()).optional(),
    }),
    alert_url: z.url(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
  }),
});

export type SendRequest = z.infer<typeof sendRequestSchema>;

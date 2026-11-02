import { z } from "zod";

// GET/POST /vulnerability-report のクエリパラメータ
export const querySchema = z.object({
  repoUrl: z.url(),
  // chat / channel の送信先 URL(秘匿情報を含むためログ・レスポンスに出さない)
  destination: z.url({ protocol: /^https$/ }),
});

// dependabot_alert webhook のペイロード(必要なフィールドのみ。未知のキーは無視)
// https://docs.github.com/en/webhooks/webhook-events-and-payloads#dependabot_alert
// alert の中身は REST API の Dependabot alert と同形
// https://docs.github.com/en/rest/dependabot/alerts#get-a-dependabot-alert
const cvss = z.object({ score: z.number().nullish() }).nullish();

const alertSchema = z.object({
  number: z.number().int(),
  state: z.enum(["open", "dismissed", "fixed", "auto_dismissed"]),
  dependency: z.object({
    package: z.object({ ecosystem: z.string(), name: z.string() }),
    manifest_path: z.string(),
    scope: z.enum(["development", "runtime"]).nullish(),
    relationship: z
      .enum(["unknown", "direct", "transitive", "inconclusive"])
      .nullish(),
  }),
  security_advisory: z.object({
    ghsa_id: z.string(),
    cve_id: z.string().nullish(),
    summary: z.string(),
    description: z.string(),
    severity: z.enum(["low", "medium", "high", "critical"]),
    cvss_severities: z.object({ cvss_v3: cvss, cvss_v4: cvss }).nullish(),
    cwes: z.array(z.object({ cwe_id: z.string(), name: z.string() })),
    references: z.array(z.object({ url: z.string() })),
  }),
  security_vulnerability: z.object({
    vulnerable_version_range: z.string(),
    first_patched_version: z.object({ identifier: z.string() }).nullish(),
  }),
  html_url: z.url(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  dismissed_reason: z.string().nullish(),
  dismissed_comment: z.string().nullish(),
});

export const dependabotAlertSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.enum([
      "created",
      "dismissed",
      "reopened",
      "fixed",
      "reintroduced",
      "auto_dismissed",
      "auto_reopened",
      "assignees_changed",
    ]),
    alert: alertSchema,
  }),
  // withdrawn は識別子のみで alert の全体は含まれない
  z.object({ action: z.literal("withdrawn"), alert: z.looseObject({}) }),
]);

export type DependabotAlert = z.infer<typeof dependabotAlertSchema>;

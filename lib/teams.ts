import type { Alert } from "@/lib/dependabot-schema";

const SEVERITY_LABEL = {
  low: "🟢 Low",
  medium: "🟡 Medium",
  high: "🟠 High",
  critical: "🔴 Critical",
} as const;

// 通知対象の action(withdrawn / assignees_changed は通知しない)
export const ACTION_LABEL: Record<string, string> = {
  created: "検出",
  dismissed: "却下",
  reopened: "再オープン",
  fixed: "修正済み",
  reintroduced: "再発",
  auto_dismissed: "自動却下",
  auto_reopened: "自動再オープン",
};

// Teams Workflows webhook は message + attachments 形式を要求する
export function buildMessage(action: string, alert: Alert, repoUrl: string) {
  const { dependency: dep, security_advisory: adv } = alert;
  const vuln = alert.security_vulnerability;
  const repoName = new URL(repoUrl).pathname.slice(1);
  const cvss =
    adv.cvss_severities?.cvss_v4?.score ?? adv.cvss_severities?.cvss_v3?.score;

  const facts = [
    ["重大度", SEVERITY_LABEL[adv.severity]],
    ["パッケージ", `${dep.package.name} (${dep.package.ecosystem})`],
    ["脆弱なバージョン", vuln.vulnerable_version_range],
    ["修正バージョン", vuln.first_patched_version?.identifier ?? "未提供"],
    ["マニフェスト", dep.manifest_path],
    ["スコープ", dep.scope],
    ["依存関係", dep.relationship],
    ["ID", [adv.ghsa_id, adv.cve_id].filter(Boolean).join(" / ")],
    ["CVSS", cvss?.toString()],
    ["CWE", adv.cwes.map((c) => c.cwe_id).join(", ")],
    ["却下理由", alert.dismissed_reason],
  ].flatMap(([title, value]) => (value ? [{ title, value }] : []));

  return {
    type: "message",
    attachments: [
      {
        contentType: "application/vnd.microsoft.card.adaptive",
        content: {
          $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
          type: "AdaptiveCard",
          version: "1.4",
          body: [
            {
              type: "TextBlock",
              text: `Dependabot アラート【${ACTION_LABEL[action]}】${repoName}`,
              weight: "Bolder",
              size: "Medium",
              wrap: true,
            },
            { type: "TextBlock", text: adv.summary, wrap: true },
            { type: "FactSet", facts },
          ],
          actions: [
            {
              type: "Action.OpenUrl",
              title: "アラートを開く",
              url: alert.html_url,
            },
            { type: "Action.OpenUrl", title: "リポジトリ", url: repoUrl },
          ],
        },
      },
    ],
  };
}

export async function postToTeams(url: string, message: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  return res?.ok ?? false;
}

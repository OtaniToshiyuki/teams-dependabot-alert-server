import type { Alert } from "@/lib/dependabot-schema";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// POST /vulnerability-report の送信履歴。destination の URL は秘匿情報のため保存しない。
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  repoUrl: text("repo_url").notNull(),
  alertNumber: integer("alert_number").notNull(),
  action: text("action").notNull(),
  severity: text("severity").notNull(),
  ghsaId: text("ghsa_id").notNull(),
  alert: jsonb("alert").$type<Alert>().notNull(),
  ok: boolean("ok").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

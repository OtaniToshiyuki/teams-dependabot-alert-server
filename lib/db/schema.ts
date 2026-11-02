import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  repo: text("repo").notNull(),
  summary: text("summary").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

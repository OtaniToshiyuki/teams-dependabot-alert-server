import { defineConfig } from "drizzle-kit";

const poolingUrl = process.env.POSTGRES_URL;
if (!poolingUrl) throw new Error("Missing POSTGRES_URL");

const nonPoolingUrl = poolingUrl.replace(":6543", ":5432");

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: nonPoolingUrl },
  casing: "snake_case",
});

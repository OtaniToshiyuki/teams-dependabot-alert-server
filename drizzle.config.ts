import { defineConfig } from "drizzle-kit";

const poolingUrl = process.env.POSTGRES_URL;
if (!poolingUrl) throw new Error("Missing POSTGRES_URL");
// drizzle-kit はプーラー(:6543)ではなく直接接続(:5432)が必要
const url = poolingUrl.replace(":6543", ":5432");

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  casing: "snake_case",
});

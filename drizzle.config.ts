import { defineConfig } from "drizzle-kit";

const url = process.env.POSTGRES_URL_NON_POOLING;
if (!url) throw new Error("Missing POSTGRES_URL_NON_POOLING");

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  casing: "snake_case",
});

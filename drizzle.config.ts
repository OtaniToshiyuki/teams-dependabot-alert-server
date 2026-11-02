import { defineConfig } from "drizzle-kit";

const url = process.env.POSTGRES_URL;
if (!url) throw new Error("Missing POSTGRES_URL");

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url },
  casing: "snake_case",
});

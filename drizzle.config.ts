import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load variables from .env
dotenv.config({ path: ".env" });

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./supabase/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});

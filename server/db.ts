import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";

const { Pool } = pg;

const DATABASE_URL =
  typeof process.env.DATABASE_URL === "string" ? process.env.DATABASE_URL.trim() : "";

export const pool =
  DATABASE_URL.length > 0
    ? new Pool({
        connectionString: DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      })
    : null;

if (!pool) {
  console.warn(
    "[db] DATABASE_URL is not set. Server will start, but DB-backed routes will fail until DATABASE_URL is configured.",
  );
} else {
  pool.on("connect", () => {
    console.log("Connected to PostgreSQL database");
  });

  pool.on("error", (error: unknown) => {
    console.error("Database connection error:", error);
  });
}

export const db = pool ? drizzle(pool, { schema }) : null;


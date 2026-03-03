import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

//
// ================= USERS TABLE =================
//
export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),

  role: text("role").notNull().default("user"), // "user" or "admin"

  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;


//
// ================= WEBSITES TABLE =================
//
export const websites = pgTable("websites", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),

  userId: varchar("user_id")
    .notNull()
    .references(() => users.id),

  title: text("title").notNull(),
  theme: text("theme").notNull(),
  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWebsiteSchema = createInsertSchema(websites).pick({
  title: true,
  theme: true,
  content: true,
});

export type InsertWebsite = z.infer<typeof insertWebsiteSchema>;
export type Website = typeof websites.$inferSelect;
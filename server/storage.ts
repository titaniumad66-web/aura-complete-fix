import { db } from "./db";
import { users, websites } from "@shared/schema";
import { eq } from "drizzle-orm";
import { type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createWebsite(data: any): Promise<any>;
  getUserWebsites(userId: string): Promise<any[]>;
  getWebsiteById(id: string): Promise<any | undefined>;
}

export class DatabaseStorage implements IStorage {

  async getUser(id: string) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return result[0];
  }

  async createUser(insertUser: InsertUser) {
    const result = await db
      .insert(users)
      .values({
        ...insertUser,
        role: "user",
        createdAt: new Date().toISOString(),
      })
      .returning();

    return result[0];
  }

  // ✅ CREATE WEBSITE
  async createWebsite(data: any) {
    const result = await db
      .insert(websites)
      .values(data)
      .returning();

    return result[0];
  }

  // ✅ GET USER WEBSITES
  async getUserWebsites(userId: string) {
    return await db
      .select()
      .from(websites)
      .where(eq(websites.userId, userId));
  }

  // ✅ GET WEBSITE BY ID
  async getWebsiteById(id: string) {
    console.log("Searching for ID:", id);

    const result = await db
      .select()
      .from(websites)
      .where(eq(websites.id, id));

    console.log("DB Result:", result);

    return result[0];
  }
}

export const storage = new DatabaseStorage();
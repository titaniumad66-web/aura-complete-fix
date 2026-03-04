import { db } from "./db";
import { templates, users, websites } from "@shared/schema";
import { desc, eq } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Template,
  type InsertTemplate,
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createWebsite(data: any): Promise<any>;
  getUserWebsites(userId: string): Promise<any[]>;
  getWebsiteById(id: string): Promise<any | undefined>;
  getTemplates(): Promise<Template[]>;
  getTemplateById(id: string): Promise<Template | undefined>;
  createTemplate(data: InsertTemplate): Promise<Template>;
  deleteTemplate(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {

  async getUser(id: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id));

    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values({
        ...insertUser,
        role: "user",
      })
      .returning();

    return result[0];
  }

  // CREATE WEBSITE
  async createWebsite(data: any): Promise<any> {
    const result = await db
      .insert(websites)
      .values(data)
      .returning();

    return result[0];
  }

  // GET USER WEBSITES
  async getUserWebsites(userId: string): Promise<any[]> {
    const result = await db
      .select()
      .from(websites)
      .where(eq(websites.userId, userId));

    return result;
  }

  // GET WEBSITE BY ID
  async getWebsiteById(id: string): Promise<any | undefined> {
    const result = await db
      .select()
      .from(websites)
      .where(eq(websites.id, id));

    return result[0];
  }

  async getTemplates(): Promise<Template[]> {
    const result = await db
      .select()
      .from(templates)
      .orderBy(desc(templates.createdAt));

    return result;
  }

  async getTemplateById(id: string): Promise<Template | undefined> {
    const result = await db
      .select()
      .from(templates)
      .where(eq(templates.id, id));

    return result[0];
  }

  async createTemplate(data: InsertTemplate): Promise<Template> {
    const result = await db
      .insert(templates)
      .values(data)
      .returning();

    return result[0];
  }

  async deleteTemplate(id: string): Promise<void> {
    await db.delete(templates).where(eq(templates.id, id));
  }
}

export const storage = new DatabaseStorage();

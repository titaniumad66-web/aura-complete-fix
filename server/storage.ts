import { db } from "./db";
import { templates, users, websites, siteImages, purchases, pricing } from "@shared/schema";
import { desc, eq, and, count, sql } from "drizzle-orm";
import {
  type User,
  type InsertUser,
  type Template,
  type InsertTemplate,
  type SiteImage,
  type InsertSiteImage,
  type Purchase,
  type InsertPurchase,
  type Pricing,
  type InsertPricing,
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

  getSiteImages(sectionName?: string): Promise<SiteImage[]>;
  getSiteImageById(id: string): Promise<SiteImage | undefined>;
  createSiteImage(data: InsertSiteImage): Promise<SiteImage>;
  updateSiteImage(id: string, data: Partial<InsertSiteImage>): Promise<SiteImage | undefined>;
  deleteSiteImage(id: string): Promise<void>;

  getUserWebsiteCount(userId: string): Promise<number>;
  getApprovedPurchaseCount(userId: string, productType: string): Promise<number>;
  getPricing(): Promise<Pricing[]>;
  upsertPricing(productName: string, price: string): Promise<Pricing>;
  createPurchase(data: InsertPurchase): Promise<Purchase>;
  listPurchases(status?: string): Promise<Purchase[]>;
  updatePurchaseStatus(id: string, status: string): Promise<void>;
  setUserFreeUsed(userId: string): Promise<void>;
  isUserFreeUsed(userId: string): Promise<boolean>;
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

  async getSiteImages(sectionName?: string): Promise<SiteImage[]> {
    if (sectionName) {
      const result = await db
        .select()
        .from(siteImages)
        .where(eq(siteImages.sectionName, sectionName))
        .orderBy(desc(siteImages.createdAt));
      return result;
    }
    const result = await db.select().from(siteImages).orderBy(desc(siteImages.createdAt));
    return result;
  }

  async getSiteImageById(id: string): Promise<SiteImage | undefined> {
    const result = await db.select().from(siteImages).where(eq(siteImages.id, id));
    return result[0];
  }

  async createSiteImage(data: InsertSiteImage): Promise<SiteImage> {
    const result = await db.insert(siteImages).values(data).returning();
    return result[0];
  }

  async updateSiteImage(
    id: string,
    data: Partial<InsertSiteImage>,
  ): Promise<SiteImage | undefined> {
    const result = await db.update(siteImages).set(data).where(eq(siteImages.id, id)).returning();
    return result[0];
  }

  async deleteSiteImage(id: string): Promise<void> {
    await db.delete(siteImages).where(eq(siteImages.id, id));
  }

  async getUserWebsiteCount(userId: string): Promise<number> {
    const result = await db.select({ c: count() }).from(websites).where(eq(websites.userId, userId));
    return Number(result[0]?.c ?? 0);
    }

  async getApprovedPurchaseCount(userId: string, productType: string): Promise<number> {
    const result = await db
      .select({ c: count() })
      .from(purchases)
      .where(and(eq(purchases.userId, userId), eq(purchases.productType, productType), eq(purchases.paymentStatus, "approved")));
    return Number(result[0]?.c ?? 0);
  }

  async getPricing(): Promise<Pricing[]> {
    const result = await db.select().from(pricing).orderBy(desc(pricing.createdAt));
    return result;
  }

  async upsertPricing(productName: string, price: string): Promise<Pricing> {
    const existing = await db.select().from(pricing).where(eq(pricing.productName, productName));
    if (existing[0]) {
      const result = await db
        .update(pricing)
        .set({ price })
        .where(eq(pricing.productName, productName))
        .returning();
      return result[0];
    }
    const result = await db.insert(pricing).values({ productName, price }).returning();
    return result[0];
  }

  async createPurchase(data: InsertPurchase): Promise<Purchase> {
    const result = await db.insert(purchases).values(data).returning();
    return result[0];
  }

  async listPurchases(status?: string): Promise<Purchase[]> {
    if (status) {
      const result = await db.select().from(purchases).where(eq(purchases.paymentStatus, status)).orderBy(desc(purchases.createdAt));
      return result;
    }
    const result = await db.select().from(purchases).orderBy(desc(purchases.createdAt));
    return result;
  }

  async updatePurchaseStatus(id: string, status: string): Promise<void> {
    await db.update(purchases).set({ paymentStatus: status }).where(eq(purchases.id, id));
  }

  async setUserFreeUsed(userId: string): Promise<void> {
    await db.update(users).set({ freeWebsiteUsed: true }).where(eq(users.id, userId));
  }

  async isUserFreeUsed(userId: string): Promise<boolean> {
    const result = await db.select({ v: users.freeWebsiteUsed }).from(users).where(eq(users.id, userId));
    return Boolean(result[0]?.v);
  }
}

export const storage = new DatabaseStorage();

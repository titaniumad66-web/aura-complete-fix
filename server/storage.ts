import { db } from "./db.ts";
import { ensureWebsiteUnlockColumns, isMissingWebsiteColumnError } from "./ensureDbSchema.ts";
import { templates, users, websites, siteImages, purchases, pricing } from "../shared/schema";
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
} from "../shared/schema";

function dbc() {
  if (!db) {
    throw new Error("DATABASE_UNAVAILABLE");
  }
  return db;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createWebsite(data: any): Promise<any>;
  updateWebsite(
    id: string,
    data: Partial<{
      content: string;
      unlockAt: Date | null;
      earlyUnlocked: boolean;
      title: string;
      theme: string;
    }>,
  ): Promise<void>;
  deleteWebsite(id: string, userId: string): Promise<boolean>;
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
  listPurchases(status?: string): Promise<
    Array<
      Purchase & {
        userEmail?: string | null;
      }
    >
  >;
  updatePurchaseStatus(id: string, status: string): Promise<void>;
  setUserFreeUsed(userId: string): Promise<void>;
  isUserFreeUsed(userId: string): Promise<boolean>;
  getTotals(): Promise<{
    users: number;
    websites: number;
    purchases: number;
    revenueApproved: number;
    pendingPayments: number;
  }>;
  listUsers(): Promise<Array<Pick<User, "id" | "username" | "email" | "role" | "createdAt">>>;
}

export class DatabaseStorage implements IStorage {

  async getUser(id: string): Promise<User | undefined> {
    const result = await dbc()
      .select()
      .from(users)
      .where(eq(users.id, id));

    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await dbc()
      .select()
      .from(users)
      .where(eq(users.username, username));

    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await dbc()
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
    const insertRow = async (row: Record<string, unknown>) => {
      const result = await dbc().insert(websites).values(row as any).returning();
      return result[0];
    };

    try {
      return await insertRow(data);
    } catch (e) {
      if (!isMissingWebsiteColumnError(e)) throw e;
      console.warn("[storage] createWebsite: missing unlock columns — repairing schema and retrying");
      await ensureWebsiteUnlockColumns();
      try {
        return await insertRow(data);
      } catch (e2) {
        if (!isMissingWebsiteColumnError(e2)) throw e2;
        console.warn("[storage] createWebsite: fallback insert without unlock_at / early_unlocked");
        const { unlockAt: _u, earlyUnlocked: _e, ...minimal } = data as Record<string, unknown>;
        return await insertRow({
          userId: minimal.userId,
          title: minimal.title,
          theme: minimal.theme,
          content: minimal.content,
        });
      }
    }
  }

  async updateWebsite(
    id: string,
    data: Partial<{
      content: string;
      unlockAt: Date | null;
      earlyUnlocked: boolean;
      title: string;
      theme: string;
    }>,
  ): Promise<void> {
    const apply = async (payload: typeof data) => {
      await dbc().update(websites).set(payload).where(eq(websites.id, id));
    };

    try {
      await apply(data);
    } catch (e) {
      if (!isMissingWebsiteColumnError(e)) throw e;
      console.warn("[storage] updateWebsite: missing unlock columns — repairing schema and retrying");
      await ensureWebsiteUnlockColumns();
      try {
        await apply(data);
      } catch (e2) {
        if (!isMissingWebsiteColumnError(e2)) throw e2;
        const { unlockAt: _u, earlyUnlocked: _e, ...rest } = data;
        console.warn("[storage] updateWebsite: fallback without unlock columns");
        await apply(rest);
      }
    }
  }

  async deleteWebsite(id: string, userId: string): Promise<boolean> {
    const result = await dbc()
      .delete(websites)
      .where(and(eq(websites.id, id), eq(websites.userId, userId)))
      .returning({ id: websites.id });
    return result.length > 0;
  }

  // GET USER WEBSITES
  async getUserWebsites(userId: string): Promise<any[]> {
    const query = () =>
      dbc()
        .select()
        .from(websites)
        .where(eq(websites.userId, userId))
        .orderBy(desc(websites.createdAt));

    try {
      return await query();
    } catch (e) {
      if (!isMissingWebsiteColumnError(e)) throw e;
      console.warn("[storage] getUserWebsites: missing unlock columns — repairing schema and retrying");
      await ensureWebsiteUnlockColumns();
      return await query();
    }
  }

  // GET WEBSITE BY ID
  async getWebsiteById(id: string): Promise<any | undefined> {
    const query = () => dbc().select().from(websites).where(eq(websites.id, id));

    try {
      const result = await query();
      return result[0];
    } catch (e) {
      if (!isMissingWebsiteColumnError(e)) throw e;
      console.warn("[storage] getWebsiteById: missing unlock columns — repairing schema and retrying");
      await ensureWebsiteUnlockColumns();
      const result = await query();
      return result[0];
    }
  }

  async getTemplates(): Promise<Template[]> {
    const result = await dbc()
      .select()
      .from(templates)
      .orderBy(desc(templates.createdAt));

    return result;
  }

  async getTemplateById(id: string): Promise<Template | undefined> {
    const result = await dbc()
      .select()
      .from(templates)
      .where(eq(templates.id, id));

    return result[0];
  }

  async createTemplate(data: InsertTemplate): Promise<Template> {
    const result = await dbc()
      .insert(templates)
      .values(data)
      .returning();

    return result[0];
  }

  async deleteTemplate(id: string): Promise<void> {
    await dbc().delete(templates).where(eq(templates.id, id));
  }

  async getSiteImages(sectionName?: string): Promise<SiteImage[]> {
    if (sectionName) {
      const result = await dbc()
        .select()
        .from(siteImages)
        .where(eq(siteImages.sectionName, sectionName))
        .orderBy(desc(siteImages.createdAt));
      return result;
    }
    const result = await dbc().select().from(siteImages).orderBy(desc(siteImages.createdAt));
    return result;
  }

  async getSiteImageById(id: string): Promise<SiteImage | undefined> {
    const result = await dbc().select().from(siteImages).where(eq(siteImages.id, id));
    return result[0];
  }

  async createSiteImage(data: InsertSiteImage): Promise<SiteImage> {
    const result = await dbc().insert(siteImages).values(data).returning();
    return result[0];
  }

  async updateSiteImage(
    id: string,
    data: Partial<InsertSiteImage>,
  ): Promise<SiteImage | undefined> {
    const result = await dbc().update(siteImages).set(data).where(eq(siteImages.id, id)).returning();
    return result[0];
  }

  async deleteSiteImage(id: string): Promise<void> {
    await dbc().delete(siteImages).where(eq(siteImages.id, id));
  }

  async getUserWebsiteCount(userId: string): Promise<number> {
    const result = await dbc().select({ c: count() }).from(websites).where(eq(websites.userId, userId));
    return Number(result[0]?.c ?? 0);
  }

  async getApprovedPurchaseCount(userId: string, productType: string): Promise<number> {
    const result = await dbc()
      .select({ c: count() })
      .from(purchases)
      .where(and(eq(purchases.userId, userId), eq(purchases.productType, productType), eq(purchases.paymentStatus, "approved")));
    return Number(result[0]?.c ?? 0);
  }

  async getPricing(): Promise<Pricing[]> {
    const result = await dbc().select().from(pricing).orderBy(desc(pricing.createdAt));
    return result;
  }

  async upsertPricing(productName: string, price: string): Promise<Pricing> {
    const existing = await dbc().select().from(pricing).where(eq(pricing.productName, productName));
    if (existing[0]) {
      const result = await dbc()
        .update(pricing)
        .set({ price })
        .where(eq(pricing.productName, productName))
        .returning();
      return result[0];
    }
    const result = await dbc().insert(pricing).values({ productName, price }).returning();
    return result[0];
  }

  async createPurchase(data: InsertPurchase): Promise<Purchase> {
    const result = await dbc().insert(purchases).values(data).returning();
    return result[0];
  }

  async listPurchases(status?: string): Promise<
    Array<
      Purchase & {
        userEmail?: string | null;
      }
    >
  > {
    if (status) {
      const result = await dbc()
        .select({
          id: purchases.id,
          userId: purchases.userId,
          productType: purchases.productType,
          amount: purchases.amount,
          paymentStatus: purchases.paymentStatus,
          paymentScreenshot: purchases.paymentScreenshot,
          createdAt: purchases.createdAt,
          userEmail: users.email,
        })
        .from(purchases)
        .leftJoin(users, eq(purchases.userId, users.id))
        .where(eq(purchases.paymentStatus, status))
        .orderBy(desc(purchases.createdAt));
      return result as any;
    }
    const result = await dbc()
      .select({
        id: purchases.id,
        userId: purchases.userId,
        productType: purchases.productType,
        amount: purchases.amount,
        paymentStatus: purchases.paymentStatus,
        paymentScreenshot: purchases.paymentScreenshot,
        createdAt: purchases.createdAt,
        userEmail: users.email,
      })
      .from(purchases)
      .leftJoin(users, eq(purchases.userId, users.id))
      .orderBy(desc(purchases.createdAt));
    return result as any;
  }

  async updatePurchaseStatus(id: string, status: string): Promise<void> {
    await dbc().update(purchases).set({ paymentStatus: status }).where(eq(purchases.id, id));
  }

  async setUserFreeUsed(userId: string): Promise<void> {
    await dbc().update(users).set({ freeWebsiteUsed: true }).where(eq(users.id, userId));
  }

  async isUserFreeUsed(userId: string): Promise<boolean> {
    const result = await dbc().select({ v: users.freeWebsiteUsed }).from(users).where(eq(users.id, userId));
    return Boolean(result[0]?.v);
  }

  async getTotals(): Promise<{
    users: number;
    websites: number;
    purchases: number;
    revenueApproved: number;
    pendingPayments: number;
  }> {
    const usersCount = await dbc().select({ c: count() }).from(users);
    const websitesCount = await dbc().select({ c: count() }).from(websites);
    const purchasesCount = await dbc().select({ c: count() }).from(purchases);
    const pendingCount = await dbc()
      .select({ c: count() })
      .from(purchases)
      .where(eq(purchases.paymentStatus, "pending"));
    const revenueRow = await dbc()
      .select({
        s: sql<number>`COALESCE(SUM(CASE WHEN ${purchases.paymentStatus} = 'approved' THEN (${purchases.amount})::numeric ELSE 0 END), 0)`,
      })
      .from(purchases);
    return {
      users: Number(usersCount[0]?.c ?? 0),
      websites: Number(websitesCount[0]?.c ?? 0),
      purchases: Number(purchasesCount[0]?.c ?? 0),
      revenueApproved: Number(revenueRow[0]?.s ?? 0),
      pendingPayments: Number(pendingCount[0]?.c ?? 0),
    };
  }

  async listUsers(): Promise<Array<Pick<User, "id" | "username" | "email" | "role" | "createdAt">>> {
    const result = await dbc()
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt));
    return result as any;
  }
}

export const storage = new DatabaseStorage();

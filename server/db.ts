import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, reviews, newsletterSubscribers, InsertProduct, InsertReview, InsertNewsletterSubscriber } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Product queries
export async function getAllProducts() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).orderBy(products.createdAt);
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(products).values(product);
    return true;
  } catch (error) {
    console.error("[Database] Failed to create product:", error);
    return false;
  }
}

// Newsletter queries
export async function subscribeToNewsletter(email: string, name?: string) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(newsletterSubscribers).values({ email, name, isSubscribed: true }).onDuplicateKeyUpdate({
      set: { isSubscribed: true, updatedAt: new Date() },
    });
    return true;
  } catch (error) {
    console.error("[Database] Failed to subscribe to newsletter:", error);
    return false;
  }
}

export async function getNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isSubscribed, true));
}

// Review queries
export async function getProductReviews(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(reviews).where(eq(reviews.productId, productId));
}

export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(reviews).values(review);
    return true;
  } catch (error) {
    console.error("[Database] Failed to create review:", error);
    return false;
  }
}

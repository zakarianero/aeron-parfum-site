import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, products, reviews, newsletterSubscribers, productVariants, orders, orderItems, InsertProduct, InsertReview, InsertNewsletterSubscriber, InsertProductVariant, InsertOrder, InsertOrderItem } from "../drizzle/schema";
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

export async function getProductsByCategory(category: 'womens' | 'mens' | 'unisex') {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(products).where(eq(products.category, category)).orderBy(products.createdAt);
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


export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(productVariants).where(eq(productVariants.productId, productId)).orderBy(productVariants.size);
}

export async function createProductVariant(variant: InsertProductVariant) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create variant: database not available");
    return;
  }
  try {
    await db.insert(productVariants).values(variant);
  } catch (error) {
    console.error("[Database] Failed to create variant:", error);
    throw error;
  }
}

// Order queries
export async function createOrder(order: InsertOrder, items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create order: database not available");
    return null;
  }
  try {
    const result = await db.insert(orders).values(order);
    const orderId = (result as any).insertId || result[0];
    
    if (items.length > 0) {
      const itemsWithOrderId = items.map(item => ({
        orderId: orderId as number,
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        price: item.price,
        quantity: item.quantity || 1,
      }));
      await db.insert(orderItems).values(itemsWithOrderId);
    }
    
    return orderId;
  } catch (error) {
    console.error("[Database] Failed to create order:", error);
    throw error;
  }
}

export async function getOrdersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(orders.createdAt);
}

export async function getOrderById(orderId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItemsByOrderId(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).orderBy(orders.createdAt);
}

export async function updateOrderStatus(orderId: number, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update order: database not available");
    return false;
  }
  try {
    await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, orderId));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update order status:", error);
    return false;
  }
}

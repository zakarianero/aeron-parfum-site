import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  try {
    // Check Baccarat Rouge image URL
    const baccarat = await db
      .select()
      .from(products)
      .where(eq(products.name, "Baccarat Rouge"));

    console.log("Baccarat Rouge product:", JSON.stringify(baccarat, null, 2));
  } catch (error) {
    console.error("❌ Error checking product:", error);
  } finally {
    await connection.end();
  }
};

main();

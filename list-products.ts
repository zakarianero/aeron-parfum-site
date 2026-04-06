import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  try {
    // Get all product names
    const allProducts = await db.select({ name: products.name }).from(products);

    console.log("All products in database:");
    allProducts.forEach((p) => console.log(`- ${p.name}`));
  } catch (error) {
    console.error("❌ Error fetching products:", error);
  } finally {
    await connection.end();
  }
};

main();

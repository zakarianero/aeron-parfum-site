import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { productVariants } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  try {
    // Update 30ml variants to 60 DH
    await db
      .update(productVariants)
      .set({ price: 60 })
      .where(eq(productVariants.size, "30ml"));

    console.log("✅ Updated all 30ml variants to 60 DH");

    // Update 50ml variants to 80 DH
    await db
      .update(productVariants)
      .set({ price: 80 })
      .where(eq(productVariants.size, "50ml"));

    console.log("✅ Updated all 50ml variants to 80 DH");

    console.log("✅ All product prices updated successfully!");
  } catch (error) {
    console.error("❌ Error updating prices:", error);
  } finally {
    await connection.end();
  }
};

main();

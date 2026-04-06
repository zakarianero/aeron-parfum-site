import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { productVariants, products } from "./drizzle/schema";
import { eq } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const main = async () => {
  const connection = await mysql.createConnection(process.env.DATABASE_URL!);
  const db = drizzle(connection);

  try {
    // Get Ultra Male product
    const ultraMaleProduct = await db
      .select()
      .from(products)
      .where(eq(products.name, "Ultra Male"));

    if (!ultraMaleProduct || ultraMaleProduct.length === 0) {
      console.error("❌ Ultra Male product not found!");
      return;
    }

    const productId = ultraMaleProduct[0].id;

    // Add 30ml variant
    await db.insert(productVariants).values({
      productId,
      size: "30ml",
      price: 60.0,
    });

    // Add 50ml variant
    await db.insert(productVariants).values({
      productId,
      size: "50ml",
      price: 80.0,
    });

    console.log("✅ Added pricing variants to Ultra Male successfully!");
  } catch (error) {
    console.error("❌ Error adding variants:", error);
  } finally {
    await connection.end();
  }
};

main();

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
    // Update Y Eau de Parfum image
    const imageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/Ydeparfum_dbace33e.png";
    await db
      .update(products)
      .set({ imageUrl: imageUrl })
      .where(eq(products.name, "Y Eau de Parfum"))
      .execute();

    // Get Y Eau de Parfum product
    const yProduct = await db
      .select()
      .from(products)
      .where(eq(products.name, "Y Eau de Parfum"))
      .execute();

    if (!yProduct || yProduct.length === 0) {
      console.error("❌ Y Eau de Parfum product not found!");
      return;
    }

    const productId = yProduct[0].id;

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

    console.log("✅ Updated Y Eau de Parfum image and added pricing variants successfully!");
  } catch (error) {
    console.error("❌ Error updating Y Eau de Parfum:", error);
  } finally {
    await connection.end();
  }
};

main();

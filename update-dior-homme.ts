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
    // Update Dior Homme Intense image
    const imageUrl = "https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/diorhomme_f86992b9.png";
    await db
      .update(products)
      .set({ imageUrl: imageUrl })
      .where(eq(products.name, "Dior Homme Intense"))
      .execute();

    // Get Dior Homme Intense product
    const diorProduct = await db
      .select()
      .from(products)
      .where(eq(products.name, "Dior Homme Intense"))
      .execute();

    if (!diorProduct || diorProduct.length === 0) {
      console.error("❌ Dior Homme Intense product not found!");
      return;
    }

    const productId = diorProduct[0].id;

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

    console.log("✅ Updated Dior Homme Intense image and added pricing variants successfully!");
  } catch (error) {
    console.error("❌ Error updating Dior Homme Intense:", error);
  } finally {
    await connection.end();
  }
};

main();

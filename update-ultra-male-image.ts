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
    // Update Ultra Male image
    await db
      .update(products)
      .set({
        imageUrl:
          "https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/ultramal_6c246bad.png",
      })
      .where(eq(products.name, "Ultra Male"));

    console.log("✅ Updated Ultra Male image successfully!");
  } catch (error) {
    console.error("❌ Error updating image:", error);
  } finally {
    await connection.end();
  }
};

main();

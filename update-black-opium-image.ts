import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

async function updateBlackOpiumImage() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const db = drizzle(connection);

    console.log('🖼️ Updating Black Opium product image...');

    const result = await db
      .update(products)
      .set({ imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/blackopium_f3215c7c.png' })
      .where(eq(products.name, 'Black Opium'));

    console.log('✅ Black Opium image updated successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error updating Black Opium image:', error);
    process.exit(1);
  }
}

updateBlackOpiumImage();

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';

dotenv.config();

async function updateKhamraCategory() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const db = drizzle(connection);

    console.log('🔄 Updating Khamra category from Men\'s to Unisex...');

    const result = await db
      .update(products)
      .set({ category: 'unisex' })
      .where(eq(products.name, 'Khamra'));

    console.log('✅ Khamra category updated to Unisex successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error updating Khamra category:', error);
    process.exit(1);
  }
}

updateKhamraCategory();

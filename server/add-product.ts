import { getDb } from './db';
import { products, productVariants } from '../drizzle/schema';

async function addLaBelle() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    return;
  }

  try {
    // Add the product
    const result = await db.insert(products).values({
      name: 'LA BELLE',
      description: 'A luxurious and delicate floral perfume for sophisticated women',
      price: '60.00' as any,
      volume: '30ml',
      imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/Gemini_Generated_Image_jaaukxjaaukxjaau_58b54ad9.png',
      category: 'womens',
      isAvailable: true,
    });

    console.log('Product added');
  } catch (error) {
    console.error('Error:', error);
  }
}

addLaBelle();

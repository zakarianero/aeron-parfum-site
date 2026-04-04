import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { products } from './drizzle/schema.ts';
import dotenv from 'dotenv';

dotenv.config();

const perfumesToAdd = [
  {
    name: 'Ultra Male',
    description: 'A bold and seductive fragrance with sweet, spicy, and fruity notes, powerful and long-lasting.',
    price: '60.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/ultra-male.webp',
    topNotes: 'Pear, Lavender, Mint',
    heartNotes: 'Cinnamon, Clary Sage',
    baseNotes: 'Vanilla, Amber, Tonka Bean',
    scentType: 'Oriental Fougère',
    longevity: '8-12 hrs',
    season: 'Fall, Winter',
    occasion: 'Evening',
    category: 'mens',
    isAvailable: true,
  },
  {
    name: 'Bleu de Chanel',
    description: 'A fresh and sophisticated fragrance with citrus, woody, and aromatic notes, offering a timeless masculine elegance.',
    price: '65.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/bleu-de-chanel.webp',
    topNotes: 'Lemon, Grapefruit, Mint',
    heartNotes: 'Ginger, Jasmine, Nutmeg',
    baseNotes: 'Sandalwood, Cedar, Incense',
    scentType: 'Woody Aromatic',
    longevity: '6-8 hrs',
    season: 'All seasons',
    occasion: 'Both',
    category: 'mens',
    isAvailable: true,
  },
  {
    name: 'Y Eau de Parfum',
    description: 'A modern and fresh fragrance blending citrus with aromatic herbs and deep woody notes, perfect for confident men.',
    price: '62.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/y-eau-de-parfum.webp',
    topNotes: 'Apple, Bergamot, Ginger',
    heartNotes: 'Sage, Juniper Berries, Geranium',
    baseNotes: 'Amberwood, Tonka Bean, Cedar',
    scentType: 'Fresh Aromatic',
    longevity: '8-10 hrs',
    season: 'Spring, Fall',
    occasion: 'Both',
    category: 'mens',
    isAvailable: true,
  },
  {
    name: 'Tom Ford Métallique',
    description: 'A unique and elegant scent combining metallic freshness with soft florals and creamy vanilla.',
    price: '70.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/tom-ford-metallique.webp',
    topNotes: 'Aldehydes, Pink Pepper, Bergamot',
    heartNotes: 'Hawthorn, Lily-of-the-Valley, Heliotrope',
    baseNotes: 'Vanilla, Sandalwood, Peru Balsam',
    scentType: 'Floral Aldehydic',
    longevity: '6-8 hrs',
    season: 'Spring, Fall',
    occasion: 'Both',
    category: 'unisex',
    isAvailable: true,
  },
  {
    name: 'Khamra',
    description: 'A warm and sweet oriental fragrance with spicy and gourmand notes, rich and addictive.',
    price: '55.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/khamra.webp',
    topNotes: 'Cinnamon, Nutmeg, Bergamot',
    heartNotes: 'Dates, Praline, Tuberose',
    baseNotes: 'Vanilla, Tonka Bean, Amber, Myrrh',
    scentType: 'Oriental Gourmand',
    longevity: '8-12 hrs',
    season: 'Fall, Winter',
    occasion: 'Evening',
    category: 'mens',
    isAvailable: true,
  },
  {
    name: 'Imagination',
    description: 'A fresh and luxurious citrus fragrance with tea and soft woody notes, clean and refined.',
    price: '68.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/imagination.webp',
    topNotes: 'Citron, Bergamot, Orange',
    heartNotes: 'Tea, Neroli, Ginger',
    baseNotes: 'Ambroxan, Guaiac Wood, Olibanum',
    scentType: 'Citrus Aromatic',
    longevity: '6-8 hrs',
    season: 'Summer, Spring',
    occasion: 'Day',
    category: 'mens',
    isAvailable: true,
  },
  {
    name: 'Bianco Latte',
    description: 'A creamy and sweet fragrance with milky, caramel, and vanilla notes, soft and comforting.',
    price: '58.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/bianco-latte.webp',
    topNotes: 'Caramel',
    heartNotes: 'Honey, Coumarin',
    baseNotes: 'Vanilla, White Musk',
    scentType: 'Gourmand',
    longevity: '8-10 hrs',
    season: 'Fall, Winter',
    occasion: 'Both',
    category: 'unisex',
    isAvailable: true,
  },
  {
    name: 'Dior Homme Intense',
    description: 'A refined and elegant fragrance with iris and woody notes, smooth and powdery.',
    price: '72.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/dior-homme-intense.webp',
    topNotes: 'Lavender',
    heartNotes: 'Iris, Ambrette',
    baseNotes: 'Cedar, Vetiver',
    scentType: 'Woody Floral',
    longevity: '8-10 hrs',
    season: 'Fall, Winter',
    occasion: 'Evening',
    category: 'mens',
    isAvailable: true,
  },
  {
    name: 'Stronger With You Absolutely',
    description: 'An intense and sweet fragrance with boozy rum, vanilla, and warm chestnut notes.',
    price: '64.00',
    volume: '30ml',
    imageUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663488572922/NY6Sgf7RkuGqRky5rHN6dU/stronger-with-you.webp',
    topNotes: 'Rum, Bergamot',
    heartNotes: 'Lavender, Davana',
    baseNotes: 'Vanilla, Chestnut, Cedar',
    scentType: 'Oriental Fougère',
    longevity: '8-12 hrs',
    season: 'Fall, Winter',
    occasion: 'Evening',
    category: 'mens',
    isAvailable: true,
  },
];

async function seedPerfumes() {
  try {
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);

    console.log('🌱 Starting to seed perfumes...');

    for (const perfume of perfumesToAdd) {
      await db.insert(products).values(perfume);
      console.log(`✅ Added: ${perfume.name}`);
    }

    console.log('✨ All perfumes added successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error seeding perfumes:', error);
    process.exit(1);
  }
}

seedPerfumes();

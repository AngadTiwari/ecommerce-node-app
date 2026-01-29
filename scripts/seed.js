
import { connectMongo, getDb } from '../src/db/mongo.js';

async function run(){
  await connectMongo();
  const db = getDb();
  const demo = [
    { name: 'T-shirt', sku: 'TSHIRT-BLACK-M', price: 499, category: 'apparel', stock: 100 },
    { name: 'Coffee Mug', sku: 'MUG-11OZ-WHITE', price: 299, category: 'kitchen', stock: 250 },
    { name: 'USB-C Cable', sku: 'USBC-1M', price: 199, category: 'electronics', stock: 500 }
  ];
  for(const p of demo){
    await db.collection('products').updateOne(
      { sku: p.sku },
      { $setOnInsert: { ...p, createdAt: new Date(), updatedAt: new Date() } },
      { upsert: true }
    );
  }
  console.log('Seeded products.');
  process.exit(0);
}

run().catch((e)=>{ console.error(e); process.exit(1); });

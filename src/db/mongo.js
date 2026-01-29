
import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from '../config.js';

let client; let db;

export async function connectMongo(){
  if(client) return { client, db };
  const uri = config.uri; if(!uri) throw new Error('AZURE_COSMOS_MONGO_URI is required');

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(config.dbName);
  await ensureIndexes(db);
  return { client, db };
}

async function ensureIndexes(db){
  const users = db.collection('users');
  const products = db.collection('products');
  const carts = db.collection('carts');
  const orders = db.collection('orders');

  await users.createIndex({ email: 1 }, { unique: true });
  await products.createIndex({ sku: 1 }, { unique: true });
  //await carts.createIndex({ userId: 1 }, { unique: true });
  await orders.createIndex({ userId: 1, createdAt: -1 });
}

export function getDb(){ if(!db) throw new Error('Mongo not connected. Call connectMongo() first.'); return db }

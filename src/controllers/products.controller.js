
import { getDb } from '../db/mongo.js';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const productSchema = z.object({ name: z.string().min(1), sku: z.string().min(1), price: z.number().nonnegative(), category: z.string().default('general'), description: z.string().optional(), imageUrl: z.string().url().optional(), stock: z.number().int().nonnegative().default(0) });

export async function listProducts(req, res){
  const db = getDb();
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    db.collection('products').find().skip(skip).limit(pageSize).toArray(),
    db.collection('products').countDocuments()
  ]);
  res.json({ items, page, pageSize, total });
}

export async function getProduct(req, res){
  const db = getDb();
  let objId; try{ objId = new ObjectId(req.params.id) }catch{ return res.status(400).json({ error: 'Invalid id' }) }
  const p = await db.collection('products').findOne({ _id: objId });
  if(!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
}

export async function createProduct(req, res){
  try{
    const body = productSchema.parse({ ...req.body, price: Number(req.body.price), stock: req.body.stock !== undefined ? Number(req.body.stock) : undefined });
    const db = getDb();
    const { insertedId } = await db.collection('products').insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() });
    res.status(201).json({ id: String(insertedId) });
  }catch(err){
    if(err.code === 11000) return res.status(409).json({ error: 'SKU already exists' });
    if(err.name === 'ZodError') return res.status(400).json({ error: err.issues });
    res.status(500).json({ error: 'Create product failed' });
  }
}

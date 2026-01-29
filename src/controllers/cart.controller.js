
import { getDb } from '../db/mongo.js';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

const modifySchema = z.object({ productId: z.string().min(1), qty: z.number().int().positive() });

export async function getCart(req, res){
  const db = getDb();
  const userId = req.user.sub;
  let cart = await db.collection('carts').findOne({ userId });
  if(!cart) cart = { userId, items: [], updatedAt: new Date() };
  res.json(cart);
}

export async function addOrUpdateItem(req, res){
  const db = getDb();
  const userId = req.user.sub;
  const body = modifySchema.parse({ productId: req.body.productId, qty: Number(req.body.qty) });
  let product; try{ product = await db.collection('products').findOne({ _id: new ObjectId(body.productId) }) }catch{ return res.status(400).json({ error: 'Invalid productId' }) }
  if(!product) return res.status(404).json({ error: 'Product not found' });
  const item = { productId: String(product._id), name: product.name, price: product.price, qty: body.qty };
  
  const result = await db.collection('carts').findOneAndUpdate(
    { userId },
    [
      {
        $set: {
          items: {
            $let: {
              vars: {
                // Default to [] if items is null/missing
                items: { $ifNull: ['$items', []] }
              },
              in: {
                $cond: [
                  // If productId exists in items -> update that item
                  {
                    $in: [
                      item.productId,
                      {
                        $map: {
                          input: '$$items',
                          as: 'i',
                          in: '$$i.productId'
                        }
                      }
                    ]
                  },
                  // Map & replace the matched item
                  {
                    $map: {
                      input: '$$items',
                      as: 'i',
                      in: {
                        $cond: [
                          { $eq: ['$$i.productId', item.productId] },
                          {
                            // merge desired fields into the matched item
                            $mergeObjects: [
                              '$$i',
                              {
                                qty: item.qty,
                                price: item.price,
                                name: item.name
                              }
                            ]
                          },
                          '$$i'
                        ]
                      }
                    }
                  },
                  // Else append the new item
                  {
                    $concatArrays: ['$$items', [item]]
                  }
                ]
              }
            }
          },
          updatedAt: new Date()
        }
      }
    ],
    { upsert: true, returnDocument: 'after' }
  );

  res.json(result.value);
}

export async function removeItem(req, res){
  const db = getDb();
  const userId = req.user.sub;
  const productId = String(req.params.productId);
  const result = await db.collection('carts').findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } }, $set: { updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  res.json(result.value || { userId, items: [] });
}

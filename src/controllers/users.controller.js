
import { getDb } from '../db/mongo.js';
import { ObjectId } from 'mongodb';

export async function me(req, res){
  const db = getDb();
  const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.sub) }, { projection: { passwordHash: 0 } });
  if(!user) return res.status(404).json({ error: 'Not found' });
  res.json({ id: String(user._id), name: user.name, email: user.email, createdAt: user.createdAt });
}


import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { ObjectId } from 'mongodb';
import { getDb } from '../db/mongo.js';

export async function authRequired(req, res, next){
  const header = req.headers.authorization || '';
  const [, token] = header.split(' '); // Bearer <token>
  if(!token) return res.status(401).json({ error: 'Unauthorized' });
  try{
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload; // { sub, email }
    const db = getDb();
    const found = await db.collection('users').findOne({ _id: new ObjectId(payload.sub) });
    if(!found) return res.status(401).json({ error: 'User no longer exists' });
    next();
  }catch(e){
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

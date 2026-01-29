
import { getDb } from '../db/mongo.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { z } from 'zod';

const signupSchema = z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(6) });
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function signup(req, res){
  try{
    const body = signupSchema.parse(req.body);
    const db = getDb();
    const passwordHash = await bcrypt.hash(body.password, 10);
    const { insertedId } = await db.collection('users').insertOne({ name: body.name, email: body.email.toLowerCase(), passwordHash, createdAt: new Date() });
    const token = jwt.sign({ sub: String(insertedId), email: body.email }, config.jwtSecret, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: String(insertedId), name: body.name, email: body.email } });
  }catch(err){
    if(err.code === 11000) return res.status(409).json({ error: 'Email already in use' });
    if(err.name === 'ZodError') return res.status(400).json({ error: err.issues });
    res.status(500).json({ error: 'Signup failed' });
  }
}

export async function login(req, res){
  try{
    const body = loginSchema.parse(req.body);
    const db = getDb();
    const user = await db.collection('users').findOne({ email: body.email.toLowerCase() });
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ sub: String(user._id), email: user.email }, config.jwtSecret, { expiresIn: '7d' });
    res.json({ token, user: { id: String(user._id), name: user.name, email: user.email } });
  }catch(err){
    if(err.name === 'ZodError') return res.status(400).json({ error: err.issues });
    res.status(500).json({ error: 'Login failed' });
  }
}

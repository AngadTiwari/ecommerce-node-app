
import { getDb } from '../db/mongo.js';

export async function placeOrder(req, res){
  const db = getDb();
  const userId = req.user.sub;
  const userEmail = req.user.email;
  const cart = await db.collection('carts').findOne({ userId });
  if(!cart || !cart.items || cart.items.length === 0) return res.status(400).json({ error: 'Cart is empty' });
  const total = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = { userId, userEmail, items: cart.items, total, status: 'PLACED', createdAt: new Date() };
  const { insertedId } = await db.collection('orders').insertOne(order);
  await db.collection('carts').updateOne({ userId }, { $set: { items: [], updatedAt: new Date() } });
  res.status(201).json({ id: String(insertedId), total, status: order.status });
  
  // Fire-and-forget POST to external API with required payload
  const payload = {
    userId,
    userEmail,
    orderId: String(insertedId),
    items: cart.items,
    total,
  };

  notifyOrderPlaced(payload).then((result) => {
    if (result.ok) {
      console.log('[orderTrigger] POST success:', result.status);
    } else {
      console.warn('[orderTrigger] POST failed:', result);
    }
  });
}


// POST helper with timeout, returns { ok, status, body|error }
async function notifyOrderPlaced(payload) {
  const ORDER_TRIGGER_URL =
  'https://func-assginment-app-dev-fzcrewesddcsd8dj.centralindia-01.azurewebsites.net/api/orderTrigger';

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 4000); // 4s timeout

  try {
    const res = await fetch(ORDER_TRIGGER_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(t);

    const text = await res.text().catch(() => '');
    let parsed = null;
    try { parsed = JSON.parse(text); } catch { /* ignore non-JSON */ }

    if (!res.ok) {
      return { ok: false, status: res.status, body: parsed ?? text ?? null };
    }
    return { ok: true, status: res.status, body: parsed ?? text ?? null };
  } catch (err) {
    clearTimeout(t);
    return { ok: false, error: String(err?.message || err) };
  }
}

export async function listOrders(req, res){
  const db = getDb();
  const userId = req.user.sub;
  const orders = await db.collection('orders').find({ userId }).sort({ createdAt: -1 }).toArray();
  res.json(orders);
}

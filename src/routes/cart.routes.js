
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getCart, addOrUpdateItem, removeItem } from '../controllers/cart.controller.js';

const router = Router();

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', authRequired, getCart);

/**
 * @openapi
 * /api/cart/items:
 *   post:
 *     summary: Add or update cart item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string }
 *               qty: { type: integer }
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.post('/items', authRequired, addOrUpdateItem);

/**
 * @openapi
 * /api/cart/items/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated cart
 */
router.delete('/items/:productId', authRequired, removeItem);

export default router;

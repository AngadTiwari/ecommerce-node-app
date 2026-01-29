
import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { placeOrder, listOrders } from '../controllers/orders.controller.js';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Place an order from current cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authRequired, placeOrder);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: List orders for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', authRequired, listOrders);

export default router;
